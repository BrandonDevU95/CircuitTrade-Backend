const express = require('express');
const CompanyService = require('@services/company.service');
const validatorHandler = require('@middlewares/validator.handler');
const CompanyController = require('@controllers/company.controller');
const {
	createCompanySchema,
	updateCompanySchema,
	getCompanySchema,
} = require('@schemas/company.schema');

const router = express.Router();
const service = new CompanyService();
const controller = new CompanyController(service);

router.get('/', controller.getCompanies.bind(controller));
router.get('/:id', validatorHandler(getCompanySchema, 'params'), controller.getCompany.bind(controller));
router.post('/', validatorHandler(createCompanySchema, 'body'), controller.createCompany.bind(controller));
router.patch('/:id', validatorHandler(getCompanySchema, 'params'), validatorHandler(updateCompanySchema, 'body'), controller.updateCompany.bind(controller));
router.delete('/:id', validatorHandler(getCompanySchema, 'params'), controller.deleteCompany.bind(controller));

module.exports = router;
