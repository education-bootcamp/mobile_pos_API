const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc Get all orders
// @route GET /api/v1/orders
// @access Private

const getOrders = async (req, res)=>{
    try{
        const orders = await Order.find().populate('customer','name address').populate('productDetails.product','description unitPrice');

        res.status(200).json({
            sucecss:true,
            count: orders.length,
            data: orders
        });
    }catch(error){
        res.status(500).json({
            success:false,
            error:error.message
        })
    }
}


// @desc Get single order
// @route GET /api/v1/orders/:id
// @access Private

const getOrder = async (req, res)=>{
    try{
        const order = await Order.findById(req.params.id).populate('customer','name address').populate('productDetails.product','description unitPrice');

        if(!order){
            return res.status(404).json({
            sucecss:false,
            message:'Order Not Found'
        });
        }
        res.status(200).json({
            sucecss:true,
            data: order
        });
    }catch(error){
        res.status(500).json({
            success:false,
            error:error.message
        })
    }
}

// @desc create Order
// @route POST /api/v1/orders
// @access Private

const createOrder = async (req, res)=>{
    try{


        const {customer, productDetails}=req.body;

        let totalAmount =0;

        for(let item of productDetails){
            const product = await Product.findById(item.product);

            if(!product){
                return res.status(404).json({
                        sucecss:false,
                        message:`Product with id ${item.product} not found`
                    });
            }

            if(product.qtyOnHand<item.quantity){
                return res.status(400).json({
                        sucecss:false,
                        message:`insufficiant quantity for product ${product.description}`
                    });
            }

            item.price=product.unitPrice;
            totalAmount+=product.unitPrice*item.quantity;


            // update product quantity
            product.qtyOnHand-=item.quantity;
            await product.save();
        }



        const order = await Order.create({
            customer,
            productDetails,
            totalAmount,
            date:req.body.date || Date.now()
        });

        const populatedOrder = await Order.findById(order._id)
        .populate('customer', 'name address')
        .populate('productDetails.product', 'description unitPrice');

        res.status(201).json({
            sucecss:true,
            message:populatedOrder
        });
       
    }catch(error){
        res.status(400).json({
            success:false,
            error:error.message
        })
    }
}