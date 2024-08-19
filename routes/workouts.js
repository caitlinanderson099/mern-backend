// this contains all of the routes and endpoints for the workouts
// because this is an express app and using express api, bring in express:
const express = require('express');
// bring in the router: this is the "router" method of express
const router = express.Router();

// Multer JS Initialization
const multer = require('multer'); // terminal command: npm i multer
const path = require('path');

// Configure Multer's Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext); // This Is The Unique File Name
    }
});

const upload = multer({storage}); // public folder

// import the controller functions
const {
    getWorkouts,
    getWorkout,
    createWorkout,
    updateWorkout,
    deleteWorkout
} = require('../controllers/workoutController');

// Use the router variable + the HTTP method to create a route:
router.get('/', getWorkouts);
router.get('/:id', getWorkout);
router.post('/', upload.single('image'), createWorkout);
router.patch('/:id', updateWorkout); // this is allowing us to update specific workouts
router.delete('/:id', deleteWorkout); // this allows us to delete a specific workout

module.exports = router;