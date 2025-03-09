// Representa la entidad de dominio "User" sin depender de detalles de infraestructura
class UserEntity {
    constructor({ id, name, email, password, phone, roleId, companyId, isActive }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.roleId = roleId;
        this.companyId = companyId;
        this.isActive = isActive;
    }

    normalizeEmail() {
        if (this.email) {
            this.email = this.email.toLowerCase().trim();
        }
    }

    normalizePhone() {
        if (this.phone) {
            this.phone = this.phone.replace(/[^0-9+]/g, "");
        }
    }
}

module.exports = { UserEntity };
