const express = require('express');
const CompanyService = require('@services/company.service');
const validatorHandler = require('@middlewares/validator.handler');
const {
	createCompanySchema,
	updateCompanySchema,
	getCompanySchema,
} = require('@schemas/company.schema');

const router = express.Router();
const service = new CompanyService();

router.get('/', async (req, res) => {
	const companies = await service.find();
	res.json(companies);
});

router.get('/:id', validatorHandler(getCompanySchema, 'params'), async (req, res) => {
	const { id } = req.params;
	const company = await service.findOne(id);
	res.json(company);
});

router.post('/', validatorHandler(createCompanySchema, 'body'), async (req, res, next) => {
	const body = req.body;
	const newCompany = await service.create(body);
	res.status(201).json(newCompany);
});

router.patch(
	'/:id',
	validatorHandler(getCompanySchema, 'params'),
	validatorHandler(updateCompanySchema, 'body'),
	async (req, res) => {
		const { id } = req.params;
		const body = req.body;
		const updatedCompany = await service.update(id, body);
		res.json(updatedCompany);
	}
);

router.delete('/:id', validatorHandler(getCompanySchema, 'params'), async (req, res) => {
	const { id } = req.params;
	const deletedCompany = await service.delete(id);
	res.json(deletedCompany);
});

module.exports = router;
