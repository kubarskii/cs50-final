/** @typedef {import('./message')} Message*/

export default class MessageSender {

    /**
     * @param {Message} message
     * @return {Promise<any>}
     * */
    async send(message) {
        return await message.send()
    }
}
