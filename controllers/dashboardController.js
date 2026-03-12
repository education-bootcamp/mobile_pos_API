const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

exports.getAllCounts = async (req, res) => {
    try {

        const [customerCount, productCount, orderCount, userCount] = await Promise.all([
            Customer.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
            User.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            data: {
                customers: customerCount,
                products: productCount,
                orders: orderCount,
                users: userCount
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};