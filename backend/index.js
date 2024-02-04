const express = require('express');
const {DBConnection} = require('./database/db');
const {User} = require('./models/User');

DBConnection();
// server creation 
const app = express();
// to avoid undefined value even after passing use below two lines
app.use(express.json());
app.use(express.urlencoded({extended : true}));

// endpoint handlers 
// 1. route, handler function (req, resp) 
app.get('/', (req, resp)=>{
    resp.send('Hello there we are here');
});

// register handlder
app.post('/register', async (req, resp) => {

    // default response and status code
    let statusCode = 400;
    let responseMessage = '';

    // check if all required datas are incoming from rquest (validation)
    let requiredKeys = ['firstname', 'lastname', 'password', 'email'];
    let missingKeys = []; 
    for(let i = 0; i < requiredKeys.length; i++){
        // console.log(requiredKeys[i]);
        // console.log(req.body.requiredKeys[i]);
        // let passedValue = req.body?.requiredKeys[i];
        if(!req.body.hasOwnProperty(requiredKeys[i])){
            missingKeys.push(requiredKeys[[i]]);
        };
    };

    if (missingKeys.length != 0){
        responseMessage = `Please enter all the required keys. Missing keys : ${missingKeys.join(', ')}`;
    }
    else{
        // get all the data from frontend
        const {firstname, lastname, password, email} = req.body;
        console.log(firstname);
        // check if user already exists 

        const isUserExists = await User.findOne({email});
        if (isUserExists){
            statusCode = 200;
            responseMessage = 'User already exists. Please use credetials to login.'
        }
        else{
            statusCode = 200;
            responseMessage = 'Encrypt the use password';
            // encrypt the user password 

        }
    }
    // save data into database 
    // generate a token for user and send it

    resp.status(statusCode).send(responseMessage);
});



// to start a server we need to use listen 
app.listen(5000, ()=>{
    console.log("Server Started");
})
