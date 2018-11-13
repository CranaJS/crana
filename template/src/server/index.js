const http = require('http');
const port = 5000;

const { helloWorld } = require('@shared/util');

const requestHandler = (request, response) => {
  console.log(request.url);
  response.end('Server started on port 5000', helloWorld('Server'));
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`Server is listening on port ${port}`);
});
