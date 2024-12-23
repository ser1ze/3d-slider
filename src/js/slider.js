document.addEventListener("DOMContentLoaded", function () {
  let buttons = [];
  let textElements = [];
  let carouselItems = [...document.querySelectorAll(".slider3d_wrap > div")];

  for (let i = 1; i <= 8; i++) {
    buttons.push(document.getElementById("btn" + i));
    textElements.push(document.getElementById("text" + i));
  }

  let rotationAngle = 65;
  const rotationSpeed = 0.06;
  let isDragging = false;
  let previousX;
  let slideWidth;
  let rotationDirection = 1;
  const maxSpeed = 4.3 * 1.5 * 1.2;
  const increasedMaxSpeed = maxSpeed * 1.5;
  const speedFactor = 1.2;

  function normalizeAngle(angle) {
    return ((angle % 360) + 360) % 360;
  }

  function getShortestAngleDiff(fromAngle, toAngle) {
    const normalizedFrom = normalizeAngle(fromAngle);
    const normalizedTo = normalizeAngle(toAngle);
    const diff = ((normalizedTo - normalizedFrom + 540) % 360) - 180;
    return diff;
  }

  function nav(d) {
    rotationAngle += (360 / carouselItems.length) * d;
    document.querySelector(
      ".slider3d_wrap"
    ).style.transform = `translateZ(-401.363px) rotateY(${rotationAngle}deg)`;
  }

  const onMouseDown = (e) => {
    isDragging = true;
    previousX = e.clientX;
    e.preventDefault();

    const wrap = document.querySelector(".slider3d");
    wrap.style.transition = "transform 0.2s ease, scale 0.2s ease";
    wrap.style.transform = "scale(0.95)";
  };

  const onMouseMove = (e) => {
    if (isDragging) {
      const diff = e.clientX - previousX;
      const threshold = 1;

      if (Math.abs(diff) > threshold) {
        const newDirection = diff > 0 ? 1 : -1;

        if (newDirection !== rotationDirection) {
          rotationDirection = newDirection;
        }

        const slideOffset = diff / slideWidth;
        let speed = slideOffset * (360 / carouselItems.length) * speedFactor;
        speed = Math.min(
          Math.max(speed, -increasedMaxSpeed),
          increasedMaxSpeed
        );

        rotationAngle += speed;

        document.querySelector(
          ".slider3d_wrap"
        ).style.transform = `translateZ(-401.363px) rotateY(${rotationAngle}deg)`;

        previousX = e.clientX;

        updateSlideStyles();
      }
    }
  };

  const onMouseUpOrLeave = () => {
    isDragging = false;

    const wrap = document.querySelector(".slider3d");
    wrap.style.transition = "transform 0.3s ease-out, scale 0.3s ease";
    wrap.style.transform = "scale(1)";
  };

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

    const targetAngle = (360 / carouselItems.length) * index;

    const angleDiff = getShortestAngleDiff(rotationAngle, targetAngle + 65);

    if (Math.abs(angleDiff) > 0.1) {
      rotationDirection = angleDiff > 0 ? 1 : -1;
      rotationAngle += angleDiff;

      document.querySelector(
        ".slider3d_wrap"
      ).style.transform = `translateZ(-401.363px) rotateY(${rotationAngle}deg)`;

      buttons.forEach((btn) => btn.classList.remove("active"));
      buttons[index].classList.add("active");
      updateSlideStyles();
    }
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", function () {
      handleClick(index);
    });
  });

  function updateSlideStyles() {
    const wrap = document.querySelector(".slider3d_wrap");
    const all = wrap.children.length;
    const step = 360 / all;

    const centerAngle = normalizeAngle(rotationAngle);

    for (let i = 0; i < all; i++) {
      const angle = normalizeAngle(i * step + centerAngle);
      const angleDiff =
        Math.abs(angle) > 180 ? 360 - Math.abs(angle) : Math.abs(angle);

      const slide = wrap.children[i];
      const cuboidSide = slide.querySelector(".cuboid__side:nth-of-type(5)");

      const imageOpacity = Math.max(0.9 - angleDiff / 180, 0.4);

      if (cuboidSide) {
        cuboidSide.style.opacity = imageOpacity;
      }
    }
  }

  function rotateSlider() {
    rotationAngle += rotationSpeed * rotationDirection;

    document.querySelector(
      ".slider3d_wrap"
    ).style.transform = `translateZ(-401.363px) rotateY(${rotationAngle}deg)`;
    updateSlideStyles();
    requestAnimationFrame(rotateSlider);
  }
  rotateSlider();

  const slider = document.querySelector(".slider3d");
  slider.addEventListener("mousedown", onMouseDown);

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUpOrLeave);
  document.addEventListener("mouseleave", onMouseUpOrLeave);

  function createSlider3d() {
    const wrap = document.querySelector(".slider3d_wrap");
    const all = wrap.children.length;
    const gCS = window.getComputedStyle(document.querySelector(".slider3d"));
    const width = parseInt(gCS.width);
    slideWidth = width / all;
    const myR = (width / (2 * Math.tan(Math.PI / all))) * 0.5;
    const step = 360 / all;

    for (let i = 0; i < all; i++) {
      const rad = (i * step * Math.PI) / 180;
      wrap.children[i].style.transform = `translate3d(${
        myR * Math.sin(rad)
      }px, 0, ${myR * Math.cos(rad)}px) rotateY(${i * step}deg)`;
    }

    nav(0);
  }

  createSlider3d();
});
