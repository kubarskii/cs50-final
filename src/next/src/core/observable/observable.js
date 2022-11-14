/**
 * Simple observable
 * */
export default class Observable {
  subscriptions = [];

  $value;

  constructor(value) {
    this.$value = value;
  }

  get value() {
    return this.$value;
  }

  set value(v) {
    this.$value = v;
  }

  next(value) {
    this.subscriptions.forEach((fn) => {
      fn(value);
    });
    this.$value = value;
  }

  /**
   * Adds new subscription to value change
   * @return unsubscribe function, to remove subscription
   * */
  subscribe(fn) {
    const len = this.subscriptions.push(fn);
    const index = len - 1;
    return () => {
      this.subscriptions.splice(index, 1);
    };
  }
}
