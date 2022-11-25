export default function queryParser(qp) {
  return qp
    .split('&')
    .map((el) => el.split('='))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}
