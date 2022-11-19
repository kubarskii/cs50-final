export default class Semaphore {
  runningRequests = 0;

  requests = [];

  constructor(maxConcurrentRequest = 1) {
    this.maxConcurrentRequests = maxConcurrentRequest;
  }

  execute(fn, ...args) {
    return new Promise((resolve, reject) => {
      this.requests.push({
        resolve,
        reject,
        fn,
        args,
      });
      this.next();
    });
  }

  next() {
    if (!this.requests.length) return;

    if (this.runningRequests < this.maxConcurrentRequests) {
      const {
        resolve,
        reject,
        fn,
        args,
      } = this.requests.shift();
      const req = fn(...args);

      this.runningRequests += 1;

      req.then((res) => {
        resolve(res);
      })
        .catch((err) => reject(err))
        .finally(() => {
          this.runningRequests -= 1;
          this.next();
        });
    }
  }
}
