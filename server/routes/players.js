const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Player = require('../models/Player');

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary Storage config
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'bbl_players', // Specific folder in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Optimize images on upload
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

// GET all players
router.get('/', async (req, res) => {
    try {
        const players = await Player.find().sort({ createdAt: -1 });
        res.json(players);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single player
router.get('/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) return res.status(404).json({ message: 'Player not found' });
        res.json(player);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE player
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        const data = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Photo is required' });
        }

        const player = new Player({
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            cricketFormat: Array.isArray(data.cricketFormat) ? data.cricketFormat : data.cricketFormat.split(','),
            role: Array.isArray(data.role) ? data.role : data.role.split(','),
            address: data.address,
            jerseySize: data.jerseySize,
            jerseyNumber: Number(data.jerseyNumber),
            travelCost: Number(data.travelCost),
            photoPath: req.file.path, // Cloudinary URL
            photoPublicId: req.file.filename, // Cloudinary Public ID
            profileLink: data.profileLink,
        });

        const newPlayer = await player.save();
        res.status(201).json(newPlayer);
    } catch (err) {
        // If save fails, attempt to delete uploaded image from Cloudinary to keep it clean
        if (req.file) await cloudinary.uploader.destroy(req.file.filename);
        res.status(400).json({ message: err.message });
    }
});

// UPDATE player
router.put('/:id', upload.single('photo'), async (req, res) => {
    try {
        const data = req.body;
        const player = await Player.findById(req.params.id);
        if (!player) return res.status(404).json({ message: 'Player not found' });

        if (req.file) {
            // Delete old photo from Cloudinary
            if (player.photoPublicId) {
                await cloudinary.uploader.destroy(player.photoPublicId);
            }
            player.photoPath = req.file.path;
            player.photoPublicId = req.file.filename;
        }

        player.fullName = data.fullName || player.fullName;
        player.phoneNumber = data.phoneNumber || player.phoneNumber;

        if (data.cricketFormat) {
            player.cricketFormat = Array.isArray(data.cricketFormat) ? data.cricketFormat : data.cricketFormat.split(',');
        }
        if (data.role) {
            player.role = Array.isArray(data.role) ? data.role : data.role.split(',');
        }

        player.address = data.address || player.address;
        player.jerseySize = data.jerseySize || player.jerseySize;
        if (data.jerseyNumber) player.jerseyNumber = Number(data.jerseyNumber);
        if (data.travelCost) player.travelCost = Number(data.travelCost);
        player.profileLink = data.profileLink || player.profileLink;

        const updatedPlayer = await player.save();
        res.json(updatedPlayer);
    } catch (err) {
        if (req.file) await cloudinary.uploader.destroy(req.file.filename);
        res.status(400).json({ message: err.message });
    }
});

// DELETE player
router.delete('/:id', async (req, res) => {
    try {
        const player = await Player.findByIdAndDelete(req.params.id);
        if (!player) return res.status(404).json({ message: 'Player not found' });

        // delete photo from Cloudinary
        if (player.photoPublicId) {
            await cloudinary.uploader.destroy(player.photoPublicId);
        }

        res.json({ message: 'Player deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
