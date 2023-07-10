const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth');
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next)=>{
    Order.findAll()
    .then(docs =>{
        res.status(200).json({
            count : docs.length,
            orders: docs.map(doc =>{
                return{
                    _id:doc._id,
                    product:doc.product,
                    quantity:doc.quantity,
                    request:{
                        type: 'GET',
                        url: 'https://localhost:3000/orders'+doc._id
                    }
                }
            }),
        });
    })
    .catch(err =>{
        res.status(500).json({error:err});
    })
    
})
router.post('/', checkAuth,(req, res, next)=>{
    Product.findByPk(req.body.productId)
    .then(product =>{
        if(!product){
            return res.status(404).json({
                message: 'Product not Found'
            });
        }
        const order = new Order({
            quantity:req.body.quantity,
            product: req.body.productId
        });
       return  order.save();
    })
    .then(result =>{
            console.log('success');
            res.status(201).json({
                message: 'Order stored',
                createdOrder:{
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request:{
                    type:'GET',
                    url:'https://localhost:3000/orders'+result._id
                }
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                message: 'Product not found',
                error: err
            });
        });
   
})

router.get('/:orderid', (req, res, next)=>{
    Order.findByPk(req.params.orderid)
    .then(order =>{
        res.status(200).json({
            order: order,
            request:{
                type: 'GET',
                url:'https://localhost:3000/orders'+order._id
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            message: 'Order not found',
            error:err
        })
    })
   
})
router.delete('/:orderid', checkAuth,(req, res, next)=>{
    Order.destroy({where:{_id:req.params.orderid}})
    .then(result =>{
        res.status(200).json({
            message: 'Order deleted',
            request:{
                type:'POST',
                url:'https://localhost:3000/orders',
                body:{
                    productId:'ID',
                    quantity:'Number'
                }
            }
        })
    })
    .catch(err =>{
        res.status(500).json({
            message:'Order not found',
            error:err
        })
    })
   
})
module.exports = router;