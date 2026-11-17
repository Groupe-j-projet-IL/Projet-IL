const path = require('path');
const http = require('http');
const crypto = require('crypto');
const express = require('express');
const { Server } = require('socket.io');
const Salon = require('./Salon');

const CARACTERES = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
const LONGUEUR_CODE = 6;
const LIMITE_ENVOIS = 5;    
const FENETRE_MS = 2000;     
const DOSSIER_PUBLIC = path.join(__dirname, '..', 'public');

class Serveur {
  constructor(port = 3000) {
    this.port = port;
    this.salons = new Map();         
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
    this.salons.clear();
    this.envoisRecents.clear();
  }

 
  creerSalon(createur) {
    const code = this.genererCode();
    const salon = new Salon(code, `/salon/${code}`, createur);  
    this.salons.set(code, salon);
    this.ecrireJournal(`salon ${code} créé par ${createur.pseudo}`);
    return salon;
  }

  trouverSalon(code) {
    const codeNettoye = String(code ?? '').trim().toUpperCase();
    return this.salons.get(codeNettoye) ?? null;
  }

  supprimerSalon(code) {
    if (this.salons.delete(code)) {
      this.ecrireJournal(`salon ${code} supprimé`);
    }
  }

  genererCode() {
    let code;
    do {
      code = '';
      for (let i = 0; i < LONGUEUR_CODE; i++) {
        code += CARACTERES[crypto.randomInt(CARACTERES.length)];
      }
    } while (this.salons.has(code));
    return code;
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
