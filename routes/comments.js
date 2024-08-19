const express = require('express');
const router = express.Router();

const {
    createComment,
    editComment,
    deleteComment
} = require('../controllers/commentController');

// Set up route to create a new comment for a specific workout
router.post(`/workouts/:workoutId/comments`, createComment);

// Set up route to edit existing comment for a specific workout
router.patch(`/workouts/:workoutId/comments`, editComment);
// Set up route to delete existing comment for a specific workout
router.delete(`/workouts/:workoutId/comments`, deleteComment);

module.exports = router;