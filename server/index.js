const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const GestionnaireSalons = require('./GestionnaireSalons');

const configurerChat = require('./chat');
const PORT = 3000;
const DOSSIER_PUBLIC = path.join(__dirname, '..', 'public');
 
class Serveur {
  constructor(port) {
    this.port = port;
    this.gestionnaire = new GestionnaireSalons();
    this.http = null;
    this.io = null;
  }

  demarrer() {
    const app = express();
    app.use(express.static(DOSSIER_PUBLIC));
    

    this.http = http.createServer(app);
    this.io = new socketio.Server(this.http);
    this.io.on('connection', (socket) => this.gererConnexion(socket));

    this.http.listen(this.port, () => {
      this.ecrireJournal(`serveur lancé sur http://localhost:${this.port}`);
    });
  }

  arreter() {
    if (this.io) {
      this.io.close();
    }
    this.gestionnaire = new GestionnaireSalons();
  }

  

  gererConnexion(socket) {
    this.ecrireJournal(`connexion ${socket.id}`);

    socket.on('creerSalon', (donnees) => this.traiterCreerSalon(socket, donnees));
    configurerChat(this.io, socket, this.gestionnaire);
    socket.on('disconnect', () => this.ecrireJournal(`déconnexion ${socket.id}`));
  }

  traiterCreerSalon(socket, donnees) {
    try {
      const salon = this.gestionnaire.creerSalon(socket.id, donnees?.pseudo);
      socket.join(salon.code);
      socket.data.code = salon.code;
      socket.emit('salon', { code: salon.code, lien: salon.lien });
      this.ecrireJournal(`salon ${salon.code} créé par ${salon.createur.pseudo}`);
    } catch (erreur) {
      socket.emit('erreur', erreur.message);
    }
  }

  ecrireJournal(evenement) {
    console.log(`[${new Date().toISOString()}] ${evenement}`);
  }
}

module.exports = Serveur;


if (require.main === module) {
  const serveur = new Serveur(PORT);
  serveur.demarrer();
}