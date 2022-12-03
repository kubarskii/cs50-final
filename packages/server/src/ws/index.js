import url from 'url';
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import '../../typedef';
import {
  MESSAGE_COMMANDS, MESSAGE_STATUSES, MESSAGE_TYPES, UNIQUE_USER,
} from './constants';
import MessageProcessor from './message/messageProcessor';
import TextMessage from './message/text-message';
import ServerMessage from './message/server-message';
import ServerErrorMessage from './message/server-error-message';
import { SECRET_KEY } from '../utils/jwt';
import ClientErrorMessage from './message/client-error-message';
import { validateSchema } from '../utils/schema-validator';
import User from '../models/user';
import db from '../utils/db';
import Message from '../models/message';

/** @type {Schema} */
const PayloadDTOSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
    },
    roomId: {
      type: 'string',
    },
    messageStatus: {
      type: 'array',
      items: {
        type: 'number',
        in: Object.values(MESSAGE_STATUSES),
      },
    },
  },
  required: [],
};

/** @type {Schema} */
const MessageDTOSchema = {
  type: 'array',
  items: {
    properties: {
      0: {
        type: 'number',
        in: Object.values(MESSAGE_TYPES),
      },
      1: {
        type: 'string',
        in: Object.values(MESSAGE_COMMANDS),
      },
      2: {
        type: 'object',
        ref: PayloadDTOSchema,
      },
    },
  },
};

const messageProcessor = new MessageProcessor();
const schemaValidator = validateSchema(MessageDTOSchema);

const user = new User(db);
const message = new Message(db);

/** @type {(data: Buffer) => void} */
function onMessage(wss) {
  return function (data) {
    const ws = this;
    try {
      const dataObj = JSON.parse(data.toString());
      const [isValid, errorMessage] = schemaValidator(dataObj);
      if (isValid) {
        switch (dataObj[0]) {
          case 1:
            messageProcessor.process(new ServerMessage(dataObj, this, wss));
            break;
          case 2:
            messageProcessor.process(new ServerErrorMessage('BaseMessage cannot be from the server', ws));
            break;
          case 3:
            messageProcessor.process(new TextMessage('Error processed', ws));
            break;
          case 4:
            messageProcessor.process(new ServerErrorMessage('Server error can be generated only by server', ws));
            break;
          default:
            messageProcessor.process(new ServerErrorMessage('Unknown BaseMessage Type', ws));
            break;
        }
      } else {
        messageProcessor.process(new ClientErrorMessage(errorMessage, ws));
      }
    } catch (e) {
      messageProcessor.process(new ServerErrorMessage(e.message, ws));
    }
  };
}

/** TODO: FIX Wasn't able to close using ws ??? */
const closeConnection = (clientsArr, ws) => {
  const index = clientsArr.indexOf(ws);
  const client = (index >= 0) ? clientsArr[index] : null;
  if (client) client.close();
};

const checkTokenIsJWT = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      reject(err);
    }
    resolve(decoded);
  });
});

const onConnection = (wss) => async (ws, request) => {
  const parsedUrl = url.parse(request.url, true);
  const { token } = parsedUrl.query;
  try {
    const { id } = await checkTokenIsJWT(token);
    const userData = await user.getById(id);
    if (!userData.rows.length) {
      messageProcessor.process(new ServerErrorMessage('User is not authorized', ws));
      closeConnection(Array.from(wss.clients), ws);
    }
    const userMissedMessages = await message.getUnreceivedMessages(id);
    // eslint-disable-next-line no-param-reassign,prefer-destructuring
    ws[UNIQUE_USER] = userData.rows[0];
    ws.on('message', onMessage(wss));
    if (userMissedMessages?.length) {
      ws.send(
        JSON.stringify([
          MESSAGE_TYPES.SERVER_MESSAGE,
          MESSAGE_COMMANDS.MISSED,
          { missed: userMissedMessages },
        ]),
      );
    }
    await message.deleteUnreceivedMessages(id);
  } catch (e) {
    messageProcessor.process(new ServerErrorMessage('User is not authorized', ws));
    closeConnection(Array.from(wss.clients), ws);
  }
};

export default function runWS(config) {
  const wss = new WebSocketServer({ ...config, clientTracking: true });
  wss.on('connection', onConnection(wss));
  return wss;
}
