import { WebSocketServer } from 'ws';
/**
 * @typedef {object} MessagePayload
 * @property {string} [message]
 * @property {string} [errorType]
 * @property {string} [messageId]
 * @property {number[]} [messageStatus]
 * */

/**
 * @typedef { 1 | 2 | 3 | 4 } MessageType 1 - client message, 2 - server message, 3 - client error, 4 - server error;
 * @typedef { "message" | "command" } MessageCommand command - used for chatbots, message - default value;
 * @typedef {MessagePayload} MessagePayload
 * @typedef {[MessageType, MessageCommand, MessagePayload]} MessageDTO
 * */

/**
 * @typedef {boolean} ValidationFlag
 * @typedef {string} ValidationErrorMessage
 * @typedef {[ValidationFlag, ValidationErrorMessage]} ValidationResult
 * */

/**
 * @typedef {object} Schema
 * @property {string} type
 * @property {number[] | string[] | object[]} in
 * */

/**
 * @typedef {Schema[]} JSONSchema
 * */

/** @type {JSONSchema} */
const MessageDTOSchema = [
  { type: 'number', in: [1, 2, 3, 4] },
  { type: 'string', in: ['message', 'command'] },
  { type: 'object' },
];

/**
 * @type { Record<string, MessageType> }
 * */
const MESSAGE_TYPES = {
  CLIENT_MESSAGE: 1,
  SERVER_MESSAGE: 2,
  CLIENT_ERROR: 3,
  SERVER_ERROR: 4,
};

/**
 * @type { Record<string, MessageCommand> }
 * */
const MESSAGE_COMMANDS = {
  MESSAGE: 'message',
  COMMAND: 'command',
};

/**
 * @type { Record<string, number> }
 * */
const MESSAGE_STATUSES = {
  DELIVERED: 3,
  VIEWED: 5,
  NOT_DELIVERED: 1,
  NOT_VIEWED: 4,
  PENDING_DELIVERY: 2,
  UNAUTHORIZED: 6,
};

/**
 * @param {any} obj
 * @param {JSONSchema} schema
 * @return {boolean}
 * */
const checkSchema = (obj, schema) => {
  let isValid = true;
  for (let i = 0; i < schema.length; i += 1) {
    const curr = obj[i];
    // eslint-disable-next-line valid-typeof
    if (typeof curr !== schema[i].type) {
      isValid = false;
      break;
    }
    if (schema[i].in && !schema[i].in.includes(curr)) {
      isValid = false;
      break;
    }
  }
  return isValid;
};

const SCHEMA_MESSAGES = {
  VALID: 'Valid',
  INVALID_OBJECT: 'Invalid object passed',
  INVALID_MESSAGE_TYPE: 'Message type is unknown',
  INVALID_COMMAND_TYPE: 'Message command is unknown',
};

/**
 * @param { MessageDTO } obj, Array or Object
 * @return {ValidationResult}
 * */
const isValidRequest = (obj) => {
  const isValid = checkSchema(obj, MessageDTOSchema);

  if (isValid) {
    return [true, SCHEMA_MESSAGES.VALID];
  }

  let error = SCHEMA_MESSAGES.INVALID_OBJECT;

  if (!Object.values(MESSAGE_TYPES).includes(obj[0])) {
    error = SCHEMA_MESSAGES.INVALID_MESSAGE_TYPE;
  }

  if (!Object.values(MESSAGE_COMMANDS).includes(obj[1])) {
    error = SCHEMA_MESSAGES.INVALID_COMMAND_TYPE;
  }

  return [false, error];
};

/** @param {string} error
 *   @return {MessageDTO}
 *   */
const generateServerErrorMessage = (error) => [
  MESSAGE_TYPES.SERVER_ERROR,
  MESSAGE_COMMANDS.MESSAGE,
  { message: error },
];

/**
 * @return {boolean}
 * */
const isClientError = (obj) => obj[0] === MESSAGE_TYPES.CLIENT_ERROR;
/**
 * @return {boolean}
 * */
const isClientMessage = (obj) => obj[0] === MESSAGE_TYPES.CLIENT_MESSAGE;

/**
 * @return {MessageDTO}
 * */
const sendMessage = (obj) => {
  /** TODO:
     * 1. Generate id for the message and return it back to client
     * 2. Save message to DB
     * 3. If the receiver updated message - update message in DB, update user
     * 4
     * */

  console.log(obj);
};
/**
 * @return {(data: Buffer) => void}
 * */
const onMessage = function (data) {
  /** TODO: Add JSON Schema validator */
  /** @type MessageDTO */
  const dataObj = JSON.parse(data.toString());
  const [isValid, message] = isValidRequest(dataObj);
  if (isValid) {
    if (isClientError(dataObj)) console.log('ERROR ON CLIENT OCCURRED');
    if (isClientMessage) sendMessage(dataObj);
    this.send(JSON.stringify(dataObj));
  } else {
    this.send(JSON.stringify(generateServerErrorMessage(message)));
  }
};

/**
 * @param {string[]} rawHeaders
 * @return {object}
 * */
const parseRawHeaders = (rawHeaders) => {
  const res = {};
  if (rawHeaders.length % 2 !== 0) return res;
  for (let i = 0; i < rawHeaders.length; i += 2) {
    res[rawHeaders[i].toLowerCase()] = rawHeaders[i + 1];
  }
  return res;
};

/** Wasn't able to close using ws ??? */
const closeConnection = (clientsArr, ws) => {
  const index = clientsArr.indexOf(ws);
  const client = (index >= 0) ? clientsArr[index] : null;
  if (client) client.close();
};

const generateUnauthorized = () => [
  MESSAGE_TYPES.CLIENT_ERROR,
  MESSAGE_COMMANDS.MESSAGE,
  { message: 'User is not authorized', errorType: MESSAGE_STATUSES.UNAUTHORIZED },
];

export default function runWS(config) {
  const wss = new WebSocketServer({ ...config, clientTracking: true });
  wss.on('connection', (ws, request) => {
    const headersObj = parseRawHeaders(request.rawHeaders);
    if (!headersObj.authorization) {
      ws.send(JSON.stringify(generateUnauthorized()));
      closeConnection(Array.from(wss.clients), ws);
    } else {
      /** TODO: validate token */
      ws.on('message', onMessage);
    }
  });

  return wss;
}
