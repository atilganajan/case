const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: UserId dinamik verildi. User silinirse değerlendirmede silinecek şekilde düşünüldü. (Uygulamaya ve kullanıcı gizliliği politikasına göre değişebilir) 

const ReviewSchema = new Schema({
    orderId:{
        type: Schema.Types.ObjectId,
        ref: "Order"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    branchId: {
        type: Schema.Types.ObjectId,
        ref: "Branch"
    },
    comment: {
        type: String,
    },
    rating: {
        type: Number,
        min: 1,
        max: 10
    },

},
    {
        timestamps: true
    }

);

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;