/**
 * @typedef { 1 | 2 | 3 | 4 | 5 } MessageErrorType
 */

/**
 * @typedef { 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 } MessageStatus
 */

/**
 * BaseMessage payload passed in MessageDTO as a last parameter
 * @typedef {object} MessagePayload
 * @property {string} [value] plain text sent by users/server
 * @property {string | number} [chatId]
 * @property {string} [messageId]
 * @property {MessageErrorType} [errorType]
 * @property {object} [sender]
 * @property {MessageStatus[]} [messageStatus]
 * */

/**
 * @typedef { 1 | 2 | 3 | 4 } MessageType
 * 1 - client value, 2 - server value, 3 - client error, 4 - server error;
 * */

/**
 * @typedef {
 * "value"
 * | "command"
 * | "typing"
 * | "system"
 * | "missed"
 * | "message"
 * | "messages"
 * | "rooms" } MessageCommand
 * command - can be used for chatbots, value - default value;
 * /

 /**
 * @typedef {[MessageType, MessageCommand, MessagePayload]
 * | [MessageType, MessagePayload]} MessageDTO
 */

/**
 * @typedef {boolean} ValidationFlag
 * @typedef {string} ValidationErrorMessage
 * @typedef {[ValidationFlag, ValidationErrorMessage]} ValidationResult
 * */

/**
 * @typedef {object} Items
 * @property {string} [type]
 * @property {object} [ref]
 * @property {Record<string | number,  ObjectSchema>} [properties]
 * */

/**
 * @typedef {"string" | "number" | "array" | "object" | "null" | "boolean" & string} JSONTypes
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
 * @property {Record<string, SchemaProperty>} [properties]
 * @property {ObjectSchema} [ref]
 * */

/**
 * @typedef {object} Required
 * @property {string[]} required - required fields that MUST be passed
 */

/**
 * @typedef {ObjectSchema & Required} Schema
 * */
