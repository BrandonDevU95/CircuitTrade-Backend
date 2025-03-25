class CompanyController {
    constructor({
        createCompanyUseCase,
        deleteCompanyUseCase,
        findCompanyUseCase,
        findCompaniesUseCase,
        updateCompanyUseCase
    }) {
        this.createCompanyUseCase = createCompanyUseCase;
        this.deleteCompanyUseCase = deleteCompanyUseCase;
        this.findCompanyUseCase = findCompanyUseCase;
        this.findCompaniesUseCase = findCompaniesUseCase;
        this.updateCompanyUseCase = updateCompanyUseCase
    }

    async getCompanies(req, res) {
        const companies = await this.findCompaniesUseCase.execute();
        res.json(companies);
    }

    async getCompany(req, res) {
        const { id } = req.params;
        const company = await this.findCompanyUseCase.execute(id);
        res.json(company);
    }

    async createCompany(req, res) {
        const company = await this.createCompanyUseCase.execute(req.body);
        res.status(201).json(company);
    }

    async updateCompany(req, res) {
        const { id } = req.params;
        const company = await this.updateCompanyUseCase.execute(id, req.body);
        res.json(company);
    }

    async deleteCompany(req, res) {
        const { id } = req.params;
        const result = await this.deleteCompanyUseCase.execute(id);
        res.json(result);
    }
}

module.exports = CompanyController;