const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;


const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const Todo = new Schema({
    title: { type: String, required: true },
    userId:ObjectId
})

const UserModel = mongoose.model("User", UserSchema);
const TodoModel = mongoose.model("Todo", Todo);

module.exports = { UserModel, TodoModel };
