import { User } from '../models';
import sanitize from 'sanitize-html';
const sanitizeOptions = {
    allowedTags: [],
    allowedAttributes: []
};
const createTimezone = (req, res) => {
    let { params: { userId } } = req;
    const { body } = req;
    body.name = sanitize(body.name, sanitizeOptions);
    userId = sanitize(userId, sanitizeOptions);
    User.findOne({ _id: userId }, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Could not retrieve user' });
        }
        if (!user) {
            return res.status(400).json({ message: 'No user found.' });
        }
        user.timezones.push(body);
        user.save((err, updatedUser) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            return res.status(200).json(updatedUser.timezones);
        });
    });
};

const updateTimezone = (req, res) => {
    let { params: { userId, timezoneId } } = req;
    const { body } = req;
    body.name = sanitize(body.name, sanitizeOptions);
    userId = sanitize(userId, sanitizeOptions);
    User.findOne({ _id: userId }, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Could not retrieve user' });
        }
        if (!user) {
            return res.status(400).json({ message: 'No user found.' });
        }
        const timezone = user.timezones.find(zone => zone.id.toString() === timezoneId.toString());
        Object.assign(timezone, body);
        user.save(err => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            return res.status(200).json(timezone);
        });
    });
};

const getTimezones = (req, res) => {
    let { params: { userId } } = req;
    const { body } = req;
    body.name = sanitize(body.name, sanitizeOptions);
    userId = sanitize(userId, sanitizeOptions);
    User.findOne({ _id: userId }, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Could not retrieve user' });
        }
        if (!user) {
            return res.status(400).json({ message: 'No user found.' });
        }
        return res.status(200).json(user.timezones);
    });
};

const deleteTimezone = (req, res) => {
    let { params: { userId, timezoneId } } = req;
    userId = sanitize(userId, sanitizeOptions);
    User.findOne({ _id: userId }, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Could not retrieve user' });
        }
        if (!user) {
            return res.status(400).json({ message: 'No user found.' });
        }
        user.timezones = user.timezones.filter(zone => zone._id.toString() !== timezoneId.toString());
        user.save(err => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            return res.status(204).send();
        });
    });
};

export default {
    createTimezone,
    getTimezones,
    updateTimezone,
    deleteTimezone
};
