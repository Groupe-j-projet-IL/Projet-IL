const PSEUDO_MIN = 2;
const PSEUDO_MAX = 20;

class Utilisateur {
  constructor(id, pseudo) {
    this.id = id;                             
    this.pseudo = String(pseudo ?? '').trim(); 
    this.dateArrivee = new Date();            
  }

  estPseudoValide() {
    return this.pseudo.length >= PSEUDO_MIN && this.pseudo.length <= PSEUDO_MAX;
  }
}

module.exports = Utilisateur;
