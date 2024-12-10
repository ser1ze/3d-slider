var radius = 415;
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

const fixedRotationSpeed = 0.03;

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

  setTimeout(() => {
    aEle.forEach((ele) => {});
  }, 100);

  setTimeout(() => {
    aEle.forEach((ele, i) => {
      ele.style.transition = "transform 1s ease-out";
      ele.style.transform = `rotateY(${
        (i + startIndex) * (360 / aEle.length)
      }deg) translateZ(${radius}px)`;
    });
  }, 200);
}

function applyTranform(obj) {
  obj.style.transform = "rotateX(" + -tY + "deg) rotateY(" + tX + "deg)";
}

let rotationInterval;

function startInfiniteRotation() {
  rotationInterval = requestAnimationFrame(function animate() {
    tX += fixedRotationSpeed * scrollDirection;

    if (tX >= 360) {
      tX -= 360;
    } else if (tX < 0) {
      tX += 360;
    }

    applyTranform(odrag);

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

let isDragging = false;
let startX = 0;
let initialTX = tX;
let lastX = 0;

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
});

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

setTimeout(function () {
  init();
  startInfiniteRotation();
}, 500);

startInfiniteRotation();

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
