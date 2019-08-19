# hb_cal (Horseblanket Calendar) reads events from a database and displays them in a 'horseblanket' view (days across the top, a new row for each category of events).


## Features:
- iCal import. Calendars from Google Calendar are supported, unknown whether other types of .ics files are supported at this time.



## Instructions

- Clone this repository
- Change directory to the cloned repository
- Once inside the directory, use `npm install` to download dependencies
- Start the application using `npm start`
- Browse to the calendar view locally, open `localhost:3000` in a web browser

Requirements
- Node.js with npm
- MongoDB

Host a mongodb locally with the database name "hb_cal" to read and store data.

Add events (in the form "2019-08-12" for the date format).


Start MongoDB before starting the app. The page will hang if MongoDB is not running while the app is being run.

`# sudo systemctl start mongod`



## Debugging:

The app can be run in normal mode:

`$ npm start`

Or it can be run in debug mode:

`$ npm run debug`

Open up a Chrome browser to connect to the debugger on port 9229. Go to `about://inspect` to debug the app.


