"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ioc = require("@absolunet/ioc");

//--------------------------------------------------------
//-- Nwayo - Database - Seeds - Database Seeder
//--------------------------------------------------------

/**
 * Database Seeder.
 */
class DatabaseSeeder extends _ioc.Seeder {
  /**
   * Seed the application's database.
   * You can run other seeders by both names, from the migration folder, and class instances.
   *
   * @returns {Promise} The async process promise.
   */
  async seed() {
    await this.run([// 'UsersTableSeeder'
    ]);
  }

}

var _default = DatabaseSeeder;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;