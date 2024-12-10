var radius = 409;
var imgWidth = 314;
var imgHeight = 298;
let currentRotationIndex = 0;
var odrag = document.getElementById("drag-container");
var ospin = document.getElementById("spin-container");
var aImg = ospin.getElementsByTagName("img");
var aEle = [...aImg];

ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

var ground = document.getElementById("ground");
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

let tX = 0,
  tY = 10;
let scrollDirection = 1;
let scrollInProgress = false;
let rotationSpeed = 0.03;
let isDragging = false;
let startX = 0;
let initialTX = tX;
let lastX = 0;
let targetTX = tX;

function applyTranform(obj) {
  obj.style.transform = "rotateX(" + -tY + "deg) rotateY(" + tX + "deg)";
}

function init() {
  var startIndex = 1;
  for (var i = 0; i < aEle.length; i++) {
    var angle = (i + startIndex) * (360 / aEle.length);
    aEle[i].style.transition = "transform 1s ease-out";
    aEle[i].style.transform =
      "rotateY(" + angle + "deg) translateZ(" + radius + "px)";
  }

  ground.style.width = radius * 3 + "px";
  ground.style.height = radius * 3 + "px";
}

function startInfiniteRotation() {
  requestAnimationFrame(function animate() {
    if (!scrollInProgress) {
      tX += rotationSpeed * scrollDirection;

      if (tX >= 360) {
        tX -= 360;
      } else if (tX < 0) {
        tX += 360;
      }

      applyTranform(odrag);
    }

    requestAnimationFrame(animate);
  });
}

function rotateCarousel(index) {
  let angle = index * (360 / aEle.length);
  aEle.forEach((ele, i) => {
    ele.style.transition = "transform 1s ease-out";
    ele.style.transform = `rotateY(${
      angle + (i * 360) / aEle.length
    }deg) translateZ(${radius}px)`;
  });

  cancelAnimationFrame(rotationInterval);
  startInfiniteRotation();
}

init();

document.querySelectorAll(".btn").forEach((button, index) => {
  button.addEventListener("click", function () {
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    document.querySelectorAll(".block").forEach((block, idx) => {
      block.style.display = idx === index ? "block" : "none";
    });

    rotateCarousel(index);
  });
});

startInfiniteRotation();
document.addEventListener("DOMContentLoaded", function () {
  let buttons = [];
  let textElements = [];
  for (let i = 1; i <= 8; i++) {
    buttons.push(document.getElementById("btn" + i));
    textElements.push(document.getElementById("text" + i));
  }

  function handleClick(index) {
    textElements.forEach((textElement, i) => {
      if (i !== index) {
        if (textElement.classList.contains("slide-in")) {
          textElement.classList.remove("slide-in");
          textElement.classList.add("slide-left");
          textElement.style.opacity = "0.5";
        }
      }
    });
    let currentTextElement = textElements[index];
    currentTextElement.classList.remove("slide-left");
    currentTextElement.classList.add("slide-in");
    currentTextElement.style.display = "block";
  }
  buttons.forEach((button, index) => {
    button.addEventListener("click", function () {
      buttons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      handleClick(index);
    });
  });

  handleClick(3);
});

odrag.addEventListener("mousedown", function (e) {
  if (e.button === 0) {
    isDragging = true;
    startX = e.clientX;
    initialTX = tX;
    lastX = e.clientX;
    e.preventDefault();
  }
});

document.addEventListener("mousemove", function (e) {
  if (isDragging) {
    let diffX = e.clientX - startX;
    let movementX = e.clientX - lastX;

    if (movementX > 0) {
      scrollDirection = 1;
    } else if (movementX < 0) {
      scrollDirection = -1;
    }

    tX = initialTX + diffX * 0.3;

    if (tX >= 360) {
      tX -= 360;
    } else if (tX < 0) {
      tX += 360;
    }

    applyTranform(odrag);
    lastX = e.clientX;
  }
});

document.addEventListener("mouseup", function () {
  isDragging = false;
  startSnapToSlide();
});

function startSnapToSlide() {
  scrollInProgress = true;

  let closestIndex = Math.round(tX / (360 / aEle.length));
  targetTX = closestIndex * (360 / aEle.length);

  let snapInterval = setInterval(function () {
    let angleDifference = targetTX - tX;
    if (Math.abs(angleDifference) < 0.5) {
      tX = targetTX;
      clearInterval(snapInterval);
      smoothSpeedIncrease();
    } else {
      tX += angleDifference * 0.1;
      applyTranform(odrag);
    }
  }, 16);
}

function smoothSpeedIncrease() {
  let targetRotationSpeed = 0.1;
  let speedIncrement = 0.001;

  function increaseSpeed() {
    if (rotationSpeed < targetRotationSpeed) {
      rotationSpeed += speedIncrement;
      requestAnimationFrame(increaseSpeed);
    } else {
      scrollInProgress = false;
    }
  }

  requestAnimationFrame(increaseSpeed);
}

ospin.addEventListener("wheel", function (e) {
  var d = e.deltaY || -e.detail;
  scrollDirection = Math.sign(d);

  let deltaRadius = d * 0.2;
  radius += deltaRadius;

  if (radius < 380) radius = 380;
  if (radius > 600) radius = 600;

  init();

  if (Math.abs(d) > 0) {
    e.preventDefault();
  }
});
