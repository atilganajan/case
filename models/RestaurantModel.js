const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RestaurantSchema = new Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    logo: {
        type: String,
    },
    branches: [
        {
            type: Schema.Types.ObjectId,
            ref: "Branch"
        }
    ],
    menus: [
        {
            type: Schema.Types.ObjectId,
            ref: "Menu"
        }
    ],
    restaurantType:[
        {
            type:String
        }
    ],
},
    {
        timestamps: true
    }

);

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

module.exports = Restaurant;