const dbConfig = require('./config/config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, { useUnifiedTopology: true }, {useNewUrlParser: true});

mongoose.connection
    .once('open', () => console.log("Connected"))
    .on('error', (error) => {
        console.log("Connection error", error);
    });