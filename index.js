require('dotenv').config();

const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const OAuth2Client = new OAuth2(
    process.env.CALENDAR_CLIENT_ID,
    process.env.CALENDAR_CLIENT_SECRET
);

OAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});

const calendar = google.calendar({ version: 'v3', auth: OAuth2Client });

const eventStartTime = new Date(Date.UTC(2023, 11, 7, 10, 0, 0));

const eventEndTime = new Date(Date.UTC(2023, 11, 7, 11, 0, 0));

const event = {
    summary: 'Meet Janelle',
    location: 'Figueroa Alcorta 285 , Cordoba , Argentina',
    description: 'English class',
    start: {
        dateTime: eventStartTime,
        timeZone: 'America/Argentina/Cordoba',
    },
    end: {
        dateTime: eventEndTime,
        timeZone: 'America/Argentina/Cordoba',
    },

    colorId: 3,
};

// calendar.events.insert(
//     {
//         calendarId: 'primary',
//         resource: event,
//     },
//     function (err, event) {
//         if (err) {
//             console.log('There was an error contacting the Calendar service: ' + err );
//             return;
//         }
//         console.log('Event created: %s', event.htmlLink);
//     }
// );

// calendar.freebusy.query(
//     {
//         resourse: {
//             timeMin: eventStartTime,
//             timeMax: eventEndTime,
//             timeZone: 'America/Argentina/Cordoba',
//             items: [{ id: 'primary' }], //calendars
//         },
//     },

//     (err, res) => {
//         if (err) return console.error('Free busy query Error ', err);

//         const eventsArr = res.data.calendars.primary.busy;

//         if (eventsArr.length === 0)
//             return calendar.events.insert(
//                 { calendarId: 'primary', resourse: event },
//                 (err) => {
//                     if (err)
//                         return console.error('calendar creation error ', err);

//                     return console.log('calendar event created.');
//                 }
//             );

//         return console.log(`Sorry I'm busy`);
//     }
// );

async function getCalendarEvents(calendar) {
    // check current events
    const eventsRes = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date(),
        timeMax: '2024-01-01T10:00:00-07:00',
        maxResults: 99,
        singleEvents: true,
        orderBy: 'startTime',
    });

    const upcomingEvents = eventsRes.data.items;

    // log events
    console.log(
        `Retrieved ${upcomingEvents.length} upcoming calendar appointment(s):`
    );
    upcomingEvents.forEach((event) => {
        console.log(
            `Description: ${event.summary} Comienza: ${event.start.dateTime}`
        );
    });
    console.log('\r\n');

    return upcomingEvents;
}

getCalendarEvents(calendar);
