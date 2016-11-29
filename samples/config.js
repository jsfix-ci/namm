module.exports = {
    port: 5555,                                   // [optional] a port to test your application locally

    mongooseTestConn: 'mongodb://MONGO_URL',      // mongo connections url

    mg_api_key: 'key-MAILGUN_KEY',                // mailgun email api credentials
    mg_domain: 'MAILGUN_DOMAIN',                  // for lost password stuff
}