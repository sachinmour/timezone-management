import mongoose from 'mongoose';
import moment from 'moment-timezone';
import { values } from 'lodash';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { constants } from '../helpers';

const Schema = mongoose.Schema;

const timezoneSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    timezone: {
        type: String,
        validate: {
            validator: v => !!moment.tz.zone(v),
            message: '{VALUE} is not a valid timezone'
        }
    }
});

const userSchema = new Schema({
    email: {
        type: String,
        validate: {
            validator: v => validator.isEmail(v),
            message: '{VALUE} is not a valid email'
        },
        unique: true,
        lowercase: true,
        trim: true,
        required: [true, 'Email Required']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: {
            values: values(constants.ROLES)
        },
        default: constants.ROLES.USER,
        required: true
    },
    timezones: {
        type: [timezoneSchema],
        default: []
    }
});

userSchema.pre('save', function(next) {
    const user = this;
    const SALT_FACTOR = 5;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }

        cb(null, isMatch);
    });
};

const User = mongoose.model('User', userSchema);
export default User;
