const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
    },
    profileImage: {
        type: String,
    },
    addresses: [
        {
            city: {
                type: String
            },
            district: {
                type: String
            },
            street: {
                type: String
            },
            location: {
                type: { type: String, default: 'Point' },
                coordinates: { type: [Number], index: '2dsphere' }
            }
        }
    ]
},
    {
        timestamps: true
    }

);

const User = mongoose.model("User", UserSchema);

module.exports = User;