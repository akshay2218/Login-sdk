#!/usr/bin/env node

/**
 * @author Akshay Misal
 * @version 1.0.0
 * @since 24-Nov-2018
 */
var mongo = require('mongoskin');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var TinyURL = require('tinyurl')

/**
 * @author Akshay Misal
 * @description
 * @param {connectionString, dbName, collectionName, username,password,} req 
 * @param {JSONObject} res  
 */
var authenticateUser = function (connectionString, dbName, collectionName, username, password, callback) {
    try {
        var db = mongo.db(connectionString + dbName, {
            native_parser: false
        });
        db.bind(collectionName);
        var username = username;

        db.collection(collectionName).findOne({
            username: username
        }, function (err, user) {
            if (err) {
                return callback(err);
            }

            if (user && bcrypt.compareSync(password, user.hash)) {
                var set = {
                    message: "Login Successful.",
                    token: jwt.sign({ sub: user._id }, "akshaymamtavingiridowhatyouwant"),
                    user: user
                }
                return callback(set);
            } else {
                var set = {
                    message: 'Username or password is incorrect'
                }
                return callback(set);
            }

        })
        db.close();
    } catch (err) {
        throw err;
    }
}


module.exports.authenticate = authenticateUser;