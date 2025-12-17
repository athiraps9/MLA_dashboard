const mongoose = require('mongoose');

const LandingPageSchema = new mongoose.Schema({
  aboutText: { type: String, default: 'Welcome to the MLA Public Insight Dashboard.' },
  usageSteps: [{ type: String }],
  featureCards: [{
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String } // Storing URL or default icon name
  }],
  featuredProjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
});

module.exports = mongoose.model('LandingPage', LandingPageSchema);
