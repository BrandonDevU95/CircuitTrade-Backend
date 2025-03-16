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
        const body = req.body;
        const newCompany = await this.service.create(body);
        res.status(201).json(newCompany);
    }

    async updateCompany(req, res) {
        const { id } = req.params;
        const body = req.body;
        const updatedCompany = await this.service.update(id, body);
        res.json(updatedCompany);
    }

    async deleteCompany(req, res) {
        const { id } = req.params;
        const deletedCompany = await this.service.delete(id);
        res.json(deletedCompany);
    }
}

module.exports = CompanyController;