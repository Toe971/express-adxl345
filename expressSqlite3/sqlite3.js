const sqlite3 = require('sqlite3').verbose(); // not needed since use Sequelize?
const fs = require('fs');
const { Sequelize, Model, DataTypes } = require('sequelize');
const location = process.env.SQLITE_DB_LOCATION || '/etc/sqlite3/db.sqlite';
const express = require('express')
const app = express()
const bodyParser = require('body-parser')


// below initialisation may have issue on first time as storage is not done out yet, may need to put after init function
const makeDirectory = () => {
    const dirName = require('path').dirName(location)
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true })
    }
 
}

makeDirectory();

// can include 'database', 'username', 'password' from dotenv config?
const sequelize = new Sequelize(
    {
        dialect: 'sqlite',
        storage: location
    }
);

// wrapped in sequelize because can use it for authentication, test next time
// can use Extending Model next time under sequelize docs
sequelize
    .then(() => {
        console.log("Connection established.")
        // define new table: Acceleration
        const Accelerometer = sequelize.define("Accelerometer", {
            xAxis: {
                type: DataTypes.FLOAT
            },
            yAxis: {
                type: DataTypes.FLOAT
            },
            zAxis: {
                type: DataTypes.FLOAT
            },
            motionBool: {
                type: DataTypes.BOOLEAN
            }
        })
        // This creates the table if it doesn't exist (and does nothing if it already exists)
        Accelerometer.sync()
    })

