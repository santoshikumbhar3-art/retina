const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
    patientName: { type: String, default: "Anonymous" },
    filename: { type: String, required: true },
    diagnosis: { type: String, required: true },
    confidence: { type: Number, required: true },
    riskLevel: { type: String, required: true },
    imagePath: { type: String },
    heatmap: { type: String },
    observations: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
