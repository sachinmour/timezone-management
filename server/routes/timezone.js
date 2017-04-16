import { TimezoneController } from '../controllers';
import { constants } from '../helpers';
import { validationSchema, authentication } from '../middlewares';
import t, { maybe } from 'tcomb-validation';

export default router => {
    const { ROLES } = constants;
    router.post(
        '/users/:userId/timezones',
        validationSchema({
            body: {
                name: t.String,
                timezone: t.String
            },
            params: {
                userId: t.String
            }
        }),
        authentication.requireAuth,
        authentication.roleAuthorization([ROLES.ADMIN]),
        TimezoneController.createTimezone
    );
    router.get(
        '/users/:userId/timezones',
        validationSchema({
            params: {
                userId: t.String
            }
        }),
        authentication.requireAuth,
        authentication.roleAuthorization([ROLES.ADMIN]),
        TimezoneController.getTimezones
    );
    router.patch(
        '/users/:userId/timezones/:timezoneId',
        validationSchema({
            body: {
                name: maybe(t.String),
                timezone: maybe(t.String)
            },
            params: {
                userId: t.String,
                timezoneId: t.String
            }
        }),
        authentication.requireAuth,
        authentication.roleAuthorization([ROLES.ADMIN]),
        TimezoneController.updateTimezone
    );
    router.delete(
        '/users/:userId/timezones/:timezoneId',
        validationSchema({
            params: {
                userId: t.String,
                timezoneId: t.String
            }
        }),
        authentication.roleAuthorization([ROLES.ADMIN]),
        TimezoneController.deleteTimezone
    );

    router.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/public/index.html'));
    });
};
