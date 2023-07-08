const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const prodRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

const mongodbUri = 'mongodb+srv://new_user_for_something:YjlbtppjfkWiq52P@cluster0.atmlvtv.mongodb.net/shop?retryWrites=true&w=majority';
mongoose.connect(mongodbUri)
.then(console.log('db connected'))
.catch(err =>{
    console.log(err);
});
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req,res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
     'Origin, X-Requested-With,Content-Type,Accept, Authorization');
    if(req.method === 'OPTIONS' ){
        res.header('Access-Control-Allow-Methods','GET, POST,PUT,DELETE,PATCH');
        return res.status(200).json({});
    }
    next();
});

//routes
app.use('/users', userRoutes);
app.use('/products',prodRoutes);
app.use('/orders',orderRoutes);

app.use((req,res,next) =>{
    const err = new Error('Not Found');
    err.status = 404;;
    next(err);
})

app.use((err,req,res,next) =>{
    res.status(err.status|| 500);
    res.json({
        error:{
            message: err.message,

        }
    })
})
module.exports = app;