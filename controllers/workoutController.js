// import the model here
const Workout = require('../models/workoutModel');

// import Mongoose
const mongoose = require('mongoose');

// GET ALL Workouts
const getWorkouts = async (req, res) => {
   try {
    const workouts = await Workout.find({}).populate({
        path: 'comments',
        model: 'Comment'
    }).sort({createdAt: -1})
    res.status(200).json(workouts);

   } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
   }
}

// GET SINGLE Workout
const getWorkout = async (req, res) => {
    const {id} = req.params
    // check if id is valid mongo id
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'});
    }

    try {
        // find the workout, populate the comments array with the comment document
        const workout = await Workout.findById(id).populate({
            path: 'comments',
            model: 'Comments' // this is referencing the 'comments' model
        })


        // if no workout found show an error
        if(!workout) {
        return res.status(404).json({error: 'No such workout'});
        }

         // otherwise return the workout found
        res.status(200).json(workout)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Internal Server Error'})
    } 
}

// CREATE Workout
const createWorkout = async (req, res) => {
    const {title, load, reps, user_id} = req.body

    // Get The Uploaded Image File Name From The req.file Object
    const imageFilename = req.file ? req.file.filename : null;

    // Add Doc To Database 
    try {
        const workout = await Workout.create({
            title, 
            load, 
            reps, 
            user_id,
            image: imageFilename
        })
        res.status(200).json(workout)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// DELETE Workout
const deleteWorkout = async (req, res) => {
    //step 1: get the id from the request parameters
    const {id} = req.params; // this is getting the id from the request parameters

    // step 2: check to see if the id is valid from mongo objectId, 
    // if its not valid, this function will return an error
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "No Workout Found"});
    }

    //  if it IS VALID, find it and delete it:
    const workout = await Workout.findOneAndDelete({_id: id});

    // if the id is VALID, but no workout is found:
    if(!workout) {
        return res.status(404).json({error: "No Workout Found"});
    }

    // if it SUCCESSFULLY finds and deletes:
    res.status(200).json(workout);

}

// UPDATE Workout
const updateWorkout = async (req, res) => {
    // step 1: grab the id from the request params
    const {id} = req.params
    // step 2: check if the mongo id is valid
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No Workout Found"});
    }

    // step 3: find a workout by its id:
    // if it find it, then spread out properties of the workout
    // edit/change what it receives, -- this comes from the request body
    const workout = await Workout.findOneAndUpdate(
        {_id: id}, 
        {...req.body},
        {new: true}
    );

    if(!workout) {
        return res.status(404).json({error: "No Workout Found"});
    }

    // return the updated workout
    res.status(200).json(workout);

}

// after creating these functions ENSURE THAT YOU PLACE IT INSIDE THE EXPORTS HERE!!
module.exports = {getWorkouts, getWorkout, createWorkout, updateWorkout, deleteWorkout};