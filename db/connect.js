const mongoose = require('mongoose');

const connect = () => {

    mongoose.connect(`${process.env.DB_URL}?retryWrites=false`).then(() => {
        console.log("DB connection successfully");
    }).catch((err) => {
        console.log(`DB connection failed ${err}`)
    });



}


module.exports = connect;