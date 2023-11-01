const spaceship = document.getElementById('spaceship');
const bullet = document.getElementById('bullet');
const scoreDisplay = document.getElementById('score');
let isBulletFired = false;
let score = 0;
let enemies = [];

const spaceshipSpeed = 20;
let spaceshipPosition = window.innerWidth / 2;
spaceship.style.left = spaceshipPosition + 'px';

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    if (event.key === 'ArrowLeft') {
        moveSpaceship(-spaceshipSpeed);
    } else if (event.key === 'ArrowRight') {
        moveSpaceship(spaceshipSpeed);
    } else if (event.key === ' ') {
        fireBullet();
    }
}

function moveSpaceship(offset) {
    spaceshipPosition += offset;

    spaceshipPosition = Math.max(0, Math.min(window.innerWidth - spaceship.offsetWidth, spaceshipPosition));

    spaceship.style.left = spaceshipPosition + 'px';
}

function fireBullet() {
    if (!isBulletFired) {
        isBulletFired = true;
        bullet.style.display = 'block';

        const bulletLeft = spaceshipPosition + spaceship.offsetWidth / 2 - bullet.offsetWidth / 2;
        bullet.style.left = bulletLeft + 'px';
        bullet.style.top = spaceship.offsetTop + 'px';

        let bulletTop = spaceship.offsetTop;

        const bulletMoveInterval = setInterval(() => {
            bullet.style.top = bulletTop + 'px';
            bulletTop -= 10;

            if (bulletTop <= 0) {
                clearInterval(bulletMoveInterval);
                bullet.style.display = 'none';
                isBulletFired = false;
            }

            for (let i = enemies.length - 1; i >= 0; i--) {
                if (checkCollision(bullet, enemies[i].element)) {
                    clearInterval(bulletMoveInterval);
                    bullet.style.display = 'none';
                    isBulletFired = false;
                    score++;
                    scoreDisplay.innerHTML = 'Score: ' + score;
                    removeEnemy(i);
                    break; 
                }
            }
        }, 16);
    }
}

function checkCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}

function moveEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.element.style.top = enemy.position + 'px';
        enemy.position += enemy.speed;

        if (enemy.position >= window.innerHeight) {
            removeEnemy(i);
        }

        if (checkCollision(spaceship, enemy.element)) {
            gameOver();
            return;
        }
    }
}

function spawnEnemy() {
    const newEnemy = document.createElement('div');
    newEnemy.className = 'enemy';
    newEnemy.style.left = getRandomPosition() + 'px';
    newEnemy.style.top = '20px';
    document.body.appendChild(newEnemy);

    const enemy = {
        element: newEnemy,
        position: 20,
        speed: Math.random() * 5 + 2
    };

    enemies.push(enemy);
}

function getRandomPosition() {
    return Math.random() * (window.innerWidth - 50);
}

function removeEnemy(index) {
    document.body.removeChild(enemies[index].element);
    enemies.splice(index, 1);
}

function gameOver() {
    alert('Game Over! Your Score: ' + score);
    location.reload();
}

setInterval(moveEnemies, 16);
setInterval(spawnEnemy, 2000);
