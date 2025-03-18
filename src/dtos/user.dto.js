class UserDTO {
    static fromDatabase(userModel) {
        // eslint-disable-next-line no-unused-vars
        const { password, ...safeData } = userModel.toJSON();
        return {
            ...safeData,
            links: {
                self: `/users/${safeData.id}`,
                company: `/companies/${safeData.companyId}`,
                role: `/roles/${safeData.roleId}`
            }
        };
    }
}

module.exports = UserDTO;