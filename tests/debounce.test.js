import debounce from '@me/next-ui/src/utils/debounce';

jest.useFakeTimers();
describe('debounce tests', () => {
  it('should execute the function once', () => {
    const handler = jest.fn();
    const deb = debounce(handler, 200);
    deb();
    setTimeout(() => {
      deb();
    }, 100);
    jest.runAllTimers();
    expect(handler).toBeCalledTimes(1);
  });
});
