const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BranchSchema = new Schema({
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
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], index: '2dsphere' }
    }

},
    {
        timestamps: true
    }

);
BranchSchema.index({ location: '2dsphere' });
const Branch = mongoose.model("Branch", BranchSchema);

module.exports = Branch;