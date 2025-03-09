const { UserEntity } = require('../../../domain/entities/user.entity');
const CreateUserDTO = require('../../dtos/users/create-user.dto');

class CreateUserUseCase {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }

    async execute(userData) {
        // Convertir los datos crudos a DTO y luego a entidad
        const dto = new CreateUserDTO(userData);
        const userEntity = new UserEntity(dto);
        userEntity.normalizeEmail();
        userEntity.normalizePhone();

        const createdUser = await this.userRepository.create(userEntity);
        // Eliminar campos sensibles, si es necesario
        delete createdUser.password;
        return createdUser;
    }
}

module.exports = { CreateUserUseCase };
