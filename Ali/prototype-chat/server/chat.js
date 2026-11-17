
function configurerChat(io, socket) {

  socket.on("envoyer_message", (texte) => {

    // Vérifier que le message est du texte
    if (typeof texte !== "string") {
      socket.emit("erreur", "Message invalide");
      return;
    }

    // Vérifier que le message n'est pas vide
    if (texte.trim().length === 0) {
      socket.emit("erreur", "Le message est vide");
      return;
    }

    // Vérifier la longueur du message
    if (texte.length > 500) {
      socket.emit("erreur", "Message trop long");
      return;
    }

    // Vérifier que l'utilisateur est dans un salon
    const codeSalon = socket.data.codeSalon;
    const pseudo = socket.data.pseudo;

    if (!codeSalon || !pseudo) {
      socket.emit("erreur", "Vous devez rejoindre un salon");
      return;
    }

    // Construire le message
    const message = {
      auteur: pseudo,
      texte: texte.trim(),
      heure: new Date().toISOString(),
      type: "CHAT"
    };

    // Envoyer le message aux membres du salon
    io.to(codeSalon).emit("nouveau_message", message);

  });

}

module.exports = configurerChat;
