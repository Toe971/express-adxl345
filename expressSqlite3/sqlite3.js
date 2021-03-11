const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const location = process.env.SQLITE_DB_LOCATION || '/etc/sqlite3/sqlite3.db';
const { Sequelize, Model, DataTypes } = require('sequelize');
// below initialisation may have issue on first time as storage is not done out yet, may need to put after init function
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: location
  });


let db;

const init = () => {
    const dirName = require('path').dirName(location)
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true })
    }

    return new Promise((acc, rej) => {
        db = new sqlite3.Database(location, err => {
            if (err) return rej(err)

            console.log(`Using sqlite database at ${location}`)
        })
    })

}

