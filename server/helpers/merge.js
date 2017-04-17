import { forOwn, isPlainObject, isArray } from 'lodash';

const merge = (A = {}, B = {}) => {
    forOwn(B, (value, key) => {
        if (isPlainObject(A[key])) {
            if (isPlainObject(B[key])) {
                merge(A[key], B[key]);
            }
        } else if (isArray(A[key])) {
            if (isArray[B[key]]) {
                B[key].forEach(value => {
                    if (!A[key].includes[value]) {
                        A[key].push(value);
                    }
                });
            }
        } else {
            if (B[key]) {
                A[key] = B[key];
            }
        }
    });
    return A;
};

export default merge;
