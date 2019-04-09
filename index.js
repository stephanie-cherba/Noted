const express = require('express');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const expressJwt = require('express-jwt');
const path = require('path');


app.use(express.json());
app.use('/api', expressJwt({secret: process.env.SECRET}));
app.use('/api', require('./routes/apiRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use(express.static(path.join(__dirname, 'client', 'build')));

app.use((err, req, res, next) => {
    if(err.name === 'UnauthorizedError'){
        res.status(err.status);
    }
    return res.send({message: err.message});
})

// mongodb://heroku_39vqgsgh:jjti3k4e3nth6csf08qnvggcdm@ds125673.mlab.com:25673/heroku_39vqgsgh
// mongolab-contoured-55016

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noted', {useNewUrlParser: true}).then(() => {
    console.log('Connected to MongoDB')
}).catch(err => console.log(err));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})