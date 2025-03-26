const boom = require('@hapi/boom');
const RoleDTO = require('@dtos/role.dto');

class FindRolesUseCase {
    constructor({ roleRepo }) {
        this.roleRepo = roleRepo;
    }

    async execute() {
        const roles = await this.roleRepo.find({
            order: [['createdAt', 'DESC']]
        });

        //NOTA: rejectOnEmpty no funciona en el metodo find de sequelize
        if (roles.length === 0) throw boom.notFound('Roles not found');

        return roles.map(r => RoleDTO.fromDatabase(r));
    }
}

module.exports = FindRolesUseCase;