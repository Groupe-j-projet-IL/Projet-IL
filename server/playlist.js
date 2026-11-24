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

module.exports = { VideoYouTube };