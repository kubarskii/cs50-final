import url from 'url';
import { WebSocketServer } from 'ws';
import { validateSchema } from '../lib/schema-validator';
import '../typedef';
import { MESSAGE_COMMANDS, MESSAGE_STATUSES, MESSAGE_TYPES } from './constants';
import MessageProcessor from './message/messageProcessor';
import TextMessage from './message/text-message';
import ServerMessage from './message/server-message';
import ServerErrorMessage from './message/server-error-message';

/** @type {Schema} */
const PayloadDTOSchema = {
  type: 'object',
  properties: {
    message: {
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
  required: ['message'],
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

/** @type {(data: Buffer) => void} */
function onMessage(data) {
  const ws = this;
  try {
    /** TODO: Add JSON Schema validator */
    /** @type MessageDTO */
    const dataObj = JSON.parse(data.toString());
    const [isValid, message] = schemaValidator(dataObj);
    if (isValid) {
      switch (dataObj[0]) {
        case 1:
          messageProcessor.process(new ServerMessage(dataObj, ws));
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
      messageProcessor.process(new TextMessage(message, ws));
    }
  } catch (e) {
    messageProcessor.process(new ServerErrorMessage(e.message, ws));
  }
}

/** TODO: FIX Wasn't able to close using ws ??? */
const closeConnection = (clientsArr, ws) => {
  const index = clientsArr.indexOf(ws);
  const client = (index >= 0) ? clientsArr[index] : null;
  if (client) client.close();
};

const onConnection = (wss) => (ws, request) => {
  console.log(request.headers['x-authenticate']); // jwt access_token
  const parsedUrl = url.parse(request.url, true);
  const { token } = parsedUrl.query;
  if (!token) {
    messageProcessor.process(new ServerErrorMessage('User is not authorized', ws));
    closeConnection(Array.from(wss.clients), ws);
  } else {
    /** TODO: check token */
    ws.on('message', onMessage);
  }
};

export default function runWS(config) {
  const wss = new WebSocketServer({ ...config, clientTracking: true });
  wss.on('connection', onConnection(wss));
  return wss;
}
