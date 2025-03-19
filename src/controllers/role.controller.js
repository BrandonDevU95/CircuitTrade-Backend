class RoleController {
    constructor({ roleService }) {
        this.service = roleService;
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
        const role = await this.service.create(req.body);
        res.status(201).json(role);
    }

    async updateRole(req, res) {
        const { id } = req.params;
        const role = await this.service.update(id, req.body);
        res.json(role);
    }

    async deleteRole(req, res) {
        const { id } = req.params;
        const result = await this.service.delete(id);
        res.json(result);
    }
}

module.exports = RoleController;