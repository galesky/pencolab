const { Console } = require("console");

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const documents = {"abc":"dfg"};

const PORT = 4444;

io.on("connection", (socket) => {
  console.log("got connection")
  let previousId;
  let counter = 0;
  const safeJoin = (currentId) => {
    socket.leave(previousId);
    socket.join(currentId);
    previousId = currentId;
  };

  socket.on("editCanvas", (doc) => {
      counter += 1;
      console.log("GOT ping!! -> ", doc , counter)
      socket.to(doc.id).emit("siblingDrawAction", doc);
  })

  socket.on("getDoc", (docId) => {
    safeJoin(docId);
    socket.emit("document", documents[docId]);
  });

  socket.on("createOrJoinCanvas", (doc) => {
    safeJoin(doc.id);
    console.log(doc.id)
    io.emit("documents", Object.keys(documents));
    socket.emit("document", doc);
  });

  socket.on("editDoc", (doc) => {
    documents[doc.id] = doc;
    console.log(doc)
    // socket.to(doc.id).emit("document", doc);
    socket.emit("siblingDrawAction", doc);

  });
  console.log(Object.keys(documents))
  io.emit("documents", Object.keys(documents));
});

http.listen(PORT);
console.log('Listening on PORT: ', PORT )
