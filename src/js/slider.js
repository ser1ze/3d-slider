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

    carouselItems[index].style.opacity = "1";

    let angle = (360 / carouselItems.length) * index;
    rotationAngle = angle;
    document.querySelector(
      ".slider3d_wrap"
    ).style.transform = `translateZ(-401.363px) rotateY(${rotationAngle}deg)`;

    buttons.forEach((btn) => btn.classList.remove("active"));
    buttons[index].classList.add("active");

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

  function rotateSlider() {
    rotationAngle += rotationSpeed;
    document.querySelector(
      ".slider3d_wrap"
    ).style.transform = `translateZ(-401.363px) rotateY(${rotationAngle}deg)`;

    requestAnimationFrame(rotateSlider);
  }

  rotateSlider();

  и;
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
  };

  const onMouseMove = (e) => {
    if (isDragging) {
      const diff = e.clientX - previousX;
      const slideOffset = diff / slideWidth;
      if (Math.abs(slideOffset) >= 1) {
        nav(Math.sign(slideOffset));
        previousX = e.clientX;
      }
    }
  };

  const onMouseUpOrLeave = () => {
    isDragging = false;
  };

  const slider = document.querySelector(".slider3d");
  slider.addEventListener("mousedown", onMouseDown);
  slider.addEventListener("mousemove", onMouseMove);
  slider.addEventListener("mouseup", onMouseUpOrLeave);
  slider.addEventListener("mouseleave", onMouseUpOrLeave);
});

const style = document.createElement("style");
style.innerHTML = `
  .highlight {
    border: 2px solid #ff9900;
    box-shadow: 0 0 10px rgba(255, 153, 0, 0.6);
  }
`;
document.head.appendChild(style);

let slideWidth;

function createSlider3d() {
  const slider = document.querySelector(".slider3d");
  const wrap = slider.querySelector(".slider3d_wrap");
  const all = wrap.children.length;
  const gCS = window.getComputedStyle(slider);
  const width = parseInt(gCS.width);
  slideWidth = width / all;
  const myR = (width / (2 * Math.tan(Math.PI / all))) * 0.95;
  const step = 360 / all;
  let angle = 0;

  for (let i = 0; i < all; i++) {
    const rad = (i * step * Math.PI) / 180;
    wrap.children[i].style.transform = `translate3d(${
      myR * Math.sin(rad)
    }px, 0, ${myR * Math.cos(rad)}px) rotateY(${i * step}deg)`;
  }

  function nav(d) {
    angle += step * d;
    wrap.style.transform = `translateZ(${-myR}px) rotateY(${angle}deg)`;
  }

  slider.addEventListener("mousedown", onMouseDown);
  slider.addEventListener("mousemove", onMouseMove);
  slider.addEventListener("mouseup", onMouseUpOrLeave);
  slider.addEventListener("mouseleave", onMouseUpOrLeave);

  nav(0);
}

window.addEventListener("load", createSlider3d);
