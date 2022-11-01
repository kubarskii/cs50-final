import Observable from '../observable/observable';

export default class ChatbotControls extends Observable {
  constructor(initialState) {
    super(initialState);
  }

  setOnline() {
    this.next({
      ...this.value,
      isOnline: true,
    });
  }

  setOffline() {
    this.next({
      ...this.value,
      isOnline: false,
    });
  }

  disableInput() {
    this.next({
      ...this.value,
      inputDisabled: true,
    });
  }

  enableInput() {
    this.next({
      ...this.value,
      inputDisabled: false,
    });
  }
}
