const config = {
  app: {
    eventRequestURLEndpoint: 'http://localhost:3000/api/event',
    orgRequestURLEndpoint: 'http://localhost:3000/api/organization',
  },
  db: {
    host: 'localhost',
    port: 27017,
    name: 'hb_cal',
  }
}

module.exports = config
