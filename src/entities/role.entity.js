const boom = require('@hapi/boom');

class RoleEntity {
    constructor(rawData) {
        this.rawData = rawData;
        this._normalized = {
            name: this.normalizeName(rawData.name)
        };
    }

    normalizeName(name) {
        return name?.toLowerCase().trim().replace(/\s+/g, '_') || '';
    }

    validateUniqueness(existingRole) {
        if (existingRole) {
            throw boom.conflict('Role name already exists');
        }
    }

    prepareForCreate() {
        return {
            ...this.rawData,
            name: this._normalized.name
        };
    }

    prepareForUpdate(updateData) {
        return {
            ...updateData,
            ...(updateData.name && { name: this.normalizeName(updateData.name) })
        };
    }
}

module.exports = RoleEntity;