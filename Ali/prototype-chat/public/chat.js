
const socket = io();

const pseudoInput = document.getElementById("pseudo");
const messageInput = document.getElementById("message");
const messages = document.getElementById("messages");

document.getElementById("rejoindre").addEventListener("click", () => {
  socket.emit("rejoindre_test", pseudoInput.value);
});

socket.on("salon_rejoint", () => {
  document.getElementById("connexion").style.display = "none";
  document.getElementById("chat").style.display = "block";
  document.getElementById("erreur").textContent = "";
});

document.getElementById("envoyer").addEventListener("click", () => {
  socket.emit("envoyer_message", messageInput.value);
  messageInput.value = "";
});


function afficherMessage(message) {
  const element = document.createElement("li");

  element.textContent =
    message.auteur + " : " + message.texte;

  messages.appendChild(element);
}

// Afficher les nouveaux messages
socket.on("nouveau_message", (message) => {
  afficherMessage(message);
});

// Afficher l'historique quand on rejoint un salon
socket.on("historique_messages", (historique) => {
  messages.innerHTML = "";

  historique.forEach((message) => {
    afficherMessage(message);
  });
});


socket.on("erreur", (message) => {
  document.getElementById("erreur").textContent = message;
});
