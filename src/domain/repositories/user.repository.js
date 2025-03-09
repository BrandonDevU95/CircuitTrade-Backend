// Define la interfaz para el repositorio de usuarios.
class IUserRepository {
    async create(userEntity) {
        throw new Error("Method not implemented.");
    }

    async update(id, userEntity) {
        throw new Error("Method not implemented.");
    }

    async delete(id) {
        throw new Error("Method not implemented.");
    }

    async findById(id) {
        throw new Error("Method not implemented.");
    }

    async findAll() {
        throw new Error("Method not implemented.");
    }

    async findByEmail(email) {
        throw new Error("Method not implemented.");
    }
}

module.exports = { IUserRepository };
