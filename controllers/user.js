const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user');


exports.user_signup= (req, res, next) => {
    User.find({email:req.body.email}).exec().then(user =>{
        if(user.length >= 1){
            return res.status(409).json({
                message:'Mail exists'
            })

        }
        else{
          bcrypt.hash(req.body.password, 10, (err, hash) => {
              if (err) {
                  return res.status(500).json({
                      error: err
                  });
              } else {
                  const user = new User({
                      _id: new mongoose.Types.ObjectId(),
                      email: req.body.email,
                      password: hash
                  });
                  user.save()
                  .then(result =>{
                      console.log(result)
                      res.status(201).json({
                          message:"User created"
                      })
                  }).catch(err =>{
                      console.log(err)
                      return res.status(500).json({
                          error: err
                      });
          });
              }
      });
        }
    })
  
}

exports.user_login =(req,res,next)=>{
    User.find({email:req.body.email}).exec()
    .then(user => {
        if(user.length <1){
            return res.status(401).json({
                message:'Auth failed'
            });  
        }
        bcrypt.compare(req.body.password,user[0].password,(error,result)=>{
            if(error){
                return res.status(401).json({
                    message:'Auth failed'
                });  
            }
            if(result){
              const token= jwt.sign({
                    email:user[0].email,
                    userID: user[0]._id
                },
               "secret",
                {
                    expiresIn: "12h"
                })
                return res.status(200).json({
                    message:'Auth successful',
                    token:token
                });
            }
            res.status(401).json({
                message:'Auth failed'
            });  
        })
    })
    .catch(err =>{
        console.log(err)
         res.status(500).json({
            error: err
        });
    })
}