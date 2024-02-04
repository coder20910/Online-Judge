const mongoose = require('mongoose');
require('dotenv').config();

const DBConnection = async ()=> {
    const MONGO_URI = process.env.DATABASE_URL;
    console.log(MONGO_URI);
    const PORT = process.env.PORT;
    try{
        mongoose.connect(MONGO_URI, {useNewUrlParser: true});
        console.log('Database connection established.');
    }
    catch (error) {
        console.log('EID#01. Database connection failed. Error Message :-', error.message);
    };
};

module.exports = {DBConnection};