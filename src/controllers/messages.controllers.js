import { messageModel } from "../dao/mongo/models/messages.model.js"

const getMessages = async (req, res) => {
    try {
      let users = await messageModel.find();
      console.log(users);
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }

const getMessagesArray = async (req, res) => {
    let messages = [];
    res.json(messages);
}

export {
    getMessages,
    getMessagesArray
}