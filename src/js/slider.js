document.addEventListener("DOMContentLoaded", function () {
  let buttons = [];
  let textElements = [];
  let carouselItems = [...document.querySelectorAll(".slider3d_wrap > div")];
  let imageElements = document.querySelectorAll("div[id^='img']");

  for (let i = 1; i <= 8; i++) {
    buttons.push(document.getElementById("btn" + i));
    textElements.push(document.getElementById("text" + i));
  }

  let rotationAngle = 0;
  const rotationSpeed = 0.05;
  let isDragging = false;
  let previousX;
  let slideWidth;

  let rotationDirection = 1;
  let previousAngle = rotationAngle;

  const maxSpeed = 4.3 * 1.5;
  const increasedMaxSpeed = maxSpeed * 1.5;
  const speedFactor = 1;

  let previousTime = Date.now();

  function nav(d) {
    rotationAngle += (360 / carouselItems.length) * d;
    document.querySelector(
      ".slider3d_wrap"
    ).style.transform = `translateZ(-401.363px) rotateY(${rotationAngle}deg)`;
  }

  const onMouseDown = (e) => {
    isDragging = true;
    previousX = e.clientX;
    previousTime = Date.now();
    e.preventDefault();

    const wrap = document.querySelector(".slider3d");
    wrap.style.transition = "transform 0.2s ease, scale 0.2s ease";
    wrap.style.transform = "scale(0.95)";
  };

  const onMouseMove = (e) => {
    if (isDragging) {
      const diff = e.clientX - previousX;
      const slideOffset = diff / slideWidth;
      rotationDirection = slideOffset > 0 ? 1 : -1;

      let speed = slideOffset * (360 / carouselItems.length) * speedFactor;
      speed = Math.min(Math.max(speed, -increasedMaxSpeed), increasedMaxSpeed);
      rotationAngle += speed;

      document.querySelector(
        ".slider3d_wrap"
      ).style.transform = `translateZ(-401.363px) rotateY(${rotationAngle}deg)`;

      const currentTime = Date.now();
      currentSpeed = Math.abs(
        (e.clientX - previousX) / (currentTime - previousTime)
      );

      previousTime = currentTime;
      previousX = e.clientX;
      updateSlideStyles();
    }
  };

  const onMouseUpOrLeave = () => {
    isDragging = false;
    updateSlideStyles();
    const wrap = document.querySelector(".slider3d");
    wrap.style.transition = "transform 0.3s ease-out, scale 0.3s ease";
    wrap.style.transform = "scale(1)";
  };

  function handleClick(index) {
    textElements.forEach((textElement) => {
      textElement.classList.remove("slide-in");
      textElement.classList.add("slide-left");
      textElement.style.opacity = "0.5";
      textElement.style.display = "none";
    });

    textElements[index].classList.remove("slide-left");
    textElements[index].classList.add("slide-in");
    textElements[index].style.display = "block";
    textElements[index].style.opacity = "1";

    let angle = (360 / carouselItems.length) * index;
    rotationAngle = angle;

    rotationDirection = rotationAngle > previousAngle ? 1 : -1;
    previousAngle = rotationAngle;

    document.querySelector(
      ".slider3d_wrap"
    ).style.transform = `translateZ(-401.363px) rotateY(${rotationAngle}deg)`;

    buttons.forEach((btn) => btn.classList.remove("active"));
    buttons[index].classList.add("active");
    updateSlideStyles();
    highlightImage(index);
  }

  function highlightImage(index) {
    const activeText = textElements[index].textContent.toLowerCase();

    imageElements.forEach((imgElement) => {
      imgElement.classList.remove("highlight");
    });

    imageElements.forEach((imgElement) => {
      const imgId = imgElement.id;
      const imgName = imgId.replace("img", "").toLowerCase();

      if (activeText.includes(imgName)) {
        imgElement.classList.add("highlight");
      }
    });
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", function () {
      handleClick(index);
    });
  });

  handleClick(0);

  function updateSlideStyles() {
    const wrap = document.querySelector(".slider3d_wrap");
    const all = wrap.children.length;
    const step = 360 / all;

    const centerAngle = rotationAngle % 360;

    for (let i = 0; i < all; i++) {
      const angle = (i * step + centerAngle) % 360;
      const angleDiff =
        Math.abs(angle) > 180 ? 360 - Math.abs(angle) : Math.abs(angle);

      const slide = wrap.children[i];
      const cuboidSide = slide.querySelector(".cuboid__side:nth-of-type(5)");

      const imageOpacity = Math.max(1 - angleDiff / 180, 0.4);

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
    const myR = (width / (2 * Math.tan(Math.PI / all))) * 0.95;
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
