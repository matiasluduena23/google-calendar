const { google } = require('googleapis');

const { OAuth2 } = google.auth;

const OAuth2Client = new OAuth2(
    '823079584256-46st23ifl3lskog0fm0v27dv251094tl.apps.googleusercontent.com',
    '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'
);

OAuth2Client.setCredentials({
    refresh_token:
        '1//042SsyRDmnyF7CgYIARAAGAQSNwF-L9IrJKg7fMHIhxsA7iZBi-J2sw9YaHU1zC0Gmu1Yi26dY7YV02sZynknI80bTlSy-2RCCPY',
});

const calendar = google.calendar({ version: 'v3', auth: OAuth2Client });

const eventStartTime = new Date();
eventStartTime.setDate(eventStartTime.getDay() + 2);

const eventEndTime = new Date();
eventEndTime.setDate(eventStartTime.getDay() + 2);
eventEndTime.setMinutes(eventStartTime.getMinutes() + 40);

console.log(eventStartTime, eventEndTime);

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

    colorId: 4,
};

calendar.freebusy.query(
    {
        resourse: {
            timeMin: eventStartTime,
            timeMax: eventEndTime,
            timeZone: 'America/Argentina/Cordoba',
            items: [{ id: 'primary' }], //calendars
        },
    },

    (err, res) => {
        if (err) return console.error('Free busy query Error ', err);

        const eventsArr = res.data.calendars.primary.busy;

        if (eventsArr.length === 0)
            return calendar.events.insert(
                { calendarId: 'primary', resourse: event },
                (err) => {
                    if (err)
                        return console.error('calendar creation error ', err);

                    return console.log('calendar event created.');
                }
            );

        return console.log(`Sorry I'm busy`);
    }
);
