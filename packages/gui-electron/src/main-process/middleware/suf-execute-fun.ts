export function search(body) {
  let { Response = [] } = body;
  const newResponse = Response.map((data) => {
    return Object.assign({}, data, { backgroundColor: '#FE6A00' });
  });
  return Object.assign({}, body, { Response: newResponse });
}

export function login() {

}