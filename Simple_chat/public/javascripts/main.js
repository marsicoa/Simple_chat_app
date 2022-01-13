let socket = io.connect();

const input = document.getElementById("chat-input");
const email = document.getElementById("email-input");

//--> recibo del server
socket.on("mensajes", function (msjs) {
  document.getElementById("msjs").innerHTML = msjs
    .map(
      (msj) =>
        `<span style="color:blue"><b>${msj.email}</b></span> <span style="color:red">[ ${msj.fyh}]</span>: <span style="font-family:verdana; color:black">${msj.mensaje}</span>`
    )
    .join("<br>");
});
//<--

//--> envio al server
document.getElementById("chat-btn").addEventListener("click", () => {
  const fyh = new Date().toLocaleString();
  email.value
    ? socket.emit("mensaje", { msj: input.value, email: email.value, fyh: fyh })
    : alert("Debe ingresar su email");
});
//<--
