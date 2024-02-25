const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {type: String, required: true, min:3, max:100},
    description: {type: String, required: true}
})

CategorySchema.virtual("url").get(function(){
    return `/store/category/${this.id}`;
});

module.exports = mongoose.model("Category", CategorySchema)