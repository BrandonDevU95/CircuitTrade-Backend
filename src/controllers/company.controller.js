class CompanyController {
    constructor(service) {
        this.service = service;
    }

    async getCompanies(req, res) {
        const companies = await this.service.find();
        res.json(companies);
    }

    async getCompany(req, res) {
        const { id } = req.params;
        const company = await this.service.findOne(id);
        res.json(company);
    }

    async createCompany(req, res) {
        const company = await this.service.create(req.body);
        res.status(201).json(company);
    }

    async updateCompany(req, res) {
        const { id } = req.params;
        const company = await this.service.update(id, req.body);
        res.json(company);
    }

    async deleteCompany(req, res) {
        const { id } = req.params;
        const result = await this.service.delete(id);
        res.json(result);
    }
}

module.exports = CompanyController;