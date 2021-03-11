const sqlite3 = require('sqlite3').verbose(); // not needed since use Sequelize?
const fs = require('fs');
const { Sequelize, Model, DataTypes } = require('sequelize');
// look into changing location to be within current directory of app? currently location is also used in docker-compose
const location = process.env.SQLITE_DB_LOCATION || '/etc/sqlite3/db.sqlite';
const express = require('express')
const app = express()



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
        }, {
            timestamps: true
        })
        // This creates the table if it doesn't exist (and does nothing if it already exists)
        Accelerometer.sync()
    })
    .catch(err => {
        console.log("Unable to connect to database: ", err)
    })

// bodyparser middleware, do not need to import body-parser anymore, this is inbuilt into express
app.use(express.json())

/* 
 * GET /accelerometer get all values from accelerometer along with timestamp
 * GET /accelerometer/<unix time> get all values from accelerometer along with timestamp, convert from UNIX time
 * to ISO datetime format in order to check
 * POST /accelerometer add new accelerometer values at the timestamp provided
 * PUT /accelerometer update accelerometer values at the timestamp provided
 * motionBool not implemented
 */
app.get("/", (req, res) => {
    res.json({message: "Use /accelerometer to do your HTTP requests"})
})

// since we are only using accelerometer just put it into a Router
const accelRouter = express.Router()
app.use('/accelerometer', accelRouter)

accelRouter.get('/', (req, res, next) => {

})

