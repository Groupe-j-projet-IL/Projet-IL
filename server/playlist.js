class VideoYouTube {
  constructor(url) {
    this.url = url;
    this.idYouTube = this.extraireId(url);
  }

  // Trouve l'identifiant YouTube (11 caractères) dans le lien, ou renvoie null
  extraireId(url) {
    let adresse;
    try {
      adresse = new URL(url);
    } catch (erreur) {
      return null; // ce n'est pas un lien
    }

    let id = null;
    if (adresse.hostname === "www.youtube.com" || adresse.hostname === "youtube.com") {
      id = adresse.searchParams.get("v");   // https://www.youtube.com/watch?v=ID
    } else if (adresse.hostname === "youtu.be") {
      id = adresse.pathname.slice(1);       // https://youtu.be/ID
    }

    if (id !== null && /^[A-Za-z0-9_-]{11}$/.test(id)) {
      return id;
    }
    return null;
  }

  estValide() {
    return this.idYouTube !== null;
  }
}

class Playlist {
  constructor() {
    this.videos = [];       // liste ordonnée de VideoYouTube
    this.indexCourant = 0;  // position de la vidéo en cours dans la liste
  }

  // UC8 : tout utilisateur ajoute une vidéo à la fin
  ajouter(v) {
    this.videos.push(v);
  }

  // UC9 : le créateur supprime la vidéo n° index
  supprimer(index) {
    if (index < 0 || index >= this.videos.length) {
      return;
    }
    this.videos.splice(index, 1);
    if (index < this.indexCourant) {
      this.indexCourant--;   // la vidéo en cours a reculé d'une place
    }
  }

  // UC9 : le créateur déplace la vidéo n° debut à la place n° fin
  deplacer(debut, fin) {
    if (debut < 0 || debut >= this.videos.length || fin < 0 || fin >= this.videos.length) {
      return;
    }
    const enCours = this.videos[this.indexCourant];
    const [video] = this.videos.splice(debut, 1);
    this.videos.splice(fin, 0, video);
    this.indexCourant = this.videos.indexOf(enCours);  // on retrouve la vidéo en cours
  }

  // UC8 : à la fin d'une vidéo, on passe à la suivante (null s'il n'y en a plus)
  videoSuivante() {
    if (this.indexCourant + 1 >= this.videos.length) {
      return null;
    }
    this.indexCourant++;
    return this.videos[this.indexCourant];
  }
}

module.exports = { VideoYouTube, Playlist };