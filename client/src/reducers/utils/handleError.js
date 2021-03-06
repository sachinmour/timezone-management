import { get } from 'lodash';

const handleError = err => {
    if (!err.response) return;
    const message = get(err, ['response', 'data', 'message']);
    if (message) {
        return { _error: message };
    }
    const error = get(err, ['response', 'data', 'error']);
    const errorKeys = Object.keys(get(error, ['errors']));
    if (errorKeys.length > 0) {
        return errorKeys.reduce(
            (acc, val) => {
                acc[val] = get(error, ['errors', val, 'message']);
                return acc;
            },
            {}
        );
    }
    return { _error: 'Something bad happened!!Please contact support' };
};

export default handleError;
