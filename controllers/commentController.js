const Comment = require('../models/commentModel');
const Workout = require('../models/workoutModel');

// create the comment
const createComment = async (req,res) => {
    const {workoutId} = req.params // id of the workout to create the comment on

    try {
        const workout = await Workout.findById(workoutId)

        if(!workout) {
            return res.status(404).json({error: 'Workout Not Found'});
        }

        const newComment = new Comment ({
            text: req.body.text,
            user_id: req.body.user_id
        })

        // next, save the comment to the database
        await newComment.save();

        // push the comment into the comments array on the workouts
        workout.comments.push(newComment);

        // save the workout on the database
        await workout.save();

        res.status(201).json(newComment);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Server Error'});
    }
}

// edit the comment
const editComment = async (req,res) => {
    const {workoutId, commentId} = req.params

    try {
        const workout = await Workout.findById(workoutId);

        if(!workout) {
            return res.status(404).json({error: 'Workout Not Found'});
        }

        const comment = await Comment.findByIdAndUpdate(
            commentId,
            {
                text: req.body.text,
            },
            {new: true}
        )

        if (!comment) {
            return res.status(404).json({error: 'Comment Not Found'});
        }

        res.status(200).json(comment);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Server Error'});
    }
}

// delete the comment
const deleteComment = async (req,res) => {
    const {workoutId, commentId} = req.params

    try {
        const workout = await Workout.findById(workoutId);

        if(!workout) {
            return res.status(404).json({error: 'Workout not found'})
        }

        const comment = await Comment.findByIdAndDelete(commentId)

        if (!comment) {
            return res.status(404).json({error: 'Comment not found'})
        }

         // remove the comment reference
        workout.comments = workout.comments.filter(
            (comment) => comment.toString() !== commentId
        )

        res.status(200).json(comment);
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Server error'})
    }
}

module.exports = {createComment, editComment, deleteComment}