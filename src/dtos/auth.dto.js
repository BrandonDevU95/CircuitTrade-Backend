class AuthDTO {
    static fromService(data) {
        // eslint-disable-next-line no-unused-vars
        const { accessToken, password, ...user } = data;
        return {
            user: {
                ...user,
                links: {
                    self: `/users/${user.id}`,
                    company: `/companies/${user.companyId}`,
                    role: `/roles/${user.roleId}`
                }
            },
            tokens: {
                accessToken,
                tokenType: 'Bearer'
            }
        };
    }

    static fromModel(data) {
        // eslint-disable-next-line no-unused-vars
        const { password, ...user } = data;
        return {
            user: {
                ...user,
                links: {
                    self: `/users/${user.id}`,
                    company: `/companies/${user.companyId}`,
                    role: `/roles/${user.roleId}`
                }
            }
        };
    }
}

module.exports = AuthDTO;
