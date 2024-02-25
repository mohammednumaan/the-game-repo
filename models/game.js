const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    name: {type: String, required: true},
    developer: {type:String, required: true},
    description: {type:String, required: true},
    price: {type: Number, required: true},
    category: [{type: Schema.Types.ObjectId, ref:"Category"}],
    stock: {type: Number, required: true},
});

GameSchema.virtual("url").get(function(){
    return `/store/game/${this._id}`;
});

module.exports = mongoose.model("Game", GameSchema);