const axios = require('axios')
const Raspi = require('raspi-io').RaspiIO
const { Accelerometer, Board } = require('johnny-five')
const board = new Board({
    io: new Raspi()
});

board.on("ready", () => {
    const accelerometer = new Accelerometer({
        controller: "ADXL345"
    })

    accelerometer.on("data", () => {
        const {acceleration, inclination, orientation, pitch, roll, x, y, z} = accelerometer;
        objToSend = {
            xAxis: accelerometer.x,
            yAxis: accelerometer.y,
            zAxis: accelerometer.z,
            motionBool: false,
            /* accelerometer.on("change", () => { return 1 }) ? true : false // if 1 true else null false, dont know how type coercing works in sqlite3 yet */
        } 
        console.log(objToSend)
        /* axios({
            method: 'post',
            url: '/accelerometer',
            data: objToSend
        }) */
        
    })
})
