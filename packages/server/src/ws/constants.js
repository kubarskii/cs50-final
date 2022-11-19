export const UNIQUE_USER = Symbol('user');

/**
 * @type { Record<string, MessageType> }
 * */
export const MESSAGE_TYPES = {
  CLIENT_MESSAGE: 1,
  SERVER_MESSAGE: 2,
  CLIENT_ERROR: 3,
  SERVER_ERROR: 4,
};

/**
 * @type { Record<string, MessageCommand> }
 * */
export const MESSAGE_COMMANDS = {
  MESSAGE: 'message',
  IS_ONLINE: 'online',
  MESSAGES: 'messages',
  MISSED: 'missed',
  ROOMS: 'rooms',
  COMMAND: 'command',
  TYPING: 'typing',
  SYS_MESSAGE: 'system',
  STOP_TYPING: 'stopTyping',
};

/**
 * @type { Record<string, MessageStatus> }
 * */
export const MESSAGE_STATUSES = {
  NOT_DELIVERED: 1,
  PENDING_DELIVERY: 2,
  DELIVERED: 3,
  NOT_VIEWED: 4,
  VIEWED: 5,
  UNAUTHORIZED: 6,
  CANNOT_BE_PROCESSED: 7,
  TYPING: 8,
  EMPTY_MESSAGE: 9,
};
