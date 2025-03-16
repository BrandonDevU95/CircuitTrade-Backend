class RoleController {
    constructor(service) {
        this.service = service;
    }

    async getRoles(req, res) {
        const roles = await this.service.find();
        res.json(roles);
    }

    async getRole(req, res) {
        const { id } = req.params;
        const role = await this.service.findOne(id);
        res.json(role);
    }

    async createRole(req, res) {
        const body = req.body;
        const newRole = await this.service.create(body);
        res.status(201).json(newRole);
    }

    async updateRole(req, res) {
        const { id } = req.params;
        const body = req.body;
        const updatedRole = await this.service.update(id, body);
        res.json(updatedRole);
    }

    async deleteRole(req, res) {
        const { id } = req.params;
        await this.service.delete(id);
        res.status(204).end();
    }
}

module.exports = RoleController;