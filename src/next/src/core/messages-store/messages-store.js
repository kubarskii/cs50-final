import Observable from '../observable/observable';

const generateId = () => Math.random().toString().slice(2);

export default class MessagesStore extends Observable {
  constructor(initialMessages) {
    super(initialMessages);
  }

  isLoading = false;

  static isLoadingId = 'MESSAGE_STORE_LOADING_ID';

  add(message) {
    const id = message.uniqueId || generateId();
    if (this.isLoading) {
      const newValue = [
        ...this.value.slice(0, -1),
        { ...message, uniqueId: id },
        ...this.value.slice(-1),
      ];
      this.next(newValue);
    } else {
      const newValue = this.value.concat([{ ...message, uniqueId: id }]);
      this.next(newValue);
    }
  }

  delete(id) {
    const index = this.value.findIndex((el) => el.uniqueId === id);
    if (index < 0) return;
    const newValue = [
      ...this.value.slice(0, index),
      ...this.value.slice(index + 1),
    ];
    this.next(newValue);
  }

  getMessage(id) {
    return this.value.find((el) => el.uniqueId === id);
  }

  getMessages() {
    return this.$value;
  }

  update(state, cb) {
    this.next(state);
    if (cb && typeof cb === 'function') cb();
  }

  updateMessage(id, props) {
    const messageIndex = this.value.findIndex((el) => el.uniqueId === id);
    if (messageIndex < 0) return;
    const newValue = [
      ...this.value.slice(0, messageIndex),
      {
        ...this.value[messageIndex],
        props: { ...this.value[messageIndex].props, ...props },
      },
      ...this.value.slice(messageIndex + 1),
    ];
    this.next(newValue);
  }

  setLoading(isLoading) {
    if (this.isLoading === isLoading) return;

    this.isLoading = isLoading;
    if (isLoading) {
      this.next(this.value.concat([
        {
          type: 'loading',
          uniqueId: MessagesStore.isLoadingId,
          props: {},
          sender: 'bot',
        },
      ]));
    } else {
      this.delete(MessagesStore.isLoadingId);
    }
  }
}
