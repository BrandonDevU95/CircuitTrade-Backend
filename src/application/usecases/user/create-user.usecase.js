const boom = require('@hapi/boom');
const UserDTO = require('@dtos/user.dto');
const UserEntity = require('@entities/user.entity');
const { runInTransaction } = require('@utils/transaction.utils');

class CreateUserUseCase {
    constructor({ userRepo, companyRepo, roleRepo }) {
        this.userRepo = userRepo;
        this.companyRepo = companyRepo;
        this.roleRepo = roleRepo;
    }

    async execute(data, transaction = null) {
        return runInTransaction(async (t) => {
            const userEntity = new UserEntity(data);

            // Prevención de duplicados por email
            const existingUser = await this.userRepo.findUserByEmail(userEntity._normalized.email, { transaction: t });
            if (existingUser) throw boom.conflict('Email already registered to another user');


            const [company, role] = await Promise.all([
                this.companyRepo.findCompanyByRfc(userEntity._normalized.rfc, { transaction: t }),
                this.roleRepo.findRoleByName(userEntity._normalized.role, { transaction: t })
            ]);

            if (!company || !role) throw boom.notFound(company ? 'Role not found' : 'Company not found');

            const newUserData = {
                ...await userEntity.prepareForCreate(),
                companyId: company.id,
                roleId: role.id
            };

            const newUser = await this.userRepo.create(newUserData, { transaction: t });

            return UserDTO.fromDatabase(newUser);
        }, transaction);
    }
}

module.exports = CreateUserUseCase;