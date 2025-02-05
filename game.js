class WalkingSimulator {
    constructor() {
        this.speed = 0;
        this.verticalPosition = 0;
        this.characterVerticalPosition = 0;
        this.companionVerticalPosition = 0;
        this.maxSpeed = 5;
        this.acceleration = 0.2;
        this.deceleration = 0.1;
        this.horizontalPosition = 0;
        this.companionHorizontalOffset = 50; 
        this.maxHorizontalPosition = window.innerWidth / 4;  
        this.maxCharacterVerticalRange = 200; 
        
        this.streetHeight = window.innerHeight;
        this.maxStreets = 3; 
        this.character = document.getElementById('character');
        this.companion = document.getElementById('companion');
        this.streetContainer = document.getElementById('street-container');
        
        this.createInitialStreets();
        this.streets = document.querySelectorAll('.street');
        this.gameContainer = document.getElementById('game-container');
        
        this.keys = {
            w: false,
            s: false,
            a: false,
            d: false,
            arrowup: false,
            arrowdown: false
        };
        this.characterHead = document.querySelector('#character .character-head');
        this.companionHead = document.querySelector('#companion .character-head');
        this.setupControls();
    }

    createInitialStreets() {
        for (let i = 0; i < this.maxStreets; i++) {
            const streetElement = document.createElement('div');
            streetElement.classList.add('street');
            streetElement.innerHTML = `
                <div id="road">
                    <div id="road-lines"></div>
                </div>
            `;
            
            streetElement.style.transform = `translateY(${i * this.streetHeight * -1}px)`;
            
            this.streetContainer.appendChild(streetElement);
        }
    }

    setupControls() {
        window.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'w':
                    this.keys.w = true;
                    break;
                case 's':
                    this.keys.s = true;
                    break;
                case 'a':
                    this.keys.a = true;
                    break;
                case 'd':
                    this.keys.d = true;
                    break;
                case 'arrowup':
                    this.keys.arrowup = true;
                    break;
                case 'arrowdown':
                    this.keys.arrowdown = true;
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch(e.key.toLowerCase()) {
                case 'w':
                    this.keys.w = false;
                    break;
                case 's':
                    this.keys.s = false;
                    break;
                case 'a':
                    this.keys.a = false;
                    break;
                case 'd':
                    this.keys.d = false;
                    break;
                case 'arrowup':
                    this.keys.arrowup = false;
                    break;
                case 'arrowdown':
                    this.keys.arrowdown = false;
                    break;
            }
        });

        this.gameLoop();
    }

    gameLoop() {
        this.processMovement();
        this.animate();
        requestAnimationFrame(() => this.gameLoop());
    }

    processMovement() {
        if (this.keys.w) {
            this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
            this.updateStreetPositions(this.speed);
        } else if (this.keys.s) {
            this.speed = Math.max(this.speed - this.acceleration, -this.maxSpeed);
            this.updateStreetPositions(this.speed);
        } else {
            this.speed = this.speed > 0 
                ? Math.max(this.speed - this.deceleration, 0)
                : Math.min(this.speed + this.deceleration, 0);
        }

        if (this.keys.a) {
            this.horizontalPosition = Math.max(this.horizontalPosition - 5, -this.maxHorizontalPosition);
        }
        if (this.keys.d) {
            this.horizontalPosition = Math.min(this.horizontalPosition + 5, this.maxHorizontalPosition);
        }

        if (this.keys.arrowup) {
            this.characterVerticalPosition = Math.min(
                this.characterVerticalPosition + 5, 
                this.maxCharacterVerticalRange
            );
            this.companionVerticalPosition = this.characterVerticalPosition;
        }
        if (this.keys.arrowdown) {
            this.characterVerticalPosition = Math.max(
                this.characterVerticalPosition - 5, 
                -this.maxCharacterVerticalRange
            );
            this.companionVerticalPosition = this.characterVerticalPosition;
        }

        this.updateCharacterPosition();
    }

    updateStreetPositions(speed) {
        this.streets.forEach((street, index) => {
            let currentTransform = street.style.transform || 'translateY(0px)';
            let currentY = parseFloat(currentTransform.replace('translateY(', '').replace('px)', '')) || 0;
            
            let newY = currentY + speed;
            
            if (speed > 0 && newY >= this.streetHeight) {
                newY = ((this.maxStreets - 1) * this.streetHeight * -1) + (newY - this.streetHeight);
            } else if (speed < 0 && newY <= -this.streetHeight * (this.maxStreets - 1)) {
                newY = newY + (this.streetHeight * this.maxStreets);
            }
            
            street.style.transform = `translateY(${newY}px)`;
        });
    }

    updateCharacterPosition() {
        this.character.style.transform = `
            translateX(calc(-50% + ${this.horizontalPosition}px)) 
            translateY(${-this.characterVerticalPosition}px)
        `;

        this.companion.style.transform = `
            translateX(calc(-50% + ${this.horizontalPosition + this.companionHorizontalOffset}px)) 
            translateY(${-this.companionVerticalPosition}px)
        `;
    }

    animate() {
        const characterSway = Math.sin(Date.now() * 0.01) * (Math.abs(this.speed) * 0.5);
        this.character.style.transform += ` rotate(${characterSway * 0.5}deg)`;
        this.characterHead.style.transform = `translateX(-50%) rotate(${-characterSway * 0.5}deg)`;

        const companionSway = Math.sin(Date.now() * 0.015) * (Math.abs(this.speed) * 0.4);
        this.companion.style.transform += ` rotate(${companionSway * 0.4}deg)`;
        this.companionHead.style.transform = `translateX(-50%) rotate(${-companionSway * 0.4}deg)`;
    }
}

window.addEventListener('load', () => {
    new WalkingSimulator();
});
