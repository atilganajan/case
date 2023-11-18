const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: Order işlemi tamamlanmış ve geçmişi gösteren bir data olduğu için bilgiler static olarak eklendi. ObjectId'ler link verebilmemiz için tutuluyor.

const OrderSchema = new Schema({

    user: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        username: {
            type: String,
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
        address: {
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
        },
    },

    restaurant: {
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: "Restaurant"
        },
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        logo: {
            type: String,
        },
        branch: {
            branchId: {
                type: Schema.Types.ObjectId,
                ref: "Branch"
            },
            branchName: {
                type: String
            },
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
                type: Object
            }
        },
        restaurantType: [
            {
                type: String
            }
        ],
    },

    items: [
        {
            itemId: {
                type: Schema.Types.ObjectId,
                href: "Menu"
            },
            itemName: {
                type: String,
            },
            content: {
                type: String,
            },
            coverImage: {
                type: String,
            },
            price: {
                type: Number,
            },
            quantity: {
                type: Number
            }
        }
    ],

    orderDate: {
        type: Date
    },
    is_review: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }

);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;