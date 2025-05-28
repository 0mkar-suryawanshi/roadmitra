// Function to include HTML components
function includeHTML() {
  let elements = document.querySelectorAll("[data-include]");
  elements.forEach(function async(element) {
    let file = element.getAttribute("data-include");
    fetch(file)
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw new Error("Failed to fetch component");
      })
      .then((data) => {
        element.innerHTML = data;
        changeNavbarThemeBasedOnURL();
      })
      .catch((error) => console.error(error));
  });

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      if (!sessionStorage.getItem("animated")) {
        document.getElementById("logo_seg").classList.add("logoAnim");
        document
          .getElementById("logo_seg")
          .addEventListener("animationend", () => {
            document.getElementById("animation_text").style.height = "0px";
            window.scrollTo(0, 0);
            document.getElementById("menubar").classList.add("shrink");
            const firstChildDiv = document.querySelector(
              "#menubar > div:first-child"
            );
            firstChildDiv.style.scale = "1";
          });

        document
          .getElementById("menubar")
          .addEventListener("animationend", (ev) => {
            if (ev.animationName === "shrink") {
              document.getElementById("animation_text").style.display = "none";
              document.getElementsByTagName("nav")[0].style.transform =
                "translateY(0%)";
              document.querySelector("#logo_seg").parentNode.style.width =
                "220px";
              const logoIcon = document.getElementById("logo_seg");
              setTimeout(() => {
                logoIcon.style.transition = "margin 0.5s ease";
                logoIcon.classList.remove("mx-auto");
              }, 300);

              return;
            }
          });
        sessionStorage.setItem("animated", true);
      } else {
        const menubar = document.getElementById("menubar");
        const animationText = document.getElementById("animation_text");
        const logoSeg = document.getElementById("logo_seg");
        const firstChildDiv = document.querySelector(
          "#menubar > div:first-child"
        );
        const nav = document.getElementsByTagName("nav");
        if (menubar) {
          menubar.transition = "0s";
        }
        if (animationText) {
          animationText.style.display = "none";
        }
        if (menubar) {
          menubar.style.height = "70px";
        }
        if (logoSeg) {
          logoSeg.style.transform = "translate(0, 0)";
        }
        if (firstChildDiv) {
          firstChildDiv.style.scale = "1";
        }
        if (nav.length) {
          nav[0].style.transform = "translateY(0%)";
        }
        if (logoSeg) {
          logoSeg.parentNode.style.width = "220px";
          const logoIcon = document.getElementById("logo_seg");
          logoIcon.classList.remove("mx-auto");
        }
        window.scrollTo(0, 0);
      }
    }, 100);
  });
}
includeHTML();

function changeNavbarThemeBasedOnURL() {
  const navbar = document.getElementById("menubar");
  const mobileNav = document.getElementById("mobileNav");
  const logoText = document.querySelector(".logoText");
  const navTexts = document.querySelectorAll(".navText");
  const serviceDropIcon = document.getElementById("service_dropdown_icon");
  const mobileHam = document.getElementById("mobile_ham");
  const closeIcon = document.getElementById("closeIcon");

  if (!navbar) return;

  // Reset all themes and styles
  const themeClasses = [
    "inspection_theme",
    "multimedia_theme",
    "default_theme",
    "carrer_theme",
    "seatCover_theme",
    "yellowhat_theme",
  ];
  navbar.classList.remove(...themeClasses);
  mobileNav?.classList.remove(...themeClasses);

  // Reset text colors
  if (logoText) {
    logoText.textContent = "RoadMitra";
    logoText.style.color = "";
  }

  navTexts.forEach((element) => {
    element.style.color = "";
  });

  if (mobileNav) {
    mobileNav.style.backgroundColor = "";
    mobileNav.style.color = "";
  }

  const resetIcon = (element, defaultSrc) => {
    if (!element) return;
    element.innerHTML = `<img src="${defaultSrc}" alt="Dropdown icon">`;
  };

  resetIcon(serviceDropIcon, "./assets/images/common/arrow-circle-down.svg");
  resetIcon(mobileHam, "./assets/images/common/ham.svg");
  resetIcon(closeIcon, "./assets/images/common/close-line.svg");

  // Get current route
  const currentRoute = window.location.pathname;
  const activeRoute = currentRoute.split("/").pop().toLowerCase();

  // Apply theme based on route
  const applyTheme = (theme, config = {}) => {
    navbar.classList.add(theme);
    mobileNav?.classList.add(theme);

    if (config.whiteText) {
      if (logoText) logoText.style.color = "white";
      navTexts.forEach((el) => (el.style.color = "white"));
    }

    if (config.whiteIcons) {
      resetIcon(
        serviceDropIcon,
        "./assets/images/common/arrow-circle-down_white.svg"
      );
      resetIcon(mobileHam, "./assets/images/common/ham_white.svg");
      resetIcon(closeIcon, "./assets/images/common/close-line_white.svg");
    }

    if (mobileNav && config.mobileBg) {
      mobileNav.style.backgroundColor = config.mobileBg;
      mobileNav.style.color = "white";
    }

    if (config.logoImage) {
      const logoImage = document.querySelector(".logoicon");
      if (logoImage) {
        logoImage.src = config.logoImage.src;
        logoImage.style.width = config.logoImage.width || "auto";
        logoImage.style.height = config.logoImage.height || "auto";
      }
      if (logoText) logoText.innerHTML = config.logoText || "";
    }
  };

  const themes = {
    "car-inspection.html": {
      theme: "inspection_theme",
      whiteText: true,
      whiteIcons: true,
      mobileBg: "#06278a",
    },
    "dashcam-installation.html": {
      theme: "multimedia_theme",
      whiteText: true,
      whiteIcons: true,
      mobileBg: "#212121",
    },
    "dashcam-with-installation.html": {
      theme: "multimedia_theme",
      whiteText: true,
      whiteIcons: true,
      mobileBg: "#212121",
    },
      
    "yellow-hat-riders-club.html": {
      theme: "yellowhat_theme",
      whiteText: false,
      whiteIcons: false,
      mobileBg: "#EEEEEE",
    },
    "seat-cover-installation.html": {
      theme: "seatCover_theme",
      whiteText: true,
      whiteIcons: true,
      mobileBg: "#222429",
    },
  };

  // Apply matching theme
  for (const [route, config] of Object.entries(themes)) {
    if (activeRoute === route.toLowerCase()) {
      applyTheme(config.theme, config);
      break;
    }
  }

  
}
