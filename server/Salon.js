const Utilisateur = require('./Utilisateur');

const MAX_MEMBRES = 10;

class Salon {
  constructor(code, lien, createur) {
    this.code = code;
    this.lien = lien;
    this.membres = [];
    this.createur = null;

  
    this.playlist = null;     
    this.etatLecture = null;  
    this.messages = [];      

   
    this.ajouterUtilisateur(createur);
  }

  estPlein() {
    return this.membres.length >= MAX_MEMBRES;
  }

  ajouterUtilisateur(u) {
    if (!(u instanceof Utilisateur) || !u.estPseudoValide()) {
      throw new Error('PSEUDO_INVALIDE');
    }
    if (this.estPlein()) {
      throw new Error('SALON_PLEIN');
    }
    if (this.membres.some(m => m.id === u.id)) {
      throw new Error('DEJA_MEMBRE');
    }
    this.membres.push(u);
    if (this.createur === null) {
      this.createur = u;
    }
  }

  retirerUtilisateur(id) {
    const index = this.membres.findIndex(m => m.id === id);
    if (index === -1) {
      return null;
    }
    const [parti] = this.membres.splice(index, 1);
    if (this.createur === parti) {
      this.createur = this.membreLePlusAncien(); 
    }
    return parti;
  }

  membreLePlusAncien() {
    if (this.membres.length === 0) {
      return null;
    }
    return this.membres.reduce((a, b) => (b.dateArrivee < a.dateArrivee ? b : a));
  }

  estVide() {
    return this.membres.length === 0;
  }
  estCreateur(id) {
    return this.createur !== null && this.createur.id === id;
  }
}

module.exports = Salon;
