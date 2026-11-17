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
    this.gestionnaire = new GestionnaireSalons();
    this.envoisRecents = new Map();
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

      // Événement 1 : créer un salon
      socket.on('creerSalon', (donnees) => {
        try {
          const salon = this.gestionnaire.creerSalon(socket.id, donnees?.pseudo);
          socket.join(salon.code);        // le navigateur entre dans le groupe du salon
          socket.data.code = salon.code;  // on retient dans quel salon il est
          socket.emit('salon', { code: salon.code, lien: salon.lien });
          this.ecrireJournal(`salon ${salon.code} créé par ${donnees.pseudo}`);
        } catch (e) {
          socket.emit('erreur', e.message);  // ex : PSEUDO_INVALIDE
        }
      });

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
