const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
    itemName: {
        type: String,
    },
    price: {
        type: Number,
    },
    content: {
        type: String,
    },
    coverImage:{
        type: String,
    }

},
    {
        timestamps: true
    }

);

const Menu = mongoose.model("Menu", MenuSchema);

module.exports = Menu;