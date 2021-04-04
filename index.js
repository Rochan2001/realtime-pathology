const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const options = {
  cors: true,
};
const io = require("socket.io")(httpServer, options);

const port = 8000;

httpServer.listen(port, function () {
  console.log("Listening on port " + port);
});

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Socket connection made " + socket.id);

  socket.on("message", function (data) {
    data.type = "event";
    data.socketId = socket.id;
    io.sockets.emit("message", data);
  });

  socket.on("chat", function (data) {
    io.sockets.emit("chat", data);
  });
});
