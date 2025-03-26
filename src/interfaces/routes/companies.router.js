const express = require('express');
const container = require('@config/container');
const validatorHandler = require('@middlewares/validator.handler');
const {
	createCompanySchema,
	updateCompanySchema,
	getCompanySchema,
} = require('@schemas/company.schema');
const router = express.Router();

const controller = container.resolve('companyController');

router.get('/', controller.getCompanies.bind(controller));
router.get('/:id', validatorHandler(getCompanySchema, 'params'), controller.getCompany.bind(controller));
router.post('/', validatorHandler(createCompanySchema, 'body'), controller.createCompany.bind(controller));
router.patch('/:id', validatorHandler(getCompanySchema, 'params'), validatorHandler(updateCompanySchema, 'body'), controller.updateCompany.bind(controller));
router.delete('/:id', validatorHandler(getCompanySchema, 'params'), controller.deleteCompany.bind(controller));

module.exports = router;
