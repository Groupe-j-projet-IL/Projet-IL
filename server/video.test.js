const EtatLecture = require("./video");

test("La position initiale est égale à 0", () => {
    const video = new EtatLecture();

    expect(video.positionActuelle()).toBe(0);
});

test("Le changement de position fonctionne", () => {
    const video = new EtatLecture();

    video.definirPosition(50);

    expect(video.positionActuelle()).toBe(50);
});

test("La vidéo reste à la même position en pause", () => {
    const video = new EtatLecture();

    video.definirPosition(80);
    video.demarrer();
    video.pause();

    const position = video.positionActuelle();

    expect(video.enLecture).toBe(false);
    expect(video.positionActuelle()).toBe(position);
});

test("La position avance pendant la lecture", () => {
    jest.useFakeTimers();

    try {
        jest.setSystemTime(new Date("2026-11-17T10:00:00Z"));

        const video = new EtatLecture();

        video.definirPosition(100);
        video.demarrer();

        jest.advanceTimersByTime(12000);

        expect(video.positionActuelle()).toBe(112);
    } finally {
        jest.useRealTimers();
    }
});

test("La position ne change pas pendant une pause", () => {
    jest.useFakeTimers();

    try {
        const video = new EtatLecture();

        video.definirPosition(100);
        video.demarrer();

        // La vidéo avance pendant 5 secondes
        jest.advanceTimersByTime(5000);

        video.pause();

        // On attend encore 10 secondes
        jest.advanceTimersByTime(10000);

        expect(video.positionActuelle()).toBe(105);
    } finally {
        jest.useRealTimers();
    }
});