import mongoose from "mongoose";

const resetPasswordCollection = "resetPassword";

const resetPasswordSchema = new mongoose.Schema({
  email: {
    type: String,
    required:true,
  },
  token:{
    type: String,
    required: true
  },
  expiration:{
    type: Date,
    required: true
},
    status:{
        type: Boolean,
        required:true,
        default:true
    }
});

const resetPasswordModel = mongoose.model(resetPasswordCollection, resetPasswordSchema);

export default resetPasswordModel;