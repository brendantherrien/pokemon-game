const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 575;

const offset = {
    x: -593,
    y: -396,
};

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70));
}

const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i, i + 70));
}

const boundaries = [];
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol !== 1025) return;
        boundaries.push(
            new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y,
                },
            })
        );
    });
});

const battleZones = [];
battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol !== 1025) return;
        battleZones.push(
            new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y,
                },
            })
        );
    });
});

const image = new Image();
image.src = "./img/map.png";

const playerDownImage = new Image();
playerDownImage.src = "./img/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./img/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./img/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./img/playerRight.png";

const foregroundImage = new Image();
foregroundImage.src = "./img/foregroundObjects.png";

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2 + 30,
    },
    image: playerDownImage,
    frames: { max: 4, hold: 10 },
    sprites: {
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage,
    },
});

const background = new Sprite({
    position: {
        ...offset,
    },
    image,
});

const foreground = new Sprite({
    position: {
        ...offset,
    },
    image: foregroundImage,
});

const keys = {
    w: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
};

const movables = [background, ...boundaries, ...battleZones];

const rectangularCollision = ({ rect1, rect2 }) => {
    return (
        rect1.position.x + rect1.width >= rect2.position.x &&
        rect1.position.x <= rect2.position.x + rect2.width &&
        rect1.position.y <= rect2.position.y + rect2.height &&
        rect1.position.y + rect1.height >= rect2.position.y
    );
};

const battle = {
    initiated: false,
};

const animate = () => {
    const animationId = window.requestAnimationFrame(animate);

    // Draw map and player
    background.draw();
    boundaries.forEach((boundary) => {
        boundary.draw();
    });
    battleZones.forEach((boundary) => {
        boundary.draw();
    });
    player.draw();
    // foreground.draw();

    let moving = true;
    player.animate = false;

    if (battle.initiated) return;

    if (keys.w.pressed || keys.s.pressed || keys.a.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i];
            const overlappingArea =
                (Math.min(
                    player.position.x + player.width,
                    battleZone.position.x + battleZone.width
                ) -
                    Math.max(player.position.x, battleZone.position.x)) *
                (Math.min(
                    player.position.y + player.height,
                    battleZone.position.y + battleZone.height
                ) -
                    Math.max(player.position.y, battleZone.position.y));
            if (
                rectangularCollision({
                    rect1: player,
                    rect2: battleZone,
                }) &&
                overlappingArea > (player.width * player.height) / 2 &&
                Math.random() < 0.02
            ) {
                battle.initiated = true;
                window.cancelAnimationFrame(animationId);

                gsap.to("#overlappingDiv", {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to("#overlappingDiv", {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                                animateBattle();
                                gsap.to("#overlappingDiv", {
                                    opacity: 0,
                                    duration: 0.4,
                                });
                            },
                        });
                    },
                });
                break;
            }
        }
    }

    if (keys.w.pressed && lastKey === "w") {
        player.animate = true;
        player.image = player.sprites.up;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rect1: player,
                    rect2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3,
                        },
                    },
                })
            ) {
                moving = false;
                break;
            }
        }

        if (moving) {
            movables.forEach((movable) => {
                movable.position.y += 3;
            });
        }
    } else if (keys.s.pressed && lastKey === "s") {
        player.animate = true;
        player.image = player.sprites.down;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rect1: player,
                    rect2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3,
                        },
                    },
                })
            ) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.y -= 3;
            });
        }
    } else if (keys.a.pressed && lastKey === "a") {
        player.animate = true;
        player.image = player.sprites.left;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rect1: player,
                    rect2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y,
                        },
                    },
                })
            ) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.x += 3;
            });
        }
    } else if (keys.d.pressed && lastKey === "d") {
        player.moving = true;
        player.image = player.sprites.right;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rect1: player,
                    rect2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y,
                        },
                    },
                })
            ) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.x -= 3;
            });
        }
    }
};
// animate();

const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./img/battleBackground.png";

const draggleImage = new Image();
draggleImage.src = "./img/draggleSprite.png";

const embyImage = new Image();
embyImage.src = "./img/embySprite.png";

const draggle = new Sprite({
    position: {
        x: 800,
        y: 100,
    },
    image: draggleImage,
    frames: {
        max: 4,
        hold: 30,
    },
    animate: true,
    isEnemy: true,
});

const emby = new Sprite({
    position: {
        x: 280,
        y: 325,
    },
    image: embyImage,
    frames: {
        max: 4,
        hold: 30,
    },
    animate: true,
});

const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    image: battleBackgroundImage,
});

const animateBattle = () => {
    window.requestAnimationFrame(animateBattle);
    battleBackground.draw();
    draggle.draw();
    emby.draw();
};
animateBattle();

document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
        emby.attack({
            attack: {
                name: "Tackle",
                damage: 10,
                type: "Normal",
            },
            recipient: draggle,
        });
    });
});

let lastKey = "";
window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "w":
            keys.w.pressed = true;
            lastKey = "w";
            break;
        case "s":
            keys.s.pressed = true;
            lastKey = "s";
            break;
        case "a":
            keys.a.pressed = true;
            lastKey = "a";
            break;
        case "d":
            keys.d.pressed = true;
            lastKey = "d";
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "w":
            keys.w.pressed = false;
            break;
        case "s":
            keys.s.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
        case "d":
            keys.d.pressed = false;
            break;
    }
});
