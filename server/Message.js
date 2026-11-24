class Message {
  constructor(auteur, texte, type = 'CHAT') {
    this.auteur = auteur;
    this.texte = texte;
    this.heure = new Date().toISOString();
    this.type = type;
  }
}

module.exports = Message;
