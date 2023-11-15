const express = require('express');

const { google } = require('googleapis');
const calendar = google.calendar('v3');
const opn = require('opn');
const session = require('express-session');

const app = express();

const PORT = 3000;
const REDIRECT_URL = 'http://localhost:3000/oauth2callback';

// Configure the session
app.use(
  session({
    secret: 'AIzaSyAsjYiQbNuymUQhlX5ydG5fHldyxVnPV-c',
    resave: false,
    saveUninitialized: true,
  })
);

// Google API credentials
const credentials = {
  client_id: '536884349369-jnqfdg787b4jmoi08lnm8n3tfhbs4nlm.apps.googleusercontent.com',
  client_secret: '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',
  redirect_uris: [REDIRECT_URL],
};

// Create an OAuth client
const oAuth2Client = new google.auth.OAuth2(
  credentials.client_id,
  credentials.client_secret,
  REDIRECT_URL
);

// Generate the OAuth URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/calendar'],
});




// Assuming your oAuth2Client is already configured

// Function to create a new event
async function createEvent(auth) {
  const event = {
    summary: 'Sample Event',
    description: 'This is a sample event created by the Google Calendar Blocking App.',
    start: {
      dateTime: '2023-11-15T10:00:00', // Replace with your desired start time
      timeZone: 'Asia/Kolkata', // Replace with your time zone
    },
    end: {
      dateTime: '2023-11-15T11:00:00', // Replace with your desired end time
      timeZone: 'Asia/Kolkata', // Replace with your time zone
    },
    'attendees': [
      {'email': 'ashishraa189@gmail.com'},
      {'email': 'ashishgupta@masaischool.com'},
      {'email': 'bestinshifting@gmail.com'}
    ],
  };

  try {
    const response = await calendar.events.insert({
      auth,
      calendarId: 'primary', // Use 'primary' for the user's primary calendar
      resource: event,
    });

    console.log('Event created:', response.data);
  } catch (error) {
    console.error('Error creating event:', error.message);
  }
}


// Function to fetch events for a specific email
async function listEvents(auth, userEmail) {
  try {
    const response = await calendar.events.list({
      auth,
      calendarId: 'primary', // Use 'primary' for the user's primary calendar
      timeMin: new Date().toISOString(), // Fetch events starting from the current date
      maxResults: 10, // Maximum number of events to retrieve (adjust as needed)
      singleEvents: true,
      orderBy: 'startTime',
      q: userEmail, // Search for events associated with the specified email
    });

    const events = response.data.items;
    console.log('Events for', userEmail, ':');
    events.forEach((event, index) => {
      const start = event.start.dateTime || event.start.date;
      console.log(`${index + 1}. ${event.summary} (Start: ${start})`);
    });
  } catch (error) {
    console.error('Error fetching events:', error.message);
  }
}


// Assuming your app's route for scheduling an event
app.get('/schedule-event', async (req, res) => {
  try {
    // Check if tokens are available in the session
    if (!req.session.tokens) {
      throw new Error('User not authenticated. Please log in first.');
    }

    // Set tokens from the session
    oAuth2Client.setCredentials(req.session.tokens);

    // Call the function to create an event
    await createEvent(oAuth2Client);

    res.send('Event scheduled successfully!');
  } catch (error) {
    console.error('Error scheduling event:', error.message);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/list-events/:email', async (req, res) => {
  try {
    // Check if tokens are available in the session
    if (!req.session.tokens) {
      throw new Error('User not authenticated. Please log in first.');
    }

    // Set tokens from the session
    oAuth2Client.setCredentials(req.session.tokens);

    const userEmail = req.params.email;
    if (!userEmail) {
      throw new Error('Email parameter is missing.');
    }

    // Call the function to list events for the specified email
    await listEvents(oAuth2Client, userEmail);
    console.log(listEvents)
    res.send(`Events listed successfully for ${userEmail}!`);
  } catch (error) {
    console.error('Error listing events:', error.message);
    res.status(500).send('Internal Server Error');
  }
});


// Redirect to Google OAuth consent screen
app.get('/', (req, res) => {
    console.log("application started")
  res.redirect(authUrl);
});

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

    // Store the tokens in the session
    req.session.tokens = tokens;

    // Redirect to the main page or any other route you want
    res.redirect('/schedule-event')
  } catch (error) {
    console.error('Error exchanging code for tokens:', error.message);
    res.status(500).send('Internal Server Error');
  }
});
 
app.get('/login', (req, res) => {
try {
  console.log("loginsuccessfully ")
  res.status(200).send('Login SUccessfull');
} catch (error) {
      console.error('Error exchanging code for tokens:', error.message);
    res.status(500).send('Internal Server Error');
}
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    opn(authUrl); // Open the browser for authentication
  });
