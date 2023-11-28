const User = require('../models/user');
const Token = require('../models/token');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('../config/nodemailer');
const credentials = require('../config/credentials');

module.exports.home = async function (req, res) {
    try {
        return res.render('home', {
            title: "Authentication"
        });
    } catch (err) {
        console.log('Error', err);
        return;
    }
}

module.exports.forgotPassword = async function (req, res) {
    try {
        return res.render('user_verification', {
            title: "Forgot Password"
        });
    } catch (err) {
        console.log('Error', err);
        return;
    }
}

module.exports.verifyUser = async function (req, res) {
    try {
        const isValidUser = await User.findOne({ email: req.body.email });
        if (!isValidUser) {
            req.flash('error', 'Invalid UserName');
            return res.redirect('back');
        }
        const token = await Token.create({
            tokenId: crypto.randomBytes(21).toString('base64'),
            user: isValidUser._id
        });
        const resetLink = `http://localhost:8000/reset-password?accesstoken=${token.tokenId}`;
        // Send the email
        nodemailer.transporter.sendMail({
            from: credentials.GMAIL_ID,
            to: req.body.email,
            subject: 'Password Reset',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.<p>
                   <p>The link is valid for 15 mins</p>`
        }, (err, info) => {
            if (err) {
                console.log('Error in sending mail', err);
                return;
            }
            console.log('Message sent', info);
            return;
        });
        req.flash('success', 'An email containing the password reset link has been sent to the registered email');
        return res.redirect('back');
    } catch (err) {
        console.log('Error', err);
        return;
    }
}

module.exports.resetPassword = async function (req, res) {
    try {
        const accessToken = req.query.accesstoken;
        const isValidToken = await Token.findOne({ tokenId: accessToken });
            return res.render('reset_password', {
                title: "Change Password",
                accessToken: isValidToken,
            });
        }catch (err) {
            console.log('Error', err);
        }
    } 


module.exports.updatePassword = async function (req, res) {
    try {
        if (req.body.password != req.body.confirm_password) {
            req.flash('error', 'Passwords do not match');
            return res.redirect('back');
        }
        const accessToken = await Token.findOne({tokenId: req.query.accessToken});
        await User.findByIdAndUpdate(accessToken.user, { password: await bcrypt.hash(req.body.password, 10)});
        await Token.findByIdAndDelete(accessToken._id);
        req.flash('success', 'Password reset successful. Log in to continue');
        return res.redirect('/users/sign-in');
    } catch (err) {
        console.log('Error', err);
    }
}