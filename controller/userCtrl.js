const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
require('dotenv').config();
const { emailSender } = require('./email')
const ResponseData = {
    Status: "..SUCCESS..",
    Response: null,
    Message: null
};
const ErrorData = {
    Status: "..FAILED..",
    Response: null,
    Message: null
};

const signUp = async (req, res) => {
    try {
        let user = {};
        const keys = ["userName", "password"];
        let data;
        let passReg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        let password = req.body.password;
        if (Object.keys(req.body).length > 0) {
            let validation = await bodyValidation(req.body, keys);
            if (validation.length > 0) {
                ErrorData.Message = "Incorrect Request Body";
                res.status(400).json(ErrorData);
                return
            } else {
                if (passReg.test(password)) {
                    user["userName"] = req.body.userName;
                    user["password"] = await bcrypt.hash(password, 10);
                    user["token"] = await jwt.sign({ userName: user.userName, date: Date.now() }, "token");
                    data = await User.create(user);
                } else {
                    ErrorData.Message = "Password is not matching with requirement...";
                    res.status(400).json(ErrorData);
                    return
                }
            }
            ResponseData.Response = data;
            res.status(201).json(ResponseData);

        } else {
            ErrorData.Message = "Request Body is Empty...";
            res.status(400).json(ErrorData);
            return
        }
    } catch (err) {
        ErrorData.Message = err.message;
        res.status(400).json(ErrorData);
    }
}

const bodyValidation = async (body, keys) => {
    try {
        const bodyKeys = Object.keys(body);
        let errors = [];
        if (!body.userName || typeof (body.userName) !== 'string') {
            errors.push("Error in Name");
        }
        if (bodyKeys.length <= 2) {
            if (!body.password || typeof (body.password) !== 'string') {
                errors.push("Error in Password");
            }
        }
        if (bodyKeys.length >= 3) {
            if (!body.oldPassword || typeof (body.oldPassword) !== 'string') {
                errors.push("Error in Password");
            }
            if (!body.newPassword || typeof (body.newPassword) !== 'string') {
                errors.push("Error in Password")
            }
        }

        bodyKeys.map((key) => {
            if (!keys.includes(key)) {
                errors.push("Incorrect Field")
            }
        });
        return errors;
    } catch (err) {
        console.log("Error in body validation ---> ", err)
    }
}

const updatePassword = async (req, res) => {
    try {
        const keys = ["userName", "newPassword", "oldPassword"];
        let data;
        if (Object.keys(req.body).length > 0) {
            let validation = await bodyValidation(req.body, keys);
            if (validation.length > 0) {
                ErrorData.Message = "Incorrect Request Body";
                res.status(400).json(ErrorData);
                return
            } else {
                let newPassword = req.body.newPassword;
                const userData = await User.findOne({ where: { userName: req.body.userName } });
                if (userData) {
                    if (await bcrypt.compare(req.body.oldPassword, userData.password)) {
                        const updatedPassword = await bcrypt.hash(newPassword, 10)
                        data = await User.update({ password: updatedPassword }, { where: { userName: req.body.userName } })
                    } else {
                        ErrorData.Message = "Old password is not matching with User data";
                        res.status(400).json(ErrorData);
                        return
                    }
                } else {
                    ErrorData.Message = "User data is not found in database ..";
                    res.status(400).json(ErrorData);
                    return
                }
            }
        } else {
            ErrorData.Message = "Request Body is Empty";
            res.status(400).json(ErrorData);
            return
        }
        ResponseData.Response = data;
        res.status(200).json(ResponseData);
    } catch (err) {
        ErrorData.Message = err.message;
        res.status(400).json(ErrorData);
    }
}

const forgetPassword = async (req, res) => {
    try {
        let passReg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        let data = await User.findOne({ where: { userName: req.body.userName } });
        if (data) {
            let forgetTkn = await jwt.sign({ userName: req.body.userName, date: Date.now() }, "token");
            console.log(forgetTkn)
            await User.update({ forgetToken: forgetTkn }, { where: { userName: req.body.userName } })
            if (!passReg.test(req.body.password)) {
                ErrorData.Message = "Password doesn't match requirement ..";
                res.status(400).json(ErrorData);
                return
            }
            emailSender(data.userName, `http://localhost:5000/forget`);
            res.status(200).json({ message: "Mail is sent to you" })
        } else {
            ErrorData.Message = "User is not found..";
            res.status(400).json(ErrorData);
            return
        }


    } catch (err) {
        ErrorData.Message = err.message;
        res.status(400).json(ErrorData);
    }
}
const forget = async (req, res) => {
    try {
        console.log("forget..")

        let pwd = req.body.password;
        let forgetToken = req.body.forgetToken;
        let userToken = req.body.userToken;
        let passReg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        if (forgetToken === userToken) {
            if (passReg.test(pwd)) {
                const latestPwd = await bcrypt.hash(pwd, 10)
                await User.update({ password: latestPwd }, { where: { userName: req.body.userName } });
            } else {
                ErrorData.Message = "Incorrect Password";
                res.status(400).json(ErrorData);
                return
            }
            ResponseData.Message = "Successfully change the password";
            res.status(200).json(ResponseData);

        } else {
            ErrorData.Message = "Incorrect Json Web Token";
            res.status(400).json(ErrorData);
            return
        }
    } catch (err) {
        console.log(err)
        ErrorData.Message = err.message;
        res.status(400).json(ErrorData);
    }
}
module.exports = { signUp, updatePassword, forgetPassword, forget }