class UserController {
    constructor(service) {
        this.service = service;
    }

    async getUsers(req, res) {
        const users = await this.service.find();
        res.json(users);
    }

    async getUser(req, res) {
        const { id } = req.params;
        const user = await this.service.findOne(id);
        res.json(user);
    }

    async createUser(req, res) {
        const body = req.body;
        const newUser = await this.service.create(body);
        res.status(201).json(newUser);
    }

    async updateUser(req, res) {
        const { id } = req.params;
        const body = req.body;
        const updatedUser = await this.service.update(id, body);
        res.json(updatedUser);
    }

    async deleteUser(req, res) {
        const { id } = req.params;
        const deletedUser = await this.service.delete(id);
        res.json(deletedUser);
    }

}

module.exports = UserController;