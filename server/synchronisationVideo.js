function gererSynchronisationVideo(io, socket, gestionnaire) {

    socket.on("pause", () => {

        const code = socket.data.code;

     
        const salon = gestionnaire.trouverSalon(code);

      
        if (!salon || !salon.membres.some(m => m.id === socket.id)) {
            return;
        }

        if (salon.etatLecture === null) {
            return;
        }

        salon.etatLecture.pause();

        io.to(code).emit("maj_lecture", {
            enLecture: false,
            positionSecondes: salon.etatLecture.positionActuelle()
        });

    });

    socket.on("lecture", () => {


    const code = socket.data.code;
    const salon = gestionnaire.trouverSalon(code);


    if (!salon || !salon.membres.some(m => m.id === socket.id)) {
        return;
    }


    if (salon.etatLecture === null) {
        return;
    }

    salon.etatLecture.demarrer();

    io.to(code).emit("maj_lecture", {
        enLecture: true,
        positionSecondes: salon.etatLecture.positionActuelle()
    });

});

socket.on("changer_position", (secondes) => {

    // Vérifier que la position reçue est valide
    if (typeof secondes !== "number" ||
        !Number.isFinite(secondes) ||
        secondes < 0) {
        return;
    }

    // Récupérer le salon
    const code = socket.data.code;
    const salon = gestionnaire.trouverSalon(code);

    // Vérifier que l'utilisateur appartient au salon
    if (!salon || !salon.membres.some(m => m.id === socket.id)) {
        return;
    }

    // Vérifier qu'un état vidéo existe
    if (salon.etatLecture === null) {
        return;
    }

    // Modifier la position côté serveur
    salon.etatLecture.definirPosition(secondes);

    // Envoyer la nouvelle position aux participants
    io.to(code).emit("maj_lecture", {
        enLecture: salon.etatLecture.enLecture,
        positionSecondes: salon.etatLecture.positionActuelle()
    });

});

}

module.exports = gererSynchronisationVideo;