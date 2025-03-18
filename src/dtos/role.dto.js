class RoleDTO {
    static fromDatabase(record) {
        const data = record.toJSON();
        return {
            ...data,
            links: {
                self: `/roles/${data.id}`,
                users: `/roles/${data.id}/users`
            }
        };
    }
}

module.exports = RoleDTO;