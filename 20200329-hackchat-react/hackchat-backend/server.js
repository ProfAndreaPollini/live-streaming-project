const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", socket => {
  socket.emit("system-message", {
    sender: "system",
    content: "User connection to the chat"
  });
  console.log("new connection.");
  socket.emit("message", {
    sender: "pincopallo",
    content: "ciao a tutti"
  });
  socket.on("disconnect", () => {
    console.log("client disconnection");
  });
  socket.on("message", data => {
    console.log("MESSAGE: ", data);
    socket.broadcast.emit("message", data);
  });
});

server.listen(31337, () => {
  console.log("Server started");
});
