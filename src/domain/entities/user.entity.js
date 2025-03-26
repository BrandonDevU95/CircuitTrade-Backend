const boom = require('@hapi/boom');
const { encryptPassword, verifyPassword } = require('@utils/auth.utils');

class UserEntity {
    constructor(rawData) {
        // Datos crudos del request
        this.rawData = rawData;

        // Campos normalizados
        this._normalized = {
            email: this.normalizeEmail(rawData.email),
            phone: this.normalizePhone(rawData.phone),
            rfc: this.normalizeRfc(rawData.rfc),
            role: this.normalizeRole(rawData.role)
        };
    }

    // Normalizaciones
    normalizeEmail(email) {
        return email?.toLowerCase().trim() || '';
    }

    normalizePhone(phone) {
        return phone?.replace(/[^0-9+]/g, '') || '';
    }

    normalizeRfc(rfc) {
        return rfc?.toUpperCase().replace(/[^A-Z0-9&Ñ]/g, '').trim() || '';
    }

    normalizeRole(role) {
        return role?.toLowerCase().trim().replace(/\s+/g, '_') || '';
    }

    // Validaciones
    validateUniqueness(existingUser) {
        if (existingUser) throw boom.badRequest('User already exists');
    }

    async prepareForCreate() {
        return {
            ...this.rawData,
            email: this._normalized.email,
            phone: this._normalized.phone,
            password: await encryptPassword(this.rawData.password)
        };
    }

    prepareForUpdate(data) {
        return {
            ...data,
            ...(data.email && { email: this.normalizeEmail(data.email) }),
            ...(data.phone && { phone: this.normalizePhone(data.phone) }),
            ...(data.role && { role: this.normalizeRole(data.role) }),
        };
    }

    async prepareForPasswordUpdate(currentPassword, storedPassword, newPassword) {

        if (!currentPassword || !newPassword) {
            throw boom.badRequest('Current password and new password are required');
        }

        const isMatch = await verifyPassword(currentPassword, storedPassword);

        if (!isMatch) {
            throw boom.badRequest('Current password is incorrect');
        }

        const password = await encryptPassword(newPassword);

        return { password };
    }
}

module.exports = UserEntity;