import { UserController } from '../controllers';
import { constants } from '../helpers';
import { validationSchema, authentication } from '../middlewares';
import t, { maybe } from 'tcomb-validation';

export default router => {
    const { ROLES } = constants;
    router.patch(
        '/users/:userId',
        validationSchema({
            body: {
                email: maybe(t.String),
                password: maybe(t.String),
                role: maybe(t.String)
            },
            params: {
                userId: t.String
            }
        }),
        authentication.requireAuth,
        authentication.roleAuthorization([ROLES.ADMIN, ROLES.MANAGER]),
        UserController.updateUser
    );
    router.get(
        '/users',
        authentication.requireAuth,
        authentication.roleAuthorization([ROLES.ADMIN, ROLES.MANAGER]),
        UserController.getUsers
    );
    router.get(
        '/users/:userId',
        authentication.requireAuth,
        authentication.roleAuthorization([ROLES.ADMIN, ROLES.MANAGER]),
        UserController.getUser
    );
    router.post(
        '/users',
        validationSchema({
            body: {
                email: t.String,
                password: t.String,
                role: t.String,
                login: maybe(t.Boolean)
            }
        }),
        authentication.requireAuth,
        authentication.roleAuthorization([ROLES.ADMIN, ROLES.MANAGER]),
        UserController.register
    );
    router.delete(
        '/users/:userId',
        validationSchema({
            params: {
                userId: t.String
            }
        }),
        authentication.requireAuth,
        authentication.roleAuthorization([ROLES.ADMIN, ROLES.MANAGER]),
        UserController.deleteUser
    );
};
