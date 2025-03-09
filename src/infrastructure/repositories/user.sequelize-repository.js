const { IUserRepository } = require('../../domain/repositories/user.repository');
const bcrypt = require('bcrypt');
// Usaremos una función utilitaria para encriptar la contraseña
const { encryptPassword } = require('../../shared/utils/auth.utils');

class UserSequelizeRepository extends IUserRepository {
    constructor({ models }) {
        super();
        this.userModel = models.User;
    }

    async create(userEntity) {
        const exists = await this.userModel.findOne({ where: { email: userEntity.email } });
        if (exists) {
            throw new Error('USER_ALREADY_EXISTS');
        }

        // Encriptar la contraseña
        userEntity.password = await encryptPassword(userEntity.password);

        const createdUser = await this.userModel.create({
            name: userEntity.name,
            email: userEntity.email,
            password: userEntity.password,
            phone: userEntity.phone,
            roleId: userEntity.roleId,
            companyId: userEntity.companyId,
            isActive: userEntity.isActive,
        });

        return createdUser.toJSON();
    }

    async update(id, updateData) {
        const user = await this.userModel.findByPk(id);
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }
        await user.update(updateData);
        return user.toJSON();
    }

    async delete(id) {
        const deletedCount = await this.userModel.destroy({ where: { id } });
        if (deletedCount === 0) {
            throw new Error('USER_DELETE_FAILED');
        }
        return { id, message: "User deleted successfully" };
    }

    async findById(id) {
        const user = await this.userModel.findByPk(id, {
            attributes: { exclude: ['password'] },
        });
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }
        return user.toJSON();
    }

    async findAll() {
        const users = await this.userModel.findAll({
            attributes: { exclude: ['password'] },
        });
        if (!users || users.length === 0) {
            throw new Error('NO_USERS_FOUND');
        }
        return users.map(u => u.toJSON());
    }

    async findByEmail(email) {
        const user = await this.userModel.findOne({ where: { email } });
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }
        return user.toJSON();
    }
}

module.exports = { UserSequelizeRepository };
