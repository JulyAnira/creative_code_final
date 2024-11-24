let inputBox;
let isHovered = false;
let animations = []; 
let pianoSounds = [], fft;
let fontSize = 24;
const FRAME_RATE = 30;
let particles = [];
let rotationAngle = 0;
let triangleX, triangleY;
let triangleSize = 60;
let inputBoxWidth, inputBoxHeight;
//2024 11 24
function preload() {
  pianoSounds = [
    loadSound("sleep.wav"),
    loadSound("soundp1.wav"),
    loadSound("soundp2.wav"),
    loadSound("soundp3.wav"),
    loadSound("soundp4.wav"),
    loadSound("soundp5.wav"),
    loadSound("soundp6.wav"),
    loadSound("soundp7.wav"),
    loadSound("soundp8.wav"),
    loadSound("soundp9.wav"),
    loadSound("soundp10.wav"),
    loadSound("soundp11.wav"),
    loadSound("soundp12.wav"),
    loadSound("soundp13.wav")
  ];
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  fft = new p5.FFT();

  inputBox = createInput();
  inputBox.position(100, height - 200);
  inputBox.size(width - 200);
  inputBox.style('text-align', 'center');
  inputBox.attribute('placeholder', 'Anything you want to say...');
  inputBox.style('background', 'transparent'); 
  inputBox.style('border', 'none');
  inputBox.style('outline', 'none'); 
  inputBox.style('font-size', fontSize + 'px'); 
  inputBox.hide();

  triangleX = width / 2;
  triangleY = height - 200;
  inputBoxWidth = width - 200;
  inputBoxHeight = 40;
}

function draw() {
  background(255);

push();
  document.body.style.filter = 'invert(100%)';
  rect(0, 0, width, height / 2);
  pop();
  push();
  rect(0, height / 2, width, height / 2);
  pop();
  
  if (isHovered) {
    inputBox.show();
    let lerpX = lerp(triangleX, triangleX - inputBoxWidth / 2, 0.2);
    let lerpY = lerp(triangleY, triangleY - inputBoxHeight / 2, 0.2);
    inputBox.position((width - inputBoxWidth) / 2, lerpY);
    
    triangleSize = lerp(triangleSize, 0, 0.2);
    rotationAngle = lerp(rotationAngle, 360, 0.2); 
  } else {
    inputBox.hide();
    triangleSize = lerp(triangleSize, 60, 0.2);
    rotationAngle = lerp(rotationAngle, 0, 0.2);  
  }

  if (inputBox.elt.style.display === 'none') {
    push();
    translate(triangleX, triangleY); 
    rotate(radians(rotationAngle));  
    let newSize = triangleSize / 2;
    fill(255);  
    stroke(0);  
    strokeWeight(2);  
    triangle(
      -newSize, -newSize,
      newSize, -newSize, 
      0, newSize         
    );
    pop();
  }

  for (let i = animations.length - 1; i >= 0; i--) {
    let anim = animations[i];
    anim.y -= 2;
    anim.opacity -= 2;
    fill(anim.color[0], anim.color[1], anim.color[2], anim.opacity);
    textSize(fontSize);
    textAlign(CENTER, CENTER);
    text(anim.text, anim.x, anim.y);

    if (anim.opacity <= 0) {
      animations.splice(i, 1);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();

    if (p.opacity <= 0) {
      particles.splice(i, 1);
    }
  }

  if (soundIsPlaying()) {
    drawFrequencyLine();
  } else {
    drawCenterLine();
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseMoved() {
  if (mouseX > triangleX - 20 && mouseX < triangleX + 20 && mouseY > triangleY - 20 && mouseY < triangleY + 20) {
    isHovered = true;
  } else {
    isHovered = false;
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    let text = inputBox.value(); 
    inputBox.value(''); 
    if (text.length > 0) {
      animations.push(createAnimation(text));
      playSound(text);
      animS.reset();
    }
  }
}

function createAnimation(text) {
  return {
    text: text,
    x: random(width * 0.2, width * 0.8), 
    y: height - 150, 
    opacity: 300, 
    color: randomColor()
  };
}

function randomColor() {
  let shade = random(0, 255);
  return [shade, shade, shade];
}

function playSound(text) {
  let soundIndex;
  if (text.includes("!") || text.includes("！")) {
    soundIndex = random([2, 8, 9, 10]); 
  } else if (text.includes("…")|| text.includes("……")) {
    soundIndex = random([0, 1, 5, 7, 13]);
  }else if (text.includes("？")|| text.includes("?")){
    soundIndex = random([3, 6, 12]);
  }else if (text.includes("/")|| text.includes("、")){
    soundIndex = random([11, 12]);
  }else if (text.includes("0")) {
    soundIndex = 0; 
  } else if (text.includes("1")) {
    soundIndex = 1; 
  } else if (text.includes("2")) {
    soundIndex = 2; 
  } else if (text.includes("3")) {
    soundIndex = 3; 
  } else if (text.includes("4")) {
    soundIndex = 4; 
  } else if (text.includes("5")) {
    soundIndex = 5; 
  } else if (text.includes("6")) {
    soundIndex = 6; 
  } else if (text.includes("7")) {
    soundIndex = 7; 
  } else if (text.includes("8")) {
    soundIndex = 8; 
  } else if (text.includes("9")) {
    soundIndex = 9; 
  } else if (text.includes("10")) {
    soundIndex = 10; 
  } else if (text.includes("11")) {
    soundIndex = 11; 
  } else if (text.includes("12")) {
    soundIndex = 12; 
  } else if (text.includes("13")) {
    soundIndex = 13; 
  } else {
    soundIndex = floor(random(0, pianoSounds.length));
  }
  if (pianoSounds[soundIndex] && pianoSounds[soundIndex].isLoaded()) {
    pianoSounds[soundIndex].play();
  }
}

function soundIsPlaying() {
  return pianoSounds.some(sound => sound.isPlaying());
}

function generateParticles(x, y) {
  let numParticles = floor(random(1, 3));  
  for (let i = 0; i < numParticles; i++) {
    let p = new Particle(x, y);
    particles.push(p);
  }
}

class Particle {
  constructor(x, y) {
    this.x = x + random(-300, 300);  
    this.y = y + random(-10, 10);  
    this.size = random(5, 9);  
    this.speedX = random(-2, 2);  
    this.speedY = random(-1, -3);  
    this.gravity = 0.2;  
    this.opacity = random(100, 200);  
    this.color = randomColor();  
    this.rotation = random(TWO_PI);  
  }

  update() {
    this.speedY += this.gravity;  
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= 7;  
  }

  display() {
    push();
    translate(this.x, this.y);  
    rotate(this.rotation);  
    noFill();  
    stroke(this.color[0], this.color[1], this.color[2], this.opacity);  
    strokeWeight(1);  
    triangle(0, -this.size, 
      -this.size * random(0.5, 1.5), this.size * random(0.5, 1.5), 
      this.size * random(0.5, 1.5), this.size * random(0.5, 1.5)   
    );
    pop();
  }
}

function drawCenterLine() {
  push();
  stroke(0);
  strokeWeight(1);
  animS.line('lcenter', FRAME_RATE * 3, width / 2, height / 2, width, height / 2);
  animS.line('lcenter2', FRAME_RATE * 3, width / 2, height / 2, 0, height / 2);
  pop();
}

function drawFrequencyLine() {
  push();
  let spectrum = fft.analyze();
  let midY = height / 2;
  let lineWidth = width / 2;
  strokeWeight(1);
  beginShape();
  let maxAmplitude = 100;
  for (let i = 0; i < lineWidth; i += 10) {
    let x = map(i, 0, lineWidth, width / 2, width);
    let x2 = map(i, 0, lineWidth, width / 2, 0);
    let freqIndex = floor(map(i, 0, lineWidth, 0, spectrum.length));
    let amplitude = map(spectrum[freqIndex], 0, 255, 0, maxAmplitude);
    let y = midY + amplitude * sin((frameCount + i) * 0.1);
    let y2 = midY + amplitude * sin((frameCount + i) * 0.1);
    vertex(x, y);
    vertex(x2, y2);
  }
  endShape();
  pop();
  generateParticles(width / 2, height / 2, "center");
}