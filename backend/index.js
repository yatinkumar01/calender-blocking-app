import express, { request } from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import opn from 'opn';
import { v4 as uuid } from 'uuid';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors'
dotenv.config();

const calendar = google.calendar({
  version: "v3",
});

const app = express();

// here we are saving the token by which we are authenticating again and again in our functions
var tokenn;

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

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/calendar'],
});


//function for getting all the events scheduled to a particular email
async function listEvents(auth, userEmail) {
    try {
        const response = await calendar.events.list({
            auth,
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
            q: userEmail,
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
    } catch (error) {
      console.error('Error updating event:', error.message);
    }
  }


// Function to delete an existing event
async function deleteEvent(auth, eventId) {
    try {
      await calendar.events.delete({
        auth,
        calendarId: 'primary',
        
        eventId,
      });
  
      console.log('Event deleted successfully:', eventId);
    } catch (error) {
      console.error('Error deleting event:', error.message);
    }
  }
  

app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;

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

    //
    // Store the tokens in the session and the tokenn variable
    req.session.tokens = tokens;
     tokenn = req.session.tokens;

    // Redirect to the main page or any other route you want
    res.redirect('http://localhost:3000/')
  } catch (error) {
    console.error('Error exchanging code for tokens:', error.message);
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

        const userEmail = req.params.email;
        if (!userEmail) {
            throw new Error('Email parameter is missing.');
        }

        const eventDetails = await listEvents(oAuth2Client, userEmail);
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
      await updateEvent(oAuth2Client, eventId, updatedEvent);
  
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
      await deleteEvent(oAuth2Client, eventId);
  
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

