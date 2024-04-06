const connectToMongo = require('./db');
const express = require('express')
const cors = require('cors')

connectToMongo();
const app = express()
const port = 5000

app.use(cors())
app.use(express.json()) // to be able to use req.body we need to add this middle ware.

// an example code for request ack
// app.get('/', (req, res) => {
//   res.send('Hello Mukesh!')
// })

// available routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNotebook backend listening on port http://localhost:${port}`)
})     