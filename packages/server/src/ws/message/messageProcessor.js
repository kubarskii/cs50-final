/** @typedef {import('./base-message.js')} BaseMessage */

export default class MessageProcessor {
  /**
     * @param {any} message
     * @return {void}
     * */
  process(message) {
    message.send();
  }
}
