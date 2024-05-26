const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors')
const bodyParser = require("body-parser")

//load env
require('dotenv').config();
const CLIENT = process.env.CLIENT_URL;
const PORT = process.env.PORT;

const app = express();
app.use(cors({ origin: CLIENT }));
app.use(bodyParser.json())

const server = http.createServer(app);
const io = socketIo(server, {path:"/ws"});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

io.engine.on("connection_error", (err) => {
  console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
});

app.post('/data-from-flask', (req, res) => {
  const scrapedData = req.body; // Assuming Flask sends JSON data
  // console.log("request body :", req);
  io.emit('search_result', scrapedData); // Emitting 'data' event to all connected clients
  res.status(200).json({ message: 'Data received and sent to clients' });
});

app.get('/express-test', (req, res) => {
  res.send('Hello World ' + process.env.MANDONG_TEST);
});


server.listen(PORT, () => {
  console.log(`Socket.io server listening on port ${server.address().address}:${PORT}`);
});
