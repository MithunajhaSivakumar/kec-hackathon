const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/connectdb.js')
const userRoutes = require('./routes/userRoutes')
const hallRoutes = require('./routes/hallRoute');
const bookRoutes = require('./routes/bookingRoute')

const app = express()
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

app.use(cors())
connectDB(DATABASE_URL)
app.use(express.json())

app.use("/api/auth", userRoutes);
app.use("/api/halls", hallRoutes )
app.use("/api/bookings", bookRoutes);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})