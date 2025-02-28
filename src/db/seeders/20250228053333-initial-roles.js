'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'roles',
			[
				{
					name: 'super_admin',
					description:
						'Manages the entire platform. Full access to all features and system settings.',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: 'company_admin',
					description:
						'Administers company operations. Manages user accounts and internal permissions.',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: 'purchasing_manager',
					description:
						'Oversees procurement activities. Manages purchase orders and supplier relations.',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: 'sales_manager',
					description:
						'Manages sales operations and client relationships. Oversees order fulfillment.',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: 'buyer',
					description:
						'Basic purchasing user. Creates and manages purchase requisitions.',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete(
			'roles',
			{
				name: [
					'super_admin',
					'company_admin',
					'purchasing_manager',
					'sales_manager',
					'buyer',
				],
			},
			{}
		);
	},
};
