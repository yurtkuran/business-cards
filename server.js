const express = require('express');
const path = require('path');

// clear console
// process.stdout.write('\033c');

// configure dotenv - bring in configuration variables, passwords and keys
require('dotenv').config();

// set timezone
process.env.TZ = 'America/New_York';

// bring in local dependencies
const { logTime } = require('./modules/knowMoment');
const connectDB = require('./config/db');

// connect to database
connectDB.connectMongoDB(); // mongo database

// initalize app
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));

// define routes
app.use('/api/bcards', require('./routes/businessCards'));
app.use('/api/tags', require('./routes/tags'));

// server static assets in production
if (process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static('client/build'));

    // set default 'route'
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
} else {
    // inital route - development
    app.get('/', (req, res) => res.send('api running...'));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`${logTime()}: Server started on port ${PORT}`);
});
