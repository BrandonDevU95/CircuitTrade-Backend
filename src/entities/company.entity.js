const boom = require('@hapi/boom');

class CompanyEntity {
    constructor(rawData) {
        this.rawData = rawData;
        this._normalized = {
            rfc: this.normalizeRfc(rawData.rfc),
            email: this.normalizeEmail(rawData.email)
        };
    }

    normalizeRfc(rfc) {
        return rfc?.toUpperCase().replace(/[^A-Z0-9&Ñ]/g, '').trim() || '';
    }

    normalizeEmail(email) {
        return email?.toLowerCase().trim() || '';
    }

    validateUniqueness(existingCompany) {
        if (existingCompany) {
            if (existingCompany.rfc === this._normalized.rfc) {
                throw boom.conflict('Company already exists with this RFC');
            }
            if (existingCompany.email === this._normalized.email) {
                throw boom.conflict('Company already exists with this email');
            }
        }
    }

    prepareForCreate() {
        return {
            ...this.rawData,
            rfc: this._normalized.rfc,
            email: this._normalized.email
        };
    }

    prepareForUpdate(updateData) {
        return {
            ...updateData,
            ...(updateData.rfc && { rfc: this.normalizeRfc(updateData.rfc) }),
            ...(updateData.email && { email: this.normalizeEmail(updateData.email) })
        };
    }
}

module.exports = CompanyEntity;