
const gererSynchronisationVideo = require("./synchronisationVideo");

// TEST 1 : Un utilisateur extérieur ne peut pas mettre en pause
test("Un utilisateur hors du salon ne peut pas mettre en pause", () => {
    const salon = {
        membres: [{ id: "utilisateur1" }],
        etatLecture: {
            pause: jest.fn()
        }
    };

    const gestionnaire = {
        trouverSalon: jest.fn().mockReturnValue(salon)
    };

    const io = {
        to: jest.fn()
    };

    const socket = {
        id: "intrus",
        data: { code: "ABC123" },
        on: jest.fn()
    };

    gererSynchronisationVideo(io, socket, gestionnaire);

    const appelPause = socket.on.mock.calls.find(
        appel => appel[0] === "pause"
    );

    appelPause[1]();

    expect(salon.etatLecture.pause).not.toHaveBeenCalled();
    expect(io.to).not.toHaveBeenCalled();
});

// TEST 2 : Un membre peut mettre en pause
test("Un membre du salon peut mettre la vidéo en pause", () => {
    const etatLecture = {
        pause: jest.fn(),
        positionActuelle: jest.fn().mockReturnValue(120)
    };

    const salon = {
        membres: [{ id: "amnay" }],
        etatLecture: etatLecture
    };

    const gestionnaire = {
        trouverSalon: jest.fn().mockReturnValue(salon)
    };

    const emit = jest.fn();

    const io = {
        to: jest.fn().mockReturnValue({ emit })
    };

    const socket = {
        id: "amnay",
        data: { code: "ABC123" },
        on: jest.fn()
    };

    gererSynchronisationVideo(io, socket, gestionnaire);

    const appelPause = socket.on.mock.calls.find(
        appel => appel[0] === "pause"
    );

    appelPause[1]();

    expect(etatLecture.pause).toHaveBeenCalledTimes(1);
    expect(io.to).toHaveBeenCalledWith("ABC123");

    expect(emit).toHaveBeenCalledWith("maj_lecture", {
        enLecture: false,
        positionSecondes: 120
    });
});

// TEST 3 : Un membre peut démarrer la vidéo
test("Un membre du salon peut démarrer la vidéo", () => {
    const etatLecture = {
        demarrer: jest.fn(),
        positionActuelle: jest.fn().mockReturnValue(50)
    };

    const salon = {
        membres: [{ id: "amnay" }],
        etatLecture: etatLecture
    };

    const gestionnaire = {
        trouverSalon: jest.fn().mockReturnValue(salon)
    };

    const emit = jest.fn();

    const io = {
        to: jest.fn().mockReturnValue({ emit })
    };

    const socket = {
        id: "amnay",
        data: { code: "ABC123" },
        on: jest.fn()
    };

    gererSynchronisationVideo(io, socket, gestionnaire);

    const appelLecture = socket.on.mock.calls.find(
        appel => appel[0] === "lecture"
    );

    appelLecture[1]();

    expect(etatLecture.demarrer).toHaveBeenCalledTimes(1);
    expect(io.to).toHaveBeenCalledWith("ABC123");

    expect(emit).toHaveBeenCalledWith("maj_lecture", {
        enLecture: true,
        positionSecondes: 50
    });
});
