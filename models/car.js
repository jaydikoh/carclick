const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      max: new Date().getFullYear(),
    },
    miles: {
      type: Number,
      required: true, 
    },
    condition: {
      type: String,
      enum: ['New', 'Pre-owned'], 
      required: true,
    },
    photo: {
      type: String,
      required: true
    },
    photokey: {
      type: String,
      required: true
    },
    city: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    favoritedBy: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },
}, {
  timestamps: true    
});

module.exports = mongoose.model('Car', carSchema);

