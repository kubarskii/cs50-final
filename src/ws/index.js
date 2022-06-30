import { WebSocketServer } from 'ws';
import { checkSchema } from './utils';
import './typedef';
import { MESSAGE_COMMANDS, MESSAGE_STATUSES, MESSAGE_TYPES } from './constants';
import MessageProcessor from './message/messageProcessor';
import TextMessage from './message/text-message';
import ServerMessage from './message/server-message';
import ServerErrorMessage from './message/server-error-message';

/** @type {JSONSchema} */
const PayloadDTOSchema = {
  properties: {
    message: {
      type: 'string',
    },
    errorType: {
      type: 'number',
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
  // required: ['message', 'errorType', 'messageStatus'],
};

/** @type {JSONSchema} */
const MessageDTOSchema = [
  { type: 'number', in: [1, 2, 3, 4] },
  { type: 'string', in: ['message', 'command'] },
  { type: 'object', ref: PayloadDTOSchema },
];

/**
 * @param { MessageDTO } obj, Array or Object
 * @return {ValidationResult}
 * */
const isValidRequest = (obj) => checkSchema(obj, MessageDTOSchema);

const messageProcessor = new MessageProcessor();

/** @type {(data: Buffer) => void} */
function onMessage(data) {
  const ws = this;
  try {
    /** TODO: Add JSON Schema validator */
    /** @type MessageDTO */
    const dataObj = JSON.parse(data.toString());
    const [isValid, message] = isValidRequest(dataObj);
    if (isValid) {
      switch (dataObj[0]) {
        case 1: messageProcessor.process(new ServerMessage(dataObj, ws)); break;
        case 2: messageProcessor.process(new ServerErrorMessage('Message cannot be from the server', ws)); break;
        case 3: messageProcessor.process(new TextMessage('Error processed', ws)); break;
        case 4: messageProcessor.process(new ServerErrorMessage('Server error can be generated only by server', ws)); break;
        default: messageProcessor.process(new ServerErrorMessage('Unknown Message Type', ws)); break;
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

const generateUnauthorized = () => [
  MESSAGE_TYPES.SERVER_ERROR,
  MESSAGE_COMMANDS.MESSAGE,
  { message: 'User is not authorized', errorType: MESSAGE_STATUSES.UNAUTHORIZED },
];

const onConnection = (wss) => (ws, request) => {
  const url = new URL(request.url, 'http://localhost/');
  const authentication = url.searchParams.get('authentication');
  if (!authentication) {
    ws.send(JSON.stringify(generateUnauthorized()));
    closeConnection(Array.from(wss.clients), ws);
  } else {
    /** TODO: validate token */
    ws.on('message', onMessage);
  }
};

export default function runWS(config) {
  const wss = new WebSocketServer({ ...config, clientTracking: true });
  wss.on('connection', onConnection(wss));
  return wss;
}
