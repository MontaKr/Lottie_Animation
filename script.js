import gsap from "https://esm.sh/gsap";
import { ScrollTrigger } from "https://esm.sh/gsap/ScrollTrigger";
import Lenis from "https://esm.sh/lenis";
import lottie from "https://esm.sh/lottie-web";

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

let scrollDirection = "down";
let lastScrollY = 0;

// 스크롤을 내렸는지, 올렸는지 확인
lenis.on("scroll", ({ scroll }) => {
  scrollDirection = scroll > lastScrollY ? "down" : "up";
  lastScrollY = scroll;
});

const heroImg = document.querySelector(".hero-img");
const lottieContainer = document.querySelector(".lottie");

const lottieAnimation = lottie.loadAnimation({
  container: lottieContainer,
  path: "public/duck.json",
  renderer: "svg",
  autoplay: false,
});

const heroImgInitialWidth = heroImg.offsetWidth;
const heroImgTargetWidth = 300;

ScrollTrigger.create({
  trigger: ".about",
  start: "top bottom",
  end: "top 30%",
  scrub: 1,
  // markers: true,
  onUpdate: (self) => {
    const heroImgCurrentWidth =
      heroImgInitialWidth -
      self.progress * (heroImgInitialWidth - heroImgTargetWidth);
    gsap.set(heroImg, { width: `${heroImgCurrentWidth}px` });
  },
});

let isAnimationPaused = false;

ScrollTrigger.create({
  trigger: ".about",
  start: "top 30%",
  end: "bottom top",
  scrub: 1,
  // markers: true,
  onUpdate: (self) => {
    const lottieOffset = self.progress * window.innerHeight * 1.1;

    isAnimationPaused = self.progress > 0;

    gsap.set(lottieContainer, {
      y: -lottieOffset,
      rotateY: scrollDirection === "up" ? -180 : 0,
    });
  },
});

ScrollTrigger.create({
  trigger: ".hero",
  start: "top top",
  end: "bottom top",
  scrub: 1,
  onUpdate: (self) => {
    if (!isAnimationPaused) {
      const scrollDistance = self.scroll() - self.start;
      const pixelsPerFrame = 3;
      const frame =
        Math.floor(scrollDistance / pixelsPerFrame) %
        lottieAnimation.totalFrames;
      lottieAnimation.goToAndStop(frame, true);
    }

    gsap.set(lottieContainer, {
      rotateY: scrollDirection === "up" ? -180 : 0,
    });
  },
});
