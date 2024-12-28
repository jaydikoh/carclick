const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema({
    name: {
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
    },
    city: {
        type: String,
        required: true,
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