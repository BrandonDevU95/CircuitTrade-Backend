// DTO para estructurar los datos al crear un usuario.
class CreateUserDTO {
    constructor({ name, email, password, phone, roleId, companyId, isActive }) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.roleId = roleId;
        this.companyId = companyId;
        this.isActive = isActive;
    }
}

module.exports = CreateUserDTO;
