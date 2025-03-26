const boom = require('@hapi/boom');
const UserDTO = require('@application/dtos/user.dto');
const UserEntity = require('@domain/entities/user.entity');
const { runInTransaction } = require('@infrastructure/utils/transaction.utils');

class UpdateUserUsecase {
    constructor({ userRepo, roleRepo }) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
    }

    async execute(id, data, transaction = null) {
        return runInTransaction(async (t) => {
            const userEntity = new UserEntity(data);
            const updateData = userEntity.prepareForUpdate(data);
            const currentUser = await this.userRepo.findById(id, { transaction: t });

            // Validar email único
            if (updateData.email) {
                const existingUser = await this.userRepo.findUserByEmail(updateData.email, { transaction: t });
                if (existingUser && existingUser.id !== currentUser.id) {
                    throw boom.conflict('Email already registered to another user');
                }
            }

            // Actualizar rol si aplica
            if (updateData.role) {
                updateData.roleId = await this.roleRepo.findRoleByName(updateData.role, {
                    transaction: t,
                    rejectOnEmpty: boom.notFound('Specified role does not exist')
                });
                delete updateData.role;
            }

            // Actualizar password si aplica
            if (updateData.currentPassword || updateData.newPassword) {
                const { password } = await userEntity.prepareForPasswordUpdate(
                    updateData.currentPassword,
                    currentUser.password,
                    updateData.newPassword
                );

                updateData.password = password;
                delete updateData.currentPassword;
                delete updateData.newPassword;
            }

            const { affectedCount } = await this.userRepo.update(currentUser.id, updateData, { transaction: t });

            if (affectedCount === 0) return { id, message: 'User not updated' };

            const updatedUser = await this.userRepo.findUserByIdWithDetails(currentUser.id, { transaction: t });

            return UserDTO.fromDatabase(updatedUser);
        }, transaction);
    }
}

module.exports = UpdateUserUsecase;