const express = require('express');
const container = require('@infrastructure/config/container');
const validatorHandler = require('@interfaces/middlewares/validator.handler');
const {
	createCompanySchema,
	updateCompanySchema,
	getCompanySchema,
} = require('@interfaces/schemas/company.schema');
const router = express.Router();

const controller = container.resolve('companyController');

router.get('/', controller.getCompanies.bind(controller));
router.get('/:id', validatorHandler(getCompanySchema, 'params'), controller.getCompany.bind(controller));
router.get('/:id/users', validatorHandler(getCompanySchema, 'params'), controller.getCompanyUsers.bind(controller));
router.post('/', validatorHandler(createCompanySchema, 'body'), controller.createCompany.bind(controller));
router.patch('/:id', validatorHandler(getCompanySchema, 'params'), validatorHandler(updateCompanySchema, 'body'), controller.updateCompany.bind(controller));
router.delete('/:id', validatorHandler(getCompanySchema, 'params'), controller.deleteCompany.bind(controller));

module.exports = router;
