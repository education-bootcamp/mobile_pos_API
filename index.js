const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// load env vars
dotenv.config();

// connect to database
connectDB();

const app = express();

// Body Parser middleware
app.use(express.json())
app.use(express.urlencoded({extened:true}));

// Enable Cors
app.use(cors());

// routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/customers', require('./routes/CustomerRoutes'));
app.use('/api/v1/products', require('./routes/ProductRoutes'));
app.use('/api/v1/orders', require('./routes/orderRoutes'));

// Root route
app.get('/', (req, res)=>{
    res.json({
        message:'Express MongoDb MVC API',
        version:'1.0.0'
    })
});

app.use((error, req, res, next)=>{
    console.error(error.stack);
    res.status(500).json({
        success:false,
        message:'Server Error',
        error: error.message
    })
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server Running Port ${PORT}`)
})