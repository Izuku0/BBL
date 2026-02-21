const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    cricketFormat: {
        type: [String],
        required: true,
    },
    role: {
        type: [String],
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    jerseySize: {
        type: String,
        required: true,
    },
    jerseyNumber: {
        type: Number,
        required: true,
    },
    travelCost: {
        type: Number,
        required: true,
    },
    photoPath: {
        type: String,
        required: true, // stored URL of Cloudinary asset
    },
    photoPublicId: {
        type: String,
        required: true, // necessary for deleting from Cloudinary
    },
    profileLink: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
