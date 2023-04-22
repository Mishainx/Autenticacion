import { Messages } from "../dao/persistence.js";
const message = new Messages()
import MessageRepository from "../repository/message.repository.js";
const messageRepository = new MessageRepository(message)


const getMessages = async (req, res) => {
    try {
      let users = await messageRepository.getMessage()
      res.status(200).json(users);
    } catch (err) {
      req.logger.error(`${req.method} en ${req.url}- ${new  Date().toLocaleTimeString()}`)
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