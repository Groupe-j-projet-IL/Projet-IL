const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const GestionnaireSalons = require('./GestionnaireSalons');

const LIMITE_ENVOIS = 5;   // max 5 envois...
const FENETRE_MS = 2000;   // ...en 2 secondes
const DOSSIER_PUBLIC = path.join(__dirname, '..', 'public');

class Serveur {
  constructor(port = 3000) {
    this.port = port;
    this.gestionnaire = new GestionnaireSalons();  // c'est lui qui gère les salons
    this.envoisRecents = new Map();                // anti-spam : id -> dates des envois
    this.http = null;
    this.io = null;
  }

  demarrer() {
    const app = express();
    app.use(express.static(DOSSIER_PUBLIC));
    app.get('/salon/:code', (req, res) => {
      res.sendFile(path.join(DOSSIER_PUBLIC, 'index.html'));
    });

    this.http = http.createServer(app);
    this.io = new Server(this.http);

    this.io.on('connection', (socket) => {
      this.ecrireJournal(`connexion ${socket.id}`);
      socket.on('disconnect', () => this.ecrireJournal(`déconnexion ${socket.id}`));
    });

    this.http.listen(this.port, () => {
      this.ecrireJournal(`serveur lancé sur http://localhost:${this.port}`);
    });
  }

  arreter() {
    if (this.io) {
      this.io.close();
    }
    this.gestionnaire = new GestionnaireSalons();
    this.envoisRecents.clear();
  }

  depasseLimite(id) {
    const maintenant = new Date();
    const recents = (this.envoisRecents.get(id) ?? [])
      .filter(d => maintenant - d < FENETRE_MS);
    recents.push(maintenant);
    this.envoisRecents.set(id, recents);
    return recents.length > LIMITE_ENVOIS;
  }

  ecrireJournal(evenement) {
    console.log(`[${new Date().toISOString()}] ${evenement}`);
  }
}

module.exports = Serveur;

if (require.main === module) {
  new Serveur(Number(process.env.PORT) || 3000).demarrer();
}
