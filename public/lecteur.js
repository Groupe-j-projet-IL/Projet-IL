class Lecteur {
    constructor() {
        this.player = null;
        this.videoId = null;
    }


chargerVideo(videoId) {
    this.videoId = videoId;

    if (this.player !== null) {
        this.player.loadVideoById(videoId);
    }
}

initialiser() {
    this.player = new YT.Player("youtube-player", {
        height: "390",
        width: "640",

        events: {
            onReady: () => {
            console.log("Lecteur YouTube prêt !");
            this.chargerVideo("M7lc1UVf-VE");
}
        }
    });
}

demarrer() {
    if (this.player !== null) {
        this.player.playVideo();
    }
}
pause() {
    if (this.player !== null) {
        this.player.pauseVideo();
    }
}

definirPosition(secondes) {
    if (this.player !== null && secondes >= 0) {
        this.player.seekTo(secondes, true);
    }
}
positionActuelle() {
    if (this.player !== null) {
        return this.player.getCurrentTime();
    }

    return 0;
}


}