const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const router = require("./routes/productos.js");
const fetch = require("cross-fetch");
const fs = require("fs");

const mensajes  = [];

const respMensajes = async () => {

  const listar = async () => {
      const response = await fetch("http://localhost:8080/txt/mensajes.txt", {method: "GET"});
      const res = await response.json()
      res.forEach(element => {
        mensajes.push(element)
      });
      return res
  }

  let response = await listar().then((res) => {return res})
  return response
  
}
respMensajes()

app.set("view engine", "ejs");
app.set("views", "./views");

//Router API
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

io.on("connection", (socket) => {

  console.log(`Conexión establecida - usuario: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Usuario ${socket.id} desconectado`);
  });

  //--> envio al cliente
  socket.emit("mensajes", mensajes);
  //<--

  //--> recibo del cliente
  socket.on("mensaje", async (data) => {
    mensajes.push({ email: data.email, fyh: data.fyh, mensaje: data.msj });
    await fs.promises.writeFile('./public/txt/mensajes.txt', JSON.stringify(mensajes))
    io.sockets.emit("mensajes", mensajes);
  });
  //<--

});

app.use("/", router);

//Server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));
