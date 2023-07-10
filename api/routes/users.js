const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

require('dotenv').config();

router.post('/signup',(req,res,next) =>{
    User.findOne({email: req.body.email})
    .then(newUser =>{
        if(newUser){
            return res.status(409).json({
                message: 'email already exist'
            })
        }
        bcrypt.hash(req.body.password,12, (err, hash) =>{
            if(err){
                return res.status(500).json({
                    error:err
                });
            }
            else{
               
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save()
            .then(result =>{
                res.status(200).json('User created');
                console.log(result);
            })
            .catch(err =>{
                res.status(500).json({error:err});
            })
            }
            
        });
    });


});

router.post('/login', (req, res, next) =>{
    User.find({email: req.body.email})
    .then(user =>{
        console.log(user);
        if(user.length<1){
            return res.status(401).json({
                message:'Auth failed'

            })
        }
        const password = req.body.password;
        bcrypt.compare(password,user[0].password,(err,result) =>{
            if(err){
                return res.status(200).json({
                    message:'auth failed'
                })
            }
            if(result){
                const token = jwt.sign({
                    email: user[0].email,
                    userId:user[0]._id,
                    
                }, 
                process.env.JWT_KEY,
                {
                    expiresIn:"1h"
                })
                return res.status(200).json({
                    message:'auth successful',
                    token : token
                });
            }
            return res.status(200).json({
                message:'auth failed'
            });
        });
        
         
    })
    .catch(err =>{
        res.status(500).json({
            error:err
        });
    });
})

router.delete('/:userId', (req, res, next) =>{
    User.deleteOne({_id: req.params.userId}).
    then(result =>{
        res.status(200).json({
            message:'User Deleted'
        });
        console.log(result);
    })
    .catch(err =>{
        res.status(500).json({
            error:err
        });
    });
});


module.exports = router;