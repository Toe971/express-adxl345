const dotenv = require('dotenv').config()
const fs = require('fs');
const { Sequelize, Model, DataTypes } = require('sequelize');
// look into changing location to be within current directory of app? currently location is also used in docker-compose
const location = process.env.SQLITE_DB_LOCATION || __dirname + '/db/database.sqlite'; // __dirname is current directory. As fs.mkdirSync takes the location variable as an absolute path, need to 
const express = require('express')
const app = express()



// below initialisation may have issue on first time as storage is not done out yet, may need to put after init function
const makeDirectory = () => {
    const dirName = require('path').dirname(location)
    if (!fs.existsSync(dirName)) {
        console.log("Creating database at ", location)
        fs.mkdirSync(dirName, { recursive: true })
    }
    console.log(`There is a database created at ${location} already.`)
 
}

makeDirectory();

// can include 'database', 'username', 'password' from dotenv config?
const sequelize = new Sequelize(
    "database",
    process.env.USER,
    process.env.PASSWORD,
    {
        dialect: 'sqlite',
        storage: location
    }
);

// wrapped in sequelize because can use it for authentication, test next time
// can use Extending Model next time under sequelize docs

const init = async () => {
    try {
        await sequelize.authenticate()
        console.log("Connection established.")
        const Accelerometer = sequelize.define('Accelerometer', {
            xAxis: {
                type: DataTypes.FLOAT
            },
            yAxis: {
                type: DataTypes.FLOAT
            },
            zAxis: {
                type: DataTypes.FLOAT
            }
        }, {
            timestamps: true
        })

        Accelerometer.sync()

        const testValues = {
            xAxis: 3.3333,
            yAxis: 4.4444,
            zAxis: 5.5555,
        }

        await Accelerometer.create(testValues)

    } catch (err) {
        console.log("Unable to connect to database", err)
    }
}

init()



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

accelRouter.get('/', async (req, res, next) => {
    const accelerometerValues = await Accelerometer.findAll()
    console.log(accelerometerValues)
    res.status(200).json({accelerometerValues})
})

accelRouter.post('/', async (req, res, next) => {
    const { xAxis, yAxis, zAxis } = req.body
    console.log(xAxis)
    if (result) {
        res.status(201).send()
    } else {
        res.status(400).send()
    }

})

const listener = app.listen(8080, function() {
    console.log("Listening on port " + listener.address().port);
});