const { default: mongoose } = require('mongoose');
const User = require('../models/userModel');
const dbConfig = require('../config/config');
const connection = require('../connection');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mailFunction = require('../services/general');
const Joi = require('joi');
var AWS = require('aws-sdk');
var fs = require('fs');
const { log } = require('console');
// get config vars
dotenv.config();

function generateAccessToken(username, email) {
    return jwt.sign(username, email ,process.env.TOKEN_SECRET, { expiresIn: '6000000s' });
}

exports.create = async (req, res) => {    
    
    // Validate request
    if(!req.body.email) {
        return res.status(400).send({
            message: "Email can not be an empty feild"
        });
    }

    User.find({$and : [{email: req.body.email, userId: req.body.userId}] }).then(async doc => {
        if(doc.length > 0) {
            console.log(doc)
            res.status(409).send({"msg": "User is already available"});
        }
        else {
            // Create a user
            // var token = await generateAccessToken(req.body.userName, req.body.email)
            const user = new User({
                userName: req.body.userName,
                email: req.body.email ,
                phoneNum: req.body.phoneNum,
                userId: req.body.userId ,
            });

            await mailFunction.mailFunctionTrigger(user)
            // Save user in the database
            user.save()
            .then(async data => {
                console.log("Data",data);
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Note."
                });
            });
        }
    }).catch(err => {
        res.send(err);
    })
    
};

exports.logIn = async (req,res) => {
    if(req) {
        let token = await generateAccessToken(req.body.userName, req.body.email);
        if (token) {
            res.send({"msg": "User loggedin sucessfully", status: 200, data: token});
        }
        else {
            res.status(400).send({"msg": "Bad request."});
        }
    }
}

exports.afterLogin = async (req, res) => {
    if(req) {
        User.find({userName: req.user}).then(async doc => {
            if(doc.length> 0) {
                res.send({"msg": "User loggedin sucessfully", status: 200});
            }
        }).catch(err => {
            res.send(err);
        });
    }
    else {
        res.send({"msg": "Bad request.", status: 400});
    }
};

exports.findAllUser = async (req, res) => {
    // console.log("REqqqqq", req.query);
    if (req.query.page) {
        const resultsPerPage = 5;
        let page = req.query.page >= 1 ? req.query.page : 1;
    
        page = page - 1
        
        User.find()
        // .select("userName")
        // .sort({ name: "asc" })
        .limit(resultsPerPage)
        .skip(resultsPerPage * page)
        .then((results) => {
            return res.status(200).send(results);
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
    }
    else {
        User
        .find({
        })
        .then(doc => {
          console.log(doc)
          res.send({"msg": "All users", Status: 200, data: doc});
        })
        .catch(err => {
          console.error(err)
        })
    }
};

exports.findOne = async (req, res) => {
    User
    .find({
      userId: req.params.userId// search query
    })
    .then(doc => {
      console.log(doc)
      res.send({"msg": "Data Of userId " + req.params.userId, Status: 200, data: doc})
    })
    .catch(err => {
      console.error(err)
    })
};

exports.update = async (req, res) => {
    User
    .updateOne(
        {email: req.body.email}, { $set: { userName: req.body.userName } }// search query
    )
    .then(doc => {
      console.log(doc)
      res.send({"msg": "User data updated sucessfully" + req.params.userId, Status: 200})
    })
    .catch(err => {
      console.error(err)
    })
};

exports.delete = async (req, res) => {
    User
    .remove(
        {userId : req.params.id}
    )
    .then(doc => {
      console.log(doc)
      res.send({"msg": " UserId Of " + req.params.id + " data deleted sucessfully" , Status: 200})
    })
    .catch(err => {
      console.error(err)
    })
};

