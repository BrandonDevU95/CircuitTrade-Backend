const express = require('express');
const validatorHandler = require('../middleware/validator.handler'); // Asegúrate de implementarlo
const { createUserSchema, updateUserSchema, getUserSchema } = require('../validators/user.schema');

function userRouter({ userController }) {
    const router = express.Router();

    router.get('/', (req, res, next) => userController.getAllUsers(req, res, next));
    router.get('/:id', validatorHandler(getUserSchema, 'params'), (req, res, next) =>
        userController.getUser(req, res, next)
    );
    router.post('/', validatorHandler(createUserSchema, 'body'), (req, res, next) =>
        userController.createUser(req, res, next)
    );
    router.patch(
        '/:id',
        validatorHandler(getUserSchema, 'params'),
        validatorHandler(updateUserSchema, 'body'),
        (req, res, next) => userController.updateUser(req, res, next)
    );
    router.delete('/:id', validatorHandler(getUserSchema, 'params'), (req, res, next) =>
        userController.deleteUser(req, res, next)
    );

    return router;
}

module.exports = { userRouter };
