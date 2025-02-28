'use strict';
const { v4: uuidv4 } = require('uuid');
const faker = require('@faker-js/faker').fakerES_MX;

// Helper para generar RFCs mexicanos válidos
const generateMexicanRFC = () => {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const randomLetters = Array(4)
		.fill()
		.map(() => letters[Math.floor(Math.random() * letters.length)])
		.join('');
	const date =
		faker.date.past().getFullYear().toString().slice(-2) +
		('0' + (faker.date.past().getMonth() + 1)).slice(-2) +
		('0' + faker.date.past().getDate()).slice(-2);
	const homoclave = Math.random().toString(36).substring(2, 4).toUpperCase();
	return `${randomLetters}${date}${homoclave}`;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const companies = Array.from({ length: 10 }, (_, i) => ({
			name: `${faker.company.name()}`,
			rfc: generateMexicanRFC(),
			address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}, ${faker.location.country()}, ${faker.location.zipCode()}`,
			phone: `+52${faker.phone.number('##########')}`,
			email: `contacto@empresa${i + 1}.com`,
			type: faker.helpers.arrayElement(['supplier', 'buyer', 'hybrid']),
			createdAt: new Date(),
			updatedAt: new Date(),
		}));

		// Empresa adicional para el Super Admin
		companies.push({
			name: 'Plataforma Admin Corp',
			rfc: generateMexicanRFC(),
			address: 'Av. Tecnológico 123, CDMX',
			phone: '+525512345678',
			email: 'admin@platform.com',
			type: 'hybrid',
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await queryInterface.bulkInsert('companies', companies, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('companies', null, {});
	},
};
