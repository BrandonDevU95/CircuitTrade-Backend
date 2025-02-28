'use strict';
const bcrypt = require('bcrypt');
const faker = require('@faker-js/faker').fakerES_MX;

// Configuración de roles
const ROLES = {
	SUPER_ADMIN: 1,
	COMPANY_ADMIN: 2,
	PURCHASING_MANAGER: 3,
	SALES_MANAGER: 4,
	BUYER: 5,
};

// Función de saneamiento
const sanitizeData = (userData) => {
	// Normalizar email
	userData.email = userData.email.toLowerCase().trim().substring(0, 100); // Asegurar máximo 100 caracteres

	// Sanear teléfono
	userData.phone = userData.phone
		.replace(/[^0-9+]/g, '') // Solo números y +
		.substring(0, 15); // Máximo 15 caracteres

	// Sanear nombre
	userData.name = userData.name
		.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '') // Solo letras y espacios
		.trim()
		.substring(0, 100); // Máximo 100 caracteres

	// Asegurar formato de teléfono
	if (!userData.phone.startsWith('+')) {
		userData.phone = `+${userData.phone}`;
	}

	return userData;
};

module.exports = {
	async up(queryInterface) {
		const companies = await queryInterface.sequelize.query(
			'SELECT id FROM companies;',
			{ type: queryInterface.sequelize.QueryTypes.SELECT }
		);

		const users = [];

		for (const company of companies) {
			const isSuperAdminCompany =
				company.id === companies[companies.length - 1].id;

			for (let i = 0; i < (isSuperAdminCompany ? 1 : 10); i++) {
				let firstName = faker.person
					.firstName()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, ''); // Eliminar acentos
				let lastName = faker.person
					.lastName()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '');

				// Generar email seguro
				let email = faker.internet.email({
					firstName: firstName,
					lastName: lastName,
				});

				// Generar teléfono válido
				const phone =
					`+52${faker.phone.number('##########')}`.substring(0, 15);

				// Generar contraseña que cumple validación
				const password = email.split('@')[0].toLocaleLowerCase();

				const rawUserData = {
					name: `${firstName} ${lastName}`.substring(0, 100),
					password: await bcrypt.hash(password, 10),
					email: email,
					phone: phone,
					role_id: isSuperAdminCompany
						? ROLES.SUPER_ADMIN
						: this.assignRole(company.id, i),
					company_id: company.id,
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				};

				users.push(sanitizeData(rawUserData));
			}
		}

		await queryInterface.bulkInsert('users', users, {});
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete('users', null, {});
	},

	// Asignación de roles mejorada
	assignRole(companyId, index) {
		const roleDistribution = [
			ROLES.COMPANY_ADMIN,
			ROLES.PURCHASING_MANAGER,
			ROLES.SALES_MANAGER,
			ROLES.BUYER,
			ROLES.BUYER, // Más peso para Buyer
			ROLES.PURCHASING_MANAGER,
			ROLES.SALES_MANAGER,
		];

		return index === 0
			? ROLES.COMPANY_ADMIN
			: roleDistribution[
					Math.floor(Math.random() * roleDistribution.length)
				];
	},
};
