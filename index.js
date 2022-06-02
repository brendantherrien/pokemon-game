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

class Boundary {
    static width = 48;
    static height = 48;

    constructor({ position }) {
        this.position = position;
        this.width = Boundary.width;
        this.height = Boundary.height;
    }

    draw() {
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class Sprite {
    constructor({ image, position, velocity, frames = { max: 1 } }) {
        this.image = image;
        this.position = position;
        this.velocity = velocity;
        this.frames = frames;
    }

    draw() {
        c.drawImage(
            this.image,
            0,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        );
    }
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

const image = new Image();
image.src = "./img/map.png";

const playerImage = new Image();
playerImage.src = "./img/playerDown.png";

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2,
    },
    image: playerImage,
    frames: { max: 4 },
});

const background = new Sprite({
    position: {
        ...offset,
    },
    image,
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

const movables = [background];

const animate = () => {
    window.requestAnimationFrame(animate);

    // Draw map and player
    background.draw();
    boundaries.forEach((boundary) => {
        boundary.draw();
    });
    player.draw();

    if (keys.w.pressed && lastKey === "w") {
        movables.forEach((movable) => {
            movable.position.y += 3;
        });
    } else if (keys.s.pressed && lastKey === "s") {
        movables.forEach((movable) => {
            movable.position.y -= 3;
        });
    } else if (keys.a.pressed && lastKey === "a") {
        movables.forEach((movable) => {
            movable.position.x += 3;
        });
    } else if (keys.d.pressed && lastKey === "d") {
        movables.forEach((movable) => {
            movable.position.x -= 3;
        });
    }
};
animate();

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
