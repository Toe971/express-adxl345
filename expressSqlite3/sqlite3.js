const sqlite3 = require('sqlite3').verbose(); // not needed since use Sequelize?
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
    {
        dialect: 'sqlite',
        storage: location
    }
);

// wrapped in sequelize because can use it for authentication, test next time
// can use Extending Model next time under sequelize docs
sequelize
    .authenticate() // is necessary, even though we never provide username or password, will fail otherwise
    .then(() => {
        console.log("Connection established.")
        // define new table: Acceleration
        // if use inside sequelize.then(...) cannot use const Accelerometer, otherwise will have error pop out
        Accelerometer = sequelize.define("Accelerometer", {
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
            timestamps: true // compare it tot timestampAsId, as for createdAt and updatedAt may need to set to faLse
        })
        // This creates the table if it doesn't exist (and does nothing if it already exists)
        Accelerometer.sync()

        const testValues = {
            xAxis: 3.3333,
            yAxis: 4.4444,
            zAxis: 5.5555,
            motionBool: true,
            timestampAsId: new Date()
        }

        const testWrite = async () => {
            await Accelerometer.create(testValues)
        }
        testWrite()
        console.log(testWrite)

        
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

accelRouter.get('/', async (req, res, next) => {
    const accelerometerValues = await Accelerometer.findAll()
    console.log(accelerometerValues)
    res.status(200).json({accelerometerValues})
})

accelRouter.post('/', async (req, res, next) => {
    // expects shape of POST request to be the same as the GET
    // i.e. see testValues above
    let reqBodyKeys = Object.keys(req.body)
    let keysArray = Object.keys(testValues)
    let filterKeys = new Set(keysArray)
    let result = reqBodyKeys.every(key => {
        return filterKeys.has(key)
    })
    if (result) {
        
        res.status(201).send()
    } 

})

const listener = app.listen(8080, function() {
    console.log("Listening on port " + listener.address().port);
});