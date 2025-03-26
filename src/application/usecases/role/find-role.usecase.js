const RoleDTO = require('@dtos/role.dto');

class FindRolesUseCase {
    constructor({ roleRepo }) {
        this.roleRepo = roleRepo;
    }

    async execute(id) {
        const role = await this.roleRepo.findById(id);
        return RoleDTO.fromDatabase(role);
    }
}

module.exports = FindRolesUseCase;