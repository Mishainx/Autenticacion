
import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {
    type:String,
    index: true,
    unique:true
  },
  purchase_datetime: String,
  amount: Number,
  purcharser: {
    type: String,
  },
  products:{
    type: Array
  }
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;