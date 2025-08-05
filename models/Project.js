const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  images: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    required: true,
    enum: ['residential', 'commercial', 'interior', 'renovation'],
    default: 'residential'
  },
  location: {
    type: String,
    trim: true
  },
  area: {
    type: String,
    trim: true
  },
  year: {
    type: Number
  },
  client: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Project", projectSchema);
