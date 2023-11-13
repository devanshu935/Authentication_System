const User = require('../models/user');
const bcrypt = require('bcrypt');

// let's keep it same as before
module.exports.profile = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    });

}

// render the sign up page
module.exports.signUp = function (req, res) {

    if (req.isAuthenticated()) {
        return res.redirect('/users/profile/' + req.user._id);
    }
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
}

// render the sign in page
module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile/' + req.user._id);
    }
    return res.render('user_sign_in', {
        title: "Codial | Sign In"
    });
}

// get the sign up data
module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({ email: req.body.email }, async function (err, user) {
        if (err) { req.flash('error', err); return }

        if (!user) {
            const hash = await bcrypt.hash(req.body.password, 10);
            req.body.password = hash;
            User.create(req.body, function (err, user) {
                if (err) { req.flash('error', err); return }
                req.flash('success', 'You have signed up, login to continue!');
                return res.redirect('/users/sign-in');
            });
        } else {
            req.flash('success', 'You are already an existing user, login to continue!');
            return res.redirect('/users/sign-in');
        }

    });
}

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in successfully');
    return res.redirect('/users/profile/' + req.user._id);
}

module.exports.destroySession = function (req, res) {
    req.logout((err) => {
        if (err) { console.log(err) };
    });
    req.flash('success', 'You have logged out!');
    return res.redirect('/');
}