class CompanyDTO {
    static fromDatabase(company) {
        const data = company.toJSON();
        return {
            ...data,
            links: {
                self: `/companies/${data.id}`,
                users: `/companies/${data.id}/users`
            }
        };
    }
}

module.exports = CompanyDTO;
