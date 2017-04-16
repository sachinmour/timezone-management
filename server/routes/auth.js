import { UserController } from '../controllers';
import { validationSchema, authentication } from '../middlewares';
import t, { maybe } from 'tcomb-validation';

export default app => {
    app.post('/login', authentication.requireLogin, UserController.login);
    app.post(
        '/register',
        validationSchema({
            body: {
                email: t.String,
                password: t.String,
                role: t.String
            }
        }),
        UserController.register
    );
    app.get('/verify', authentication.requireAuth, UserController.login);
};
