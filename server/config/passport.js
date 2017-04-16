import passport from 'passport';
import sanitize from 'sanitize-html';
import { User } from '../models';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import LocalStrategy from 'passport-local';

const sanitizeOptions = {
    allowedTags: [],
    allowedAttributes: []
};

// Setting username field to email rather than username
const localOptions = {
    usernameField: 'email'
};

// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    email = sanitize(email, sanitizeOptions);

    User.findOne({ email }).select('+password').exec((err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'No user with that email found. Please try again.' });
        }
        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                return done(err);
            }
            if (!isMatch) {
                return done(null, false, { message: 'Your login details could not be verified. Please try again.' });
            }
            return done(null, user);
        });
    });
});

// Setting JWT strategy options
const jwtOptions = {
    // Telling Passport to check authorization headers for JWT
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    // Telling Passport where to find the secret
    secretOrKey: process.env.SECRET
};
// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload._id, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

passport.use(jwtLogin);
passport.use(localLogin);

export default passport;
