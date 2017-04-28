import User from '../models/user';

export const createUserPromise = user => {
    const newUser = new User(user);
    return newUser.save();
};

export const newUser = (role, timezone) => ({
    email: `${role}@${role}.com`,
    password: role,
    role,
    timezones: timezone ? [timezone] : []
});

export const newTimezone = role => ({
    name: role,
    timezone: 'Europe/Berlin'
});
