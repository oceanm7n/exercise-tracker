const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    exercises: [
        {
            description: String,
            duration: Number,
            date: {
                type: Date,
                default: Date.now()
            }
        }
    ]
});

module.exports = User = mongoose.model('user', UserSchema);