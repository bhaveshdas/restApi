const Sequelize = require('sequelize');

const sequelize = require('../middleware/database');

const User = sequelize.define('user', {
  _id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    isUnique: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    isUnique: true,
    allowNull: false,
    validate: { isEmail: true },
    },

  password: {
    type:Sequelize.STRING,
    allowNull: false,
  }
});

module.exports = User;


// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//     email:{ 
//         type: String,
//         required: true,
//         unique: true,
//         match: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
//         },
//     password:{
//         type: String,
//         required: true}
// });

// module.exports = mongoose.model('user', userSchema);