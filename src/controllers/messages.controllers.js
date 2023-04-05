import { Messages } from "../dao/persistence.js";
const message = new Messages()
import MessageRepository from "../repository/message.repository.js";
const messageRepository = new MessageRepository(message)


const getMessages = async (req, res) => {
    try {
      let users = await messageRepository.getMessage()
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