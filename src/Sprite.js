class Sprite {
    constructor({
        image,
        position,
        velocity,
        frames = { max: 1, hold: 10 },
        sprites = [],
        animate = false,
        isEnemy = false,
    }) {
        this.image = image;
        this.position = position;
        this.velocity = velocity;
        this.frames = {
            ...frames,
            val: 0,
            elapsed: 0,
        };
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        };
        this.animate = animate;
        this.sprites = sprites;
        this.opacity = 1;
        this.health = 100;
        this.isEnemy = isEnemy;
    }

    draw() {
        c.save();
        c.globalAlpha = this.opacity;
        c.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        );
        c.restore();
        if (!this.animate) return;

        if (this.frames.max > 1) this.frames.elapsed++;
        if (this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max - 1) {
                this.frames.val++;
            } else {
                this.frames.val = 0;
            }
        }
    }

    attack({ attack, recipient }) {
        const tl = gsap.timeline();
        let movementDistance = 20;
        if (this.isEnemy) movementDistance = -20;

        tl.to(this.position, {
            x: this.position.x - this.movementDistance,
        })
            .to(this.position, {
                x: this.position.x + this.movementDistance * 2,
                duration: 0.1,
                onComplete: () => {
                    this.health -= attack.damage;
                    gsap.to("#enemyHealthBar", {
                        width: this.health + "%",
                    });

                    gsap.to(recipient.position, {
                        x: recipient.position.x + 10,
                        yoyo: true,
                        repeat: 5,
                        duration: 0.08,
                    });
                    gsap.to(recipient, {
                        opacity: 0,
                        yoyo: true,
                        repeat: 5,
                        duration: 0.08,
                    });
                },
            })
            .to(this.position, {
                x: this.position.x,
            });
    }
}
