/** @typedef {import('./abstract-message.js')} AbstractMessage */

export default class MessageProcessor {
  /**
     * @param {AbstractMessage} message
     * @return {void}
     * */
  process(message) {
    message.send().then(() => {
    });
  }
}
