/**
 * @typedef { 1 | 2 | 3 | 4 | 5 } MessageErrorType
 */

/**
 * Message payload passed in MessageDTO as a last parameter
 * @typedef {object} MessagePayload
 * @property {string} [message] plain text sent by users/server
 * @property {string | number} [chatId]
 * @property {string} [messageId]
 * @property {MessageErrorType} [errorType]
 * @property {number[]} [messageStatus]
 * */

/**
 * @typedef { 1 | 2 | 3 | 4 } MessageType
 * 1 - client message, 2 - server message, 3 - client error, 4 - server error;
 * */

/**
 * @typedef { "message" | "command" | "typing" | "system" } MessageCommand
 * command - used for chatbots, message - default value;
 * @typedef {MessagePayload} MessagePayload
 * @typedef {[MessageType, MessageCommand, MessagePayload]} MessageDTO
 * */

/**
 * @typedef {boolean} ValidationFlag
 * @typedef {string} ValidationErrorMessage
 * @typedef {[ValidationFlag, ValidationErrorMessage]} ValidationResult
 * */

/**
 * @typedef {object} ArraySchema
 * @property {string} type
 * @property {number[] | string[]} [in]
 * */

/**
 * @typedef {object} Items
 * @property {string} [type]
 * @property {object} [ref]
 * */

/**
 * @typedef {"string" | "number" | "array" | "object" | "null" | "boolean"} JSONTypes
 * */

/**
 * @typedef {object} SchemaProperty
 * @property {JSONTypes} type
 * @property {Items} [items]
 * */

/**
 * @typedef {object} ObjectSchema
 * @property {JSONTypes} [type]
 * @property {Items} [items]
 * @property {Record<string, SchemaProperty>} properties
 * @property {string[]} required
 * */

/**
 * @typedef {ArraySchema[] | ObjectSchema | boolean | number | null | string} JSONSchema
 * */
