const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})


// static sign up method
userSchema.statics.signup = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled in')
    }

    //check if email is valid
    if(!validator.isEmail(email)) {
        throw Error ('Email is not valid')
    }

    // Check if password is strong enough
    // By default - min length 8; min lowercase 1; min number 1; min symbol 1
    if(!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough')
    }

    const exists = await this.findOne({email})

    if (exists) {
        throw Error('Email is already in use')
    }

    // Normal Password: mypassword
    // Add Salt: mypasswordj7hg4f6r3 (add slat to end of password)
    // Hash: 64ad45hsad798dhkjs76d45

    // Gen Salt with 10 characters:
    const salt = await bcrypt.genSalt(10);
    // Hash the password and salt combined:
    const hash = await bcrypt.hash(password, salt);

    //set the password to the hash value when creating the user:
    const user = await this.create({email, password: hash});

    return user
}

// static log in method
userSchema.statics.login = async function (email, password) {
    //check if there is a value for the email and password
    if(!email || !password) {
        throw Error('All Fields Must Be Filled In');
    };

    // try find the user in our database with the email
    const user = await this.findOne({email});

    // throw an error if no user is found
    if(!user) {
        throw Error('Incorrect Email');
    }

    // compare passwords
    const match = await bcrypt.compare(password, user.password) // return true or false

    // throw an error if they don't match
    if(!match) {
        throw Error('Incorrect Password')
    }

    // if it does match
    return user
}

module.exports = mongoose.model('User', userSchema);