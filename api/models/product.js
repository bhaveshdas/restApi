const Sequelize = require('sequelize');

const sequelize = require('../middleware/database');

const Product = sequelize.define('product', {
  _id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
});

module.exports = Product;


// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const productSchema = new Schema({
//     name:{
//         type: String,
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     productImage:{
//         type: String
//     }
// })

// module.exports = mongoose.model('Product', productSchema);