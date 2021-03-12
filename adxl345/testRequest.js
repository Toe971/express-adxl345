const axios = require('axios')

const objToSend = {
  xAxis: 2.222,
  yAxis: 3.333,
  zAxis: 4.444,
  motionBool: false,
  /* accelerometer.on("change", () => { return 1 }) ? true : false // if 1 true else null false, dont know how type coercing works in sqlite3 yet */
} 

axios
  .get('http://localhost:8080/accelerometer')
  .then(res => {
    console.log(res.status, res.data)
  })


/* axios({
  method: 'post',
  url: '192.168.1.55:8000/accelerometer',
  data: objToSend
}).then(res => {
  console.log(res.status, res.data)
}).catch(err => {
  console.log(err)
}) */