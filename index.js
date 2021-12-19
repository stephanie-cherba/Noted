const express = require('express');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const expressJwt = require('express-jwt');
const path = require('path');


app.use(express.json());
app.use(express.static(path.join(__dirname, 'client', 'build')));

app.use('/api', expressJwt({secret: process.env.SECRET,  algorithms: ['HS256']}));
app.use('/api', require('./routes/apiRoutes'));
app.use('/auth', require('./routes/authRoutes'));


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noted', {useNewUrlParser: true}).then(() => {
    console.log('Connected to MongoDB')
}).catch(err => console.log(err));

app.use((err, req, res, next) => {
    if(err.name === 'UnauthorizedError'){
        res.status(err.status);
    }
    return res.send({message: err.message});
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
});


app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})