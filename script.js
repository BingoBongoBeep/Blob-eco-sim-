const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Blob {
  constructor(x, y, traits = {}) {
    this.x = x;
    this.y = y;
    this.energy = 100;
    this.age = 0;
    this.speed = traits.speed || Math.random() * 1.5 + 0.5;
    this.vision = traits.vision || Math.random() * 50 + 50;
    this.metabolism = traits.metabolism || Math.random() * 0.05 + 0.01;
    this.color = 'hsl(' + (Math.random() * 360) + ', 70%, 60%)';
  }

  move() {
    this.x += (Math.random() - 0.5) * this.speed * 4;
    this.y += (Math.random() - 0.5) * this.speed * 4;
    this.energy -= this.metabolism;
    this.age += 1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  reproduce() {
    if (this.energy > 200) {
      this.energy -= 50;
      return new Blob(this.x, this.y, {
        speed: this.speed + (Math.random() - 0.5) * 0.1,
        vision: this.vision + (Math.random() - 0.5) * 5,
        metabolism: this.metabolism + (Math.random() - 0.5) * 0.005
      });
    }
    return null;
  }

  isDead() {
    return this.energy <= 0 || this.age > 1000;
  }
}

class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'green';
    ctx.fill();
  }
}

let blobs = [];
let foods = [];

for (let i = 0; i < 20; i++) {
  blobs.push(new Blob(Math.random() * canvas.width, Math.random() * canvas.height));
}

function spawnFood() {
  for (let i = 0; i < 5; i++) {
    foods.push(new Food(Math.random() * canvas.width, Math.random() * canvas.height));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  spawnFood();

  blobs.forEach((blob, i) => {
    blob.move();

    // Eat food
    foods = foods.filter(food => {
      const dx = blob.x - food.x;
      const dy = blob.y - food.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 10) {
        blob.energy += 25;
        return false;
      }
      return true;
    });

    blob.draw();

    // Reproduce
    const baby = blob.reproduce();
    if (baby) blobs.push(baby);

    // Die
    if (blob.isDead()) blobs.splice(i, 1);
  });

  foods.forEach(food => food.draw());

  requestAnimationFrame(animate);
}

animate();
