const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const ItemSchema = new mongoose.Schema ({
    name: String,
    originalprice: String,
    finalprice: Stirng
});
ItemSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Item",ItemSchema);