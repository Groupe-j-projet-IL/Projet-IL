
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const configurerChat = require("./chat");

const app = express();
const serveur = http.createServer(app);
const io = new Server(serveur);

app.use(express.static(path.join(__dirname, "../public")));

io.on("connection", (socket) => {
  console.log("Utilisateur connecté :", socket.id);

  // Salon temporaire pour tester le chat
  socket.on("rejoindre_test", (pseudo) => {
    if (typeof pseudo !== "string" ||
        pseudo.trim().length < 2 ||
        pseudo.trim().length > 20) {
      socket.emit("erreur", "Pseudonyme invalide");
      return;
    }

    socket.join("TEST01");
    socket.data.codeSalon = "TEST01";
    socket.data.pseudo = pseudo.trim();

    socket.emit("salon_rejoint", "TEST01");
  });

  // Activer les événements du chat
  configurerChat(io, socket);

  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté :", socket.id);
  });
});

serveur.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000");
});
