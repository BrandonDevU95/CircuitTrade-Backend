const boom = require('@hapi/boom');
const { encryptPassword } = require('@infrastructure/utils/auth.utils');

class AuthEntity {
    constructor(companyData, userData) {
        this.companyData = companyData;
        this.userData = userData;
        this._normalized = {
            company: {
                rfc: this.normalizeRfc(companyData.rfc),
                email: this.normalizeEmail(companyData.email)
            },
            user: {
                email: this.normalizeEmail(userData.email),
                role: this.normalizeRole(userData.role)
            }
        };
    }

    normalizeRfc(rfc) {
        return rfc?.toUpperCase().replace(/[^A-Z0-9&Ñ]/g, '').trim() || '';
    }

    normalizeEmail(email) {
        return email?.toLowerCase().trim() || '';
    }

    normalizeRole(role) {
        return role?.toLowerCase().trim().replace(/\s+/g, '_') || '';
    }

    async prepareForCreate() {
        return {
            company: {
                ...this.companyData,
                rfc: this._normalized.company.rfc,
                email: this._normalized.company.email
            },
            user: {
                ...this.userData,
                email: this._normalized.user.email,
                role: this._normalized.user.role,
                password: await encryptPassword(this.userData.password)
            }
        };
    }

    validateCompanyUniqueness(existingCompany) {
        if (existingCompany) {
            if (existingCompany.rfc === this._normalized.company.rfc) {
                throw boom.conflict('Company already exists with this RFC');
            }
            if (existingCompany.email === this._normalized.company.email) {
                throw boom.conflict('Company already exists with this email');
            }
        }
    }

    validateUserUniqueness(existingUser) {
        if (existingUser) {
            throw boom.conflict('User already exists with this email');
        }
    }

    validateRoleExistence(existingRole) {
        if (!existingRole) {
            throw boom.badRequest('Role does not exist');
        }
    }
}

module.exports = AuthEntity;