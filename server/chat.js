const Message = require("./Message");

function configurerChat(io, socket, gestionnaire) {
  let envoisRecents = [];

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
    const salon = gestionnaire.trouverSalon(socket.data.code);
    const pseudo = socket.data.pseudo;

    if (!salon || !pseudo) {
      socket.emit("erreur", "Vous devez rejoindre un salon");
      return;
    }

    // Récupérer l'heure actuelle
    const maintenant = Date.now();

    // Garder uniquement les envois des 5 dernières secondes
    envoisRecents = envoisRecents.filter(
      heure => maintenant - heure < 5000
    );

    // Refuser si 5 messages ont déjà été envoyés
    if (envoisRecents.length >= 5) {
      socket.emit("erreur", "Trop de messages, attends 5 secondes");
      return;
    }

    // Enregistrer l'heure du nouvel envoi
    envoisRecents.push(maintenant);

    // Construire le message
    const message = new Message(pseudo, texte.trim());

    // Ranger le message dans l'historique du salon
    salon.messages.push(message);

    // Limiter l'historique aux 50 derniers messages
    if (salon.messages.length > 50) {
      salon.messages.shift();
    }

    // Envoyer le message aux membres du salon
    io.to(salon.code).emit("nouveau_message", message);

  });

}

module.exports = configurerChat;