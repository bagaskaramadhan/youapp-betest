import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Messages } from './messages.model';
import { Users } from 'src/users/users.model';
import * as dayjs from 'dayjs';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('cMessages') private readonly messagesModel: Model<Messages>,
    @InjectModel('cUsers') private readonly usersModel: Model<Users>,
  ) {}

  async sendMessage(data: any, decodeId: string) {
    const checkSender = await this.usersModel.findOne({
      username: data.sender.toLowerCase(),
    });
    const checkReceiver = await this.usersModel.findOne({
      username: data.received.toLowerCase(),
    });
    if (!checkReceiver || !checkSender) {
      return new Error('User not found');
    }

    if (checkSender.id !== decodeId) {
      return false;
    }

    data.sender = checkSender.id.toString();
    data.received = checkReceiver.id.toString();

    const createMessage = await new this.messagesModel(data);
    const resultMessage = {
      id: createMessage.id,
      sender: checkSender.username,
      received: checkReceiver.username,
      content: data.content,
      timestamp: dayjs(createMessage.timestamp).format('YYYY-MM-DD HH:mm:ss'),
    };
    await createMessage.save();
    return resultMessage;
  }

  async viewAllMessages(id: string) {
    const messages = await this.messagesModel
      .find({ $or: [{ sender: id }, { received: id }] })
      .exec();
    const mappingMessage = await Promise.all(
      messages.map(async (item) => {
        const sender = await this.usersModel.findById(item.sender);
        const receiver = await this.usersModel.findById(item.received);
        return {
          id: item.id,
          sender: sender.username,
          received: receiver.username,
          content: item.content,
          timestamp: dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss'),
        };
      }),
    );
    return mappingMessage;
  }

  async viewMessageByUsername(id: string, username: string) {
    const getUserByUsername = await this.usersModel.findOne({ username });
    const messages = await this.messagesModel.find({
      $or: [
        { sender: id, received: getUserByUsername.id },
        { sender: getUserByUsername.id, received: id },
      ],
    });
    const mappingMessage = await Promise.all(
      messages.map(async (item) => {
        const sender = await this.usersModel.findById(item.sender);
        const receiver = await this.usersModel.findById(item.received);
        return {
          id: item.id,
          sender: sender.username,
          received: receiver.username,
          content: item.content,
          timestamp: dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss'),
        };
      }),
    );
    return mappingMessage;
  }

  async viewOneMessage(decodeId: string, id: string) {
    const checkIdMessage = await this.messagesModel.findById(id);
    if (checkIdMessage.sender.toString() !== decodeId) {
      return false;
    }
    return true;
  }

  async deleteMessageById(id: string) {
    const deleteMessage = await this.messagesModel.findByIdAndDelete(id);
    return deleteMessage;
  }
}
