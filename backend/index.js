const express = require('express');
const {DBConnection} = require('./database/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookies = require('cookie-parser');
const cors = require('cors');

DBConnection();
// server creation 
const app = express();
// to avoid undefined value even after passing use below two lines
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

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

app.post('/login', async(req, resp) => {
    // default response and status code
    let statusCode = 400;
    let responseData = {'status':'ok', 'message': ''};
    try{
        // check if all required datas are incoming from rquest (validation)
        let requiredKeys = ['password', 'email'];
        let missingKeys = []; 
        for(let i = 0; i < requiredKeys.length; i++){
            if(!req.body.hasOwnProperty(requiredKeys[i])){
                missingKeys.push(requiredKeys[[i]]);
            };
        };
        
        if (missingKeys.length != 0){
            statusCode = 400;
            responseData = {'status': 'failed', 'message' : `Please enter all the required keys. Missing keys : ${missingKeys.join(', ')}`};
        }
        else{
            // get user data
            const {password, email} = req.body;
            
            // check if user exists in databasee
            const user = await User.findOne({email : email});
            if (!user){
                statusCode = 200;  
                responseData = {'status': 'failed', 'message' : `User does not exist for email : ${email}. Please register.`};
            }
            else{
                // match password
                const checkPasswordMatch = await bcrypt.compare(password, user.password);
                if (!checkPasswordMatch){
                    statusCode = 401;
                    responseData = {'status': 'failed', 'message' : `incorrect password`};
                }else{
                    // generate a token for user and send it
                    const token = jwt.sign({id: user._id, email}, process.env.SECRET_KEY, {
                        expiresIn: '1h'
                    });
                    user.password = undefined;
                    user.token = token;

                    //store the cookies in browser for reusibility
                    const options = {
                        httpOnly : true, // only manipulated by server not by cliet/browser
                        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
                    };
                    statusCode = 200;
                    resp.status(statusCode).cookie('token', token, options).json({
                        message : 'You have successfully logged in',
                        success: true,
                        token
                    })
                }
            }
        };
        if (statusCode != 200){
            resp.status(statusCode).send(responseData);
        }
    }
    catch (error){
        console.log('#ERR201. Error occured at login endpoint. Message : ', error.message);
    };
});


// to start a server we need to use listen 
app.listen(5000, ()=>{
    console.log("Server Started");
})
