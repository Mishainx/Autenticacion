import mongoose from "mongoose";

const userCollection = "usuarios";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique:true,
    index: true
  },
  age: Number,
  password: String,
  role: {
    type: String,
    default: 'User'
},
  cart:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"carts"
}
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;