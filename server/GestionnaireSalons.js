const crypto = require('crypto');
const Salon = require('./Salon');
const Utilisateur = require('./Utilisateur');

// Sans 0/O ni 1/I : on évite les confusions quand quelqu'un recopie le code
const CARACTERES = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const LONGUEUR_CODE = 6;

class GestionnaireSalons {
  constructor() {
    this.salons = new Map();  // code → Salon
  }

  genererCode() {
    let code;
    do {
      code = '';
      for (let i = 0; i < LONGUEUR_CODE; i++) {
        code += CARACTERES[crypto.randomInt(CARACTERES.length)];
      }
    } while (this.salons.has(code));  // on recommence si le code existe déjà
    return code;
  }

  creerSalon(idUtilisateur, pseudo) {
    const createur = new Utilisateur(idUtilisateur, pseudo);
    const code = this.genererCode();
    const salon = new Salon(code, `/?code=${code}`, createur);
    return salon;
  }

  trouverSalon(code) {
    const codeNettoye = String(code ?? '').trim().toUpperCase();
    return this.salons.get(codeNettoye) ?? null;
  }

  rejoindreSalon(code, idUtilisateur, pseudo) {
    const salon = this.trouverSalon(code);
    if (!salon) {
      throw new Error('SALON_INTROUVABLE');
    }
    salon.ajouterUtilisateur(new Utilisateur(idUtilisateur, pseudo));
    return salon;
  }

  quitterSalon(code, idUtilisateur) {
    const salon = this.trouverSalon(code);
    if (!salon) {
      return null;
    }
    const parti = salon.retirerUtilisateur(idUtilisateur);
    if (salon.estVide()) {
      this.salons.delete(salon.code);  // règle : tout est supprimé quand le salon est vide
    }
    return parti;
  }
}

module.exports = GestionnaireSalons;
