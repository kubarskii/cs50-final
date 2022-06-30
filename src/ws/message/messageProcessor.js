/** @typedef {import('./abstract-message.js')} AbstractMessage */

export default class MessageProcessor {
  /**
     * @template T
     * @param {T & AbstractMessage} message
     * @return {void}
     * */
  process(message) {
    message.send();
  }
}
