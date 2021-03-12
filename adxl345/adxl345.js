const axios = require('axios')
const amqp = require('amqplib')
const Raspi = require('raspi-io').RaspiIO
const { Accelerometer, Board } = require('johnny-five')
const board = new Board({
    io: new Raspi()
});

const exchange = processs.env.EXCHANGE || ''
const username = process.env.USERNAME || 'guest'
const password = process.env.PASSWORD || 'guest'
const port = process.env.PORT || '55'
const routingKey = process.env.ROUTING_KEY || 'adxl345'

const initAMQP = async (hasConnected=false, channel=null, message=null) => {
    if (!hasConnected) {
        const conn = await amqp.connect("amqp://" + username + "@" + password)
        const chn = await conn.createChannel()
        Promise.all(conn, chn)
            .then(() => {
                return initAMQP(true, chn)
            })
    }

    channel.assertExchange(exchange, 'topic', {
        durable: true
    })
}




board.on("ready", () => {
    initAMQP().catch(console.warn)
    const accelerometer = new Accelerometer({
        controller: "ADXL345"
    })

    accelerometer.on("data", () => {
        const {acceleration, inclination, orientation, pitch, roll, x, y, z} = accelerometer;
        const objToSend = {
            xAxis: accelerometer.x,
            yAxis: accelerometer.y,
            zAxis: accelerometer.z,
            acceleration: accelerometer.acceleration
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
