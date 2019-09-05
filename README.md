# hb_cal (Horseblanket Calendar) reads events from a database and displays them in a 'horseblanket' view (days across the top, a new row for each category of events).


## Features:
- iCal import. Calendars from Google Calendar are supported, unknown whether other types of .ics files are supported at this time.

## Instructions

- Clone this repository
- Change directory to the cloned repository
- Once inside the directory, use `npm install` to download dependencies
- Start the application using `npm start`
- Browse to the calendar view locally, open `localhost:3000` in a web browser

### Requirements
- Node.js with npm
- MongoDB

Host a mongodb locally with the database name "hb_cal" to read and store data.

Add events (in the form "2019-08-12" for the date format).


### Start MongoDB before starting the app. 

The page will hang if MongoDB is not running while the app is being run.

`# sudo systemctl start mongod`


## Debugging:

The app can be run in normal mode:

`$ npm start`

Or it can be run in debug mode:

`$ npm run debug`

Open up a Chrome browser to connect to the debugger on port 9229. Go to `about://inspect` to debug the app.

## Data Models

An event has the following structure in MongoDB:

Event Document
```
{ 
  "_id" : ObjectId("5d6e30da51850180ce132f55"), 
  "vevent" : 
    [ "vevent", 
      [ 
        [ "summary", {  }, "text", "Event Title Text" ], 
        [ "category", {  }, "unknown", "Event Category Text" ], 
        [ "type", {  }, "unknown", "Event Type Text" ], 
        [ "location", {  }, "text", "Event Location Text" ], 
        [ "dtstart", {  }, "date", "2019-09-02" ], 
        [ "dtend", {  }, "date", "2019-09-05" ] 
      ], 
      [ ] 
    ] 
}
```

Calendar events are stored in jCal format for ease of transport.

Other events are stored with additional fields but still compliant with jCal format.

Person data model
```
{ 
  "_id" : ObjectId("5d6e30da51850180ce132f55"), 
  "person" : 
    [ "name_first", {  }, "text", "First Name Text" ], 
    [ "name_middle", {  }, "text", "Middle Name Text" ], 
    [ "name_last", {  }, "text", "Last Name Text" ], 
    [ "dob", {  }, "date", "Date of Birth" ], 
    [ "id_num", {  }, "text", "Person Identification Number" ], 
}
```

Location data model
```
{ 
  "_id" : ObjectId("5d6e30da51850180ce132f55"), 
  "location" : 
    [ "summary", {  }, "text", "Location Title Text" ], 
    [ "category", {  }, "text", "Location Category Text" ], 
    [ "address", {  }, "text", "Location Address Text" ], 
    [ "lat", {  }, "text", "Location Latitude" ], 
    [ "long", {  }, "text", "Location Longitude" ], 
}
```

## Future Work

Provide resource scheduling (people, location, resource) through an API.
Provide recommendations for deconfliction and planning assistance.

Allow for a 'automated scheduler' that will suggest when to plan events based on available resources.

