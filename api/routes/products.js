const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/')
    },
    filename: function(req,file,cb){
cb(null,new Date().toISOString()+ file.originalname);
    }
});
const fileFilter = (req,file,cb)=>{
    // if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true);
    // }
    // else{
    //     cb(null,false);
    // }
}
const upload = multer(
    {storage: storage, 
        limits:{
    fileSize: 1024*1024*12
        },
        fileFilter:fileFilter
});



router.get('/',(req,res,next)=>{
    Product.findAll()
    .then(docs =>{
        const response = {
            count:docs.length,
            products: docs.map(doc =>{
                return {
                    name: doc.name,
                    price: doc.price,
                    _id:doc._id,
                    productImage:doc.productImage,
                    request:{
                        type:'GET',
                        url:'https://localhost:3000/products/'+doc._id,

                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err});
    })
});

router.post('/',checkAuth,upload.single('productImage'),(req,res,next)=>{
  
    const product = new Product({
        name: req.body.name,
        price:req.body.price,
        productImage:req.file.path
    });
    product.save()
    .then(result =>{
       
        res.status(201).json({
            message: 'handled POST request to /product',
            created: {
                name: result.name,
                price:result.price,
                _id: result._id,
                productImage:result.productImage,
                request:{
                    type:'POST',
                    url: 'https://localhost:3000/products/'+result._id,
                    
                }
            }
        });
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({error:err});
    });
   
});

router.get('/:productId', (req,res, next)=>{
    const id = req.params.productId;
    Product.findById(id)
    .then(doc =>{
        if(doc){
        res.status(200).json({
            product:doc,
            message: 'fetched product',
            request:{
                type: 'GET',
                url: 'https://localhost:3000/products'+id
            }
        });
        }
        else{
            res.status(404).json({message:'Not found'});
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error:err});
    })
    
});

router.patch('/:productId',checkAuth, (req,res, next)=>{
    const id = req.params.productId;
    Product.updateOne({_id: id}, {$set:req.body }, {new: true})
    .then(result =>{
        res.status(200).json({
            message: 'Product updated',
            request:{
                type: 'PATCH',
                url: 'https://localhost:3000/products'+id
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error:err});
    })
  
});

router.delete('/:productId',checkAuth, (req,res, next)=>{
    const id = req.params.productId;
    Product.deleteOne({_id: id})
    .then(result =>{
        res.status(200).json({
            message:'Product Deleted',
            request:{
                type: 'POST',
                url: 'https:localhost:3000/products',
                body:{
                    name: 'String',
                    price:'Number'
                }
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error:err});
    })
});
module.exports = router;