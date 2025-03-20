class AuthDTO {
    static fromService(data) {
        const { accessToken, ...user } = data.toJSON();;
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
}

module.exports = AuthDTO;
