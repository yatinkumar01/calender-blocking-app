import express, { request } from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import opn from 'opn';
import { v4 as uuid } from 'uuid';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors'
import nodemailer from 'nodemailer'
dotenv.config();

const calendar = google.calendar({
  version: "v3",
});

const app = express();

// here we are saving the token by which we are authenticating again and again in our functions
var tokenn;
var userEmail;

app.use(bodyParser.json());
app.use(cors());

//Configure the session
app.use(
    session({
      secret: process.env.API_KEY,
      resave: false,
      saveUninitialized: true,
    })
  );
  

const PORT = process.env.NODE_ENV || 8080;

//Authentication happens here
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const oauth2 = google.oauth2({
  auth: oAuth2Client,
  version: 'v2', // Specify the version
});

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/calendar',  'https://www.googleapis.com/auth/userinfo.email'],
});


// Function to send email to attendees using OAuth 2.0
async function sendEmailToAttendees(message,attendees, event) {
  try {
    // Create reusable transporter object using the OAuth2 transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: userEmail,
        pass: process.env.app_pass,
      },
    });

    // Prepare email text with event details
    const emailText = `
      ${message}

      Event Summary: ${event.summary}
      Description: ${event.description}
      Start Time: ${event.start.dateTime}
      End Time: ${event.end.dateTime}
      meetingLink : ${event.hangoutLink}
      location: ${event.location}
      eventId: ${event.id}

      Please check your calendar for more details.
    `;

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: userEmail,
      to: attendees.map(attendee => attendee.email).join(','),
      subject: `${message} `,
      text: emailText,
    });

    console.log('Email sent:', info);

  } catch (error) {
    console.error('Error sending email:', error.message);
  }
}



//function for getting all the events scheduled to a particular email
async function listEvents(auth, userEmail) {
    try {
        const response = await calendar.events.list({
            auth,
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 8,
            singleEvents: true,
            orderBy: 'startTime',
            attendee: userEmail,
        });

        const events = response.data.items;
        const eventDetails = [];

        events.forEach((event) => {
            const start = event.start.dateTime || event.start.date;
            const eventObject = {
                summary: event.summary,
                description: event.description,
                start: start,
                end: event.end.dateTime || event.end.date,
                attendees: event.attendees,
                meetLink: event.conferenceData,
                location: event.location,
                eventId: event.id,
            };
            eventDetails.push(eventObject);
        });

        return eventDetails;
    } catch (error) {
        console.error('Error fetching events:', error.message);
        throw error;
    }
}


// Function to update an existing event
async function updateEvent(auth, eventId, updatedEvent) {
    try {
      const response = await calendar.events.update({
        auth,
        calendarId: 'primary',
        eventId,
        conferenceDataVersion:1,
        resource: updatedEvent,
      });
      
      console.log('Event updated:', response.data);
      return response
    } catch (error) {
      console.error('Error updating event:', error.message);
    }
  }


// Function to delete an existing event
async function deleteEvent(auth, eventId) {
    try {
       // Fetch the event data before deleting
       const eventResponse = await calendar.events.get({
        auth,
        calendarId: 'primary',
        eventId,
      });


      await calendar.events.delete({
        auth,
        calendarId: 'primary',
        eventId,
      });
      
      console.log('Event deleted successfully:', eventId);
      return eventResponse
    } catch (error) {
      console.error('Error deleting event:', error.message);
    }
  }
  

app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  console.log("abcd")
  try {
    if (!code) {
      throw new Error('Authorization code not found in the URL.');
    }

    // Log the received authorization code
    console.log('Received authorization code:', code);

    // Exchange the code for tokens
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Log the obtained tokens
    console.log('Obtained tokens:', tokens);

    //console.log(oAuth2Client)
    // Fetch user's email using the access token
    const userInfoResponse = await oauth2.userinfo.get();
    userEmail = userInfoResponse.data.email;

    console.log('User email:', userEmail);

    // Log the user's email
    console.log('User email:', userEmail);

    //
    // Store the tokens in the session and the tokenn variable
    req.session.tokens = tokens;
     tokenn = req.session.tokens;
     //res.send("login successful")
    // Redirect to the main page or any other route you want
    res.redirect('http://localhost:3000/')
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post("/schedule_event", async (req, res) => {
  try {
    const eventData = req.body;

    console.log("Received event data from frontend:", eventData);

    const startDateTime = dayjs(eventData.startDateTime).toISOString();
    const endDateTime = dayjs(eventData.endDateTime).toISOString();

    console.log('Session:', req.session);

    if (!tokenn) {
      throw new Error('User not authenticated. Please log in first.');
    }

    // Set tokens from the session
    oAuth2Client.setCredentials(tokenn);

    const response=await calendar.events.insert({
      calendarId: "primary",
      auth: oAuth2Client,
      conferenceDataVersion: 1,
      requestBody: {
        summary: eventData.summary,
        description: eventData.description,
        location: eventData.location,
        start: {
          dateTime: startDateTime,
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: endDateTime,
          timeZone: "Asia/Kolkata",
        },
        conferenceData: {
          createRequest: {
            requestId: uuid(),
          },
        },
        attendees: eventData.attendees,
      },
    });

    console.log('Event created:', response.data);
    sendEmailToAttendees(`Invitation scheduled from ${userEmail} to a meeting`,response.data.attendees,response.data)
    res.send({
      msg: "Event created successfully",
    });
  } catch (error) {
    console.error('Error creating event:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/list-events/:email', async (req, res) => {
    try {
        if (!tokenn) {
            throw new Error('User not authenticated. Please log in first.');
        }

        oAuth2Client.setCredentials(tokenn);

        console.log(userEmail)
        const eventDetails = await listEvents(oAuth2Client, userEmail);
        console.log(eventDetails)
        res.json(eventDetails);
    } catch (error) {
        console.error('Error listing events:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


// Assuming your app's route for updating an event
app.post('/update-event/:eventId', async (req, res) => {
    try {
        const eventData = req.body;

    console.log("Received event data from frontend:", eventData);

    const startDateTime = dayjs(eventData.startDateTime).toISOString();
    const endDateTime = dayjs(eventData.endDateTime).toISOString();

    if (!tokenn) {
      throw new Error('User not authenticated. Please log in first.');
    }

    // Set tokens from the session
    oAuth2Client.setCredentials(tokenn);
    const updatedEvent = {
        summary: eventData.summary,
        description: eventData.description,
        location: eventData.location,
        start: {
          dateTime: startDateTime,
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: endDateTime,
          timeZone: "Asia/Kolkata",
        },
        conferenceData: {
          createRequest: {
            requestId: uuid(),
          },
        },
        attendees: eventData.attendees,
    }
      const eventId = req.params.eventId;
      if (!eventId) {
        throw new Error('Event ID parameter is missing.');
      }
      
      // Call the function to update the event
      const response=await updateEvent(oAuth2Client, eventId, updatedEvent);
      sendEmailToAttendees(`Invitation updated from ${userEmail} to a meeting`,response.data.attendees,response.data)
      res.send(`Event updated successfully with ID: ${eventId}!`);
    } catch (error) {
      console.error('Error updating event:', error.message);
      res.status(500).send('Internal Server Error');
    }
  });
  

// Assuming your app's route for deleting an event
app.get('/delete-event/:eventId', async (req, res) => {
    try {
      // Check if tokens are available in the session
      if (!tokenn) {
        throw new Error('User not authenticated. Please log in first.');
      }
  
      // Set tokens from the session
      oAuth2Client.setCredentials(tokenn);
  
      const eventId = req.params.eventId;
      if (!eventId) {
        throw new Error('Event ID parameter is missing.');
      }
  
      // Call the function to delete the event
      const response=await deleteEvent(oAuth2Client, eventId);
  
      sendEmailToAttendees(`Invitation deleted from ${userEmail} `,response.data.attendees,response.data)
      res.send(`Event deleted successfully with ID: ${eventId}!`);
    } catch (error) {
      console.error('Error deleting event:', error.message);
      res.status(500).send('Internal Server Error');
    }
  });

app.get('/', (req, res) => {
    console.log("application started")
  res.redirect(authUrl);
});

app.listen(PORT, (req, res) => {
  console.log(`Server running on PORT ${PORT}`);
  opn(authUrl); // Open the browser for authentication
});

