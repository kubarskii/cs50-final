import { WebSocketServer } from 'ws';
/**
 * @typedef {object} MessagePayload
 * @property {string} message
 * @property {?string} errorType
 * */

/**
 * @typedef {1 | 2 | 3 | 4} MessageType -
 * 1 - client message, 2 - server message, 3 - client error, 4 - server error
 * @typedef {"message" | "command"} MessageCommand
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
 * @return {(data: Buffer) => void}
 * */
const onMessage = (ws) => (data) => {
  /** TODO: Add JSON Schema validator */
  /** @type MessageDTO */
  const dataObj = JSON.parse(data.toString());
  const [isValid, message] = isValidRequest(dataObj);
  if (isValid) {
    if (isClientError(dataObj)) {

    }
    ws.send(JSON.stringify(dataObj));
  } else {
    ws.send(JSON.stringify(generateServerErrorMessage(message)));
  }
};

export default function runWS(config) {
  const wss = new WebSocketServer(config);

  wss.on('connection', (ws) => {
    ws.on('message', onMessage(ws));
  });

  return wss;
}
