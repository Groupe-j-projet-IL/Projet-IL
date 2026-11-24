class EtatLecture {
    constructor() {
        this.positionSecondes = 0;
        this.enLecture = false;
        this.derniereMaj = Date.now();
    }

    pause() {
    this.positionSecondes = this.positionActuelle();
    this.enLecture = false;
    this.derniereMaj = Date.now();
    }

    positionActuelle() {
    if (this.enLecture === false) {
        return this.positionSecondes;
    }

    const tempsEcoule = (Date.now() - this.derniereMaj) / 1000;

    return this.positionSecondes + tempsEcoule;
    }


    demarrer() {
    if (this.enLecture === false) {
        this.enLecture = true;
        this.derniereMaj = Date.now();
    }
    }

    definirPosition(secondes) {
    if (secondes >= 0) {
        this.positionSecondes = secondes;
        this.derniereMaj = Date.now();
    }
    }
}
module.exports = EtatLecture;