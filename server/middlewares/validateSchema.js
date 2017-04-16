import tcomb from 'tcomb-validation';

const validateSchema = schema => {
    return (req, res, next) => {
        if (schema.body && !tcomb.validate(req.body, tcomb.struct(schema.body), { strict: true }).isValid()) {
            return res.status(400).json({ message: 'Invalid body' });
        }
        if (schema.params && !tcomb.validate(req.params, tcomb.struct(schema.params), { strict: true }).isValid()) {
            return res.status(400).json({ message: 'Invalid params' });
        }
        return next();
    };
};

export default validateSchema;
