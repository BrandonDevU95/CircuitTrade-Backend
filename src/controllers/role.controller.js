class RoleController {
    constructor({
        createRoleUseCase,
        deleteRoleUseCase,
        findRoleUseCase,
        findRolesUseCase,
        updateRoleUseCase
    }) {
        this.createRoleUseCase = createRoleUseCase;
        this.deleteRoleUseCase = deleteRoleUseCase;
        this.findRoleUseCase = findRoleUseCase;
        this.findRolesUseCase = findRolesUseCase;
        this.updateRoleUseCase = updateRoleUseCase

    }

    async getRoles(req, res) {
        const roles = await this.findRolesUseCase.execute();
        res.json(roles);
    }

    async getRole(req, res) {
        const { id } = req.params;
        const role = await this.findRoleUseCase.execute(id);
        res.json(role);
    }

    async createRole(req, res) {
        const role = await this.createRoleUseCase.execute(req.body);
        res.status(201).json(role);
    }

    async updateRole(req, res) {
        const { id } = req.params;
        const role = await this.updateRoleUseCase.execute(id, req.body);
        res.json(role);
    }

    async deleteRole(req, res) {
        const { id } = req.params;
        const result = await this.deleteRoleUseCase.execute(id);
        res.json(result);
    }
}

module.exports = RoleController;