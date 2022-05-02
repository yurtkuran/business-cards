const mongoose = require('mongoose');

// bring in local dependencies
const { logTime } = require('../modules/knowMoment');

const connectMongoDB = async () => {
    const db = `mongodb+srv://${process.env.DB_MONGO_USER}:${process.env.DB_MONGO_PASS}@cluster0.ocb7n.mongodb.net/busniess_cards?retryWrites=true&w=majority`;

    try {
        const conn = await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`${logTime()}: MongoDB Connected: ${conn.connection.name} on ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.error(`${logTime()}: MongoDB error: ${err.message}`);

        // exit process with error
        process.exit(1);
    }
};

const closeMongoConnection = async () => {
    try {
        await mongoose.connection.close();
    } catch (err) {
        console.error(err.message);

        // exit process with error
        process.exit(1);
    }
};

module.exports = {
    connectMongoDB,
    closeMongoConnection,
};
