import { passport } from '../config';
import { get } from 'lodash';

const requireLogin = (req, res, next) => {
    passport.authenticate(
        'local',
        {
            session: false
        },
        (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(403).json({ message: info.message });
            }
            req.user = user;
            next();
        }
    )(req, res, next);
};

const requireAuth = passport.authenticate('jwt', { session: false });

const roleAuthorization = roles => {
    return (req, res, next) => {
        const user = req.user;
        const { userId } = req.params;

        if (userId && user && userId === get(user, '_id', '').toString()) {
            return next();
        }
        if (roles.indexOf(get(user, 'role', '')) > -1) {
            return next();
        }

        return res.status(401).json({ message: 'You are not authorized to view this content' });
    };
};

export default {
    requireLogin,
    requireAuth,
    roleAuthorization
};
