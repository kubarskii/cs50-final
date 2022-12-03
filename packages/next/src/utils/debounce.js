/**
 * prototype storage
 * */
function Debounce() {
}

export default function debounce(handler, timeout) {
  const fn = (...args) => {
    console.log(fn.timer);
    if (fn.timer) {
      clearTimeout(fn.timer);
    }
    fn.timer = setTimeout(() => {
      fn.handler(...args);
    }, fn.timeout);
    console.log(fn.timer);
    return fn;
  };

  const props = {
    timeout,
    handler,
    timer: null,
    clear() {
      clearTimeout(this.timer);
    },
  };

  Object.setPrototypeOf(fn, Debounce.prototype);
  return Object.assign(fn, props);
}
