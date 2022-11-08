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

  getTyping() {
    return this.value?.typing || [];
  }

  addTyping(userName) {
    if (!userName) return;
    const typing = this.value?.typing?.slice() || [];
    typing.push(userName);
    this.next({
      ...this.value,
      typing: [...(new Set(typing))],
    });
  }

  removeAllTyping() {
    this.next({
      ...this.value,
      typing: [],
    });
  }

  removeTyping(userName) {
    if (!userName) return;
    const typing = this.value?.typing?.slice() || [];
    const newValue = typing.filter((el) => el !== userName);
    this.next({
      ...this.value,
      typing: newValue,
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

  hideInput() {
    this.next({
      ...this.value,
      inputShown: false,
    });
  }

  showInput() {
    this.next({
      ...this.value,
      inputShown: true,
    });
  }

  setCurrentRoom(roomId) {
    this.next({
      ...this.value,
      currentRoom: roomId,
    });
  }

  getCurrentRoom() {
    return this.value?.currentRoom;
  }
}
