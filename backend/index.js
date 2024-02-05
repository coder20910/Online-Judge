const express = require('express');
const {DBConnection} = require('./database/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

DBConnection();
// server creation 
const app = express();
// to avoid undefined value even after passing use below two lines
app.use(express.json());
app.use(express.urlencoded({extended : true}));

// endpoint handlers 
// route, handler function (req, resp) 
app.get('/', (req, resp) => {
    resp.send('Hello there!');
});

// register handlder
app.post('/register', async (req, resp) => {

    // default response and status code
    let statusCode = 400;
    let responseData = '';

    // check if all required datas are incoming from rquest (validation)
    let requiredKeys = ['firstname', 'lastname', 'password', 'email'];
    let missingKeys = []; 
    for(let i = 0; i < requiredKeys.length; i++){
        if(!req.body.hasOwnProperty(requiredKeys[i])){
            missingKeys.push(requiredKeys[[i]]);
        };
    };

    if (missingKeys.length != 0){
        responseData = {'status': 'failed', 'message' : `Please enter all the required keys. Missing keys : ${missingKeys.join(', ')}`};
    }
    else{
        // get all the data from frontend
        const {firstname, lastname, password, email} = req.body;

        // check if user already exists 
        const isUserExists = await User.findOne({email : email});
        if (isUserExists){
            statusCode = 200;  
            responseData = {'status': 'failed', 'message' : `User already exists for email : ${email}.`};
        }
        else{
            // encrypt the user password
            statusCode = 200;
            const hashedPassword = await bcrypt.hash(password, 10);
            responseData = 'Encrypt the use password' + hashedPassword;

            // save data into database
            const userData = await User.create({
                firstname, 
                lastname, 
                email, 
                password : hashedPassword
            });

            // generate a token for user and send it
            const token = jwt.sign({id: userData._id, email}, process.env.SECRET_KEY, {
                expiresIn: '1h'
            });
            userData.password = undefined;
            userData.token = token;
            
            responseData = {
                'message': 'User successfully created.',
                userData
            };
        }
    }

    resp.status(statusCode).send(responseData);
});



// to start a server we need to use listen 
app.listen(5000, ()=>{
    console.log("Server Started");
})
