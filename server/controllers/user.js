import { User } from '../models';
import { merge } from '../helpers';
import { omit } from 'lodash';
import sanitize from 'sanitize-html';
import jwt from 'jsonwebtoken';
const sanitizeOptions = {
    allowedTags: [],
    allowedAttributes: []
};

const setUserInfo = user => ({
    _id: user._id,
    email: user.email,
    role: user.role
});

// Generate JWT
const generateToken = user =>
    jwt.sign(user, process.env.SECRET, {
        expiresIn: '24h'
    });

//= =======================================
// Login Route
//= =======================================
const login = (req, res) => {
    const userInfo = setUserInfo(req.user);
    res.status(200).json({
        token: `JWT ${generateToken(userInfo)}`,
        user: userInfo
    });
};

//= =======================================
// Register User
//= =======================================
const register = (req, res) => {
    let { body: { email } } = req;
    email = sanitize(email, sanitizeOptions);
    const { body: { password, role, login = true } } = req;
    User.findOne({ email }, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Could not retrieve user' });
        }
        if (user) {
            return res.status(422).json({ message: 'User already exists' });
        }
        const createdUser = new User({
            email,
            password,
            role
        });
        createdUser.save((err, newUser) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            if (!login) {
                return res.status(201).json(omit(newUser.toObject(), ['password']));
            }
            // login user
            const userInfo = setUserInfo(newUser);
            return res.status(201).json({
                token: `JWT ${generateToken(userInfo)}`,
                user: userInfo
            });
        });
    });
};

//= =======================================
// GET ALL USERS
//= =======================================
const getUsers = (req, res) => {
    User.find({}).select('-timezones').lean().exec((err, users) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Could not retrieve users.' });
        }
        return res.status(200).json(users);
    });
};

//= =======================================
// GET A USER
//= =======================================
const getUser = (req, res) => {
    let { params: { userId } } = req;
    userId = sanitize(userId, sanitizeOptions);
    User.findOne({ _id: userId }).select('-timezones').lean().exec((err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Could not retrieve user' });
        }
        if (!user) {
            return res.status(422).json({ message: "User doesn't exists" });
        }
        return res.status(200).json(user);
    });
};

//= =======================================
// UPDATE USER
//= =======================================
const updateUser = (req, res) => {
    let { params: { userId } } = req;
    userId = sanitize(userId, sanitizeOptions);
    const { body } = req;
    User.findOne({ _id: userId }).select('-timezones').exec((err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Could not retrieve user' });
        }
        if (!user) {
            return res.status(422).json({ message: "User doesn't exists" });
        }
        merge(user, body).save((err, user) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            return res.status(200).json(omit(user.toObject(), ['password']));
        });
    });
};

//= =======================================
// DELETE USER
//= =======================================
const deleteUser = (req, res) => {
    let { params: { userId } } = req;
    userId = sanitize(userId, sanitizeOptions);
    User.remove({ _id: userId }, err => {
        // If user is not found, return error
        if (err) {
            return res.status(422).json({ error: 'Your request could not be processed. Please try again.' });
        }
        return res.status(204).send();
    });
};

export default {
    login,
    register,
    getUsers,
    getUser,
    updateUser,
    deleteUser
};
