//--------------------------------------------------------
//-- Nwayo - Database - Seeds - Database Seeder
//--------------------------------------------------------

import { Seeder } from '@absolunet/ioc';


/**
 * Database Seeder.
 */
class DatabaseSeeder extends Seeder {

	/**
	 * Seed the application's database.
	 * You can run other seeders by both names, from the migration folder, and class instances.
	 *
	 * @returns {Promise} The async process promise.
	 */
	async seed() {
		await this.run([
			// 'UsersTableSeeder'
		]);
	}

}


export default DatabaseSeeder;
