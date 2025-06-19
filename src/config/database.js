const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../database/cinema.db');

// const {open} = require("sqlite");
// let db = null;

// const initialiseDatabase = async() => {
//   try{
//     db = await open({
//       filename: dbPath,
//       driver: sqlite3.Database
//     })
//   }
//   catch(e){
//     console.error(`DB Error: ${e.message}`);
//     process.exit(1);
//   }
//   await db.run('PRAGMA foreign_keys = ON');
//   console.log('📊 Connected to SQLite database');
//   return db;
// }

// initialiseDatabase();

class Database {
  constructor() {
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error connecting to database:', err.message);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          // Enable foreign keys
          this.db.run('PRAGMA foreign_keys = ON');
          resolve(this.db);
        }
      });
    });
  }

  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            console.log('Database connection closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = new Database();