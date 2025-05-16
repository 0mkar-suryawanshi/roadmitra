// Function to include HTML components
function includeHTML() {
    let elements = document.querySelectorAll('[data-include]');
    elements.forEach(function async(element) {
      let file = element.getAttribute('data-include');
      fetch(file)
        .then(response => {
          if (response.ok) {
            return response.text();
          }
          throw new Error('Failed to fetch component');
        }).then(data => {
          element.innerHTML = data;
          changeNavbarThemeBasedOnURL();
        }).catch(error => console.error(error));
    });
  
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        if (!sessionStorage.getItem('animated')) {
          document.getElementById('logo_seg').classList.add('logoAnim');
          document.getElementById('logo_seg').addEventListener('animationend', () => {
            document.getElementById('animation_text').style.height = "0px";
            window.scrollTo(0, 0);
            document.getElementById('menubar').classList.add('shrink');
            const firstChildDiv = document.querySelector('#menubar > div:first-child');
            firstChildDiv.style.scale = "1";
          })
  
          document.getElementById('menubar').addEventListener('animationend', (ev) => {
            if (ev.animationName === "shrink") {
              document.getElementById('animation_text').style.display = "none";
              document.getElementsByTagName('nav')[0].style.transform = "translateY(0%)"
              document.querySelector('#logo_seg').parentNode.style.width = "220px";
              const logoIcon = document.getElementById('logo_seg');
              setTimeout(() => {
                logoIcon.style.transition = "margin 0.5s ease";
                logoIcon.classList.remove('mx-auto');
              }, 300);
  
              return;
            }
          })
          sessionStorage.setItem('animated', true)
        }
        else {
          const menubar = document.getElementById('menubar');
          const animationText = document.getElementById('animation_text');
          const logoSeg = document.getElementById('logo_seg');
          const firstChildDiv = document.querySelector('#menubar > div:first-child');
          const nav = document.getElementsByTagName('nav');
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
            nav[0].style.transform = "translateY(0%)"
          }
          if (logoSeg) {
            logoSeg.parentNode.style.width = "220px";
            const logoIcon = document.getElementById('logo_seg');
            logoIcon.classList.remove('mx-auto');
          }
          window.scrollTo(0, 0);
        }
      }, 100);
    });
  }
  includeHTML();
  
  
  function changeNavbarThemeBasedOnURL() {
    const navbar = document.getElementById('menubar');
    const mobileNav = document.getElementById('mobileNav');
    const currentRoute = window.location.pathname;
    const activeRoute = currentRoute.split('/').pop();
  
    // Reset all navbar themes
    if (navbar) {
      navbar.classList.remove('inspection_theme', 'multimedia_theme', 'default_theme', 'carrer_theme', 'cng_theme', 'cng_rfc_theme');
    }
  
    // Reset text color for nav items and logo
    const navText = document.querySelectorAll('.navText');
    const logoText = document.querySelector('.logoText');
    if (logoText) {
      logoText.innerHTML = 'RoadMitra/ Default text'
      logoText.style.removeProperty('color');
    }
    navText.forEach(element => {
      element.style.removeProperty('color');
    });
  
    // Reset mobile navigation styling
    if (mobileNav) {
      mobileNav.style.removeProperty('color', 'background-color');
    }
    // Reset icons to default
    const serviceDropIcon = document.getElementById('service_dropdown_icon');
    if (serviceDropIcon) {
      serviceDropIcon.innerHTML = "";
      serviceDropIcon.innerHTML = '<img src="./assets/images/common/arrow-circle-down.svg" alt="Dropdown icon">';
    }
    const mobileHam = document.getElementById('mobile_ham');
    if (mobileHam) {
      mobileHam.innerHTML = "";
      mobileHam.innerHTML = '<img src="./assets/images/common/ham.svg" alt="menu icon">';
    }
    const closeIcon = document.getElementById('closeIcon');
    if (closeIcon) {
      closeIcon.innerHTML = "";
      closeIcon.innerHTML = '<img src="./assets/images/common/close-line.svg" alt="menu close icon">';
    }
  
    // Specific themes based on page
    switch (activeRoute) {
      case 'car-inspection.html':
        navbar.classList.add('inspection_theme');
        mobileNav.classList.add('inspection_theme');
        serviceDropIcon.innerHTML = "";
        serviceDropIcon.innerHTML = '<img src="./assets/images/common/arrow-circle-down_white.svg" alt="Dropdown icon">';
        mobileHam.innerHTML = "";
        mobileHam.innerHTML = '<img src="./assets/images/common/ham_white.svg" alt="menu icon">';
        closeIcon.innerHTML = "";
        closeIcon.innerHTML = '<img src="./assets/images/common/close-line_white.svg" alt="menu close icon">';
        logoText.style.color = 'white';
        navText.forEach(element => {
          element.style.color = 'white';
        });
        mobileNav.style.backgroundColor = '#06278a';
        mobileNav.style.color = 'white';
        break;
  
      case 'multimedia-installation.html':
      case 'dashcam-installation.html':
        navbar.classList.add('multimedia_theme');
        mobileNav.classList.add('multimedia_theme');
        serviceDropIcon.innerHTML = "";
        serviceDropIcon.innerHTML = '<img src="./assets/images/common/arrow-circle-down_white.svg" alt="Dropdown icon">';
        mobileHam.innerHTML = "";
        mobileHam.innerHTML = '<img src="./assets/images/common/ham_white.svg" alt="menu icon">';
        closeIcon.innerHTML = "";
        closeIcon.innerHTML = '<img src="./assets/images/common/close-line_white.svg" alt="menu close icon">';
        logoText.style.color = 'white';
        navText.forEach(element => {
          element.style.color = 'white';
        });
        mobileNav.style.backgroundColor = '#212121';
        mobileNav.style.color = 'white';
        break;
  
      case 'careers.html':
        navbar.classList.add('carrer_theme');
        mobileNav.classList.add('carrer_theme');
        serviceDropIcon.innerHTML = "";
        serviceDropIcon.innerHTML = '<img src="./assets/images/common/arrow-circle-down_white.svg" alt="Dropdown icon">';
        mobileHam.innerHTML = "";
        mobileHam.innerHTML = '<img src="./assets/images/common/ham_white.svg" alt="menu icon">';
        closeIcon.innerHTML = "";
        closeIcon.innerHTML = '<img src="./assets/images/common/close-line_white.svg" alt="menu close icon">';
        logoText.style.color = 'white';
        navText.forEach(element => {
          element.style.color = 'white';
        });
        mobileNav.style.backgroundColor = '#256DE9';
        mobileNav.style.color = 'white';
        const cngtext = document.querySelectorAll('.cngText');
        cngtext.forEach(element => {
          element.style.color = 'unset';
          element.style.color = 'white !important';
        });
        const cngtextspan = document.querySelectorAll('.cngText span');
        cngtextspan.forEach(element => {
          element.style.color = 'unset';
          element.style.color = 'white !important';
        });
        break;
  
      case 'cng-retrofitment-cngfirst.html':
        const logoImage = document.querySelector('.logoicon');
        if (logoImage) {
          logoImage.src = './assets/images/cng/CNGFirst-logo.png';
          logoImage.style.width = '140px';
          logoImage.style.height = '40px';
        }
        logoText.innerHTML = "";
        navbar.classList.add('cng_theme');
        mobileNav.classList.add('cng_theme');
        serviceDropIcon.innerHTML = "";
        serviceDropIcon.innerHTML = '<img src="./assets/images/common/arrow-circle-down_white.svg" alt="Dropdown icon">';
        mobileHam.innerHTML = "";
        mobileHam.innerHTML = '<img src="./assets/images/common/ham_white.svg" alt="menu icon">';
        closeIcon.innerHTML = "";
        closeIcon.innerHTML = '<img src="./assets/images/common/close-line_white.svg" alt="menu close icon">';
        logoText.style.color = 'white';
        navText.forEach(element => {
          element.style.color = 'white';
        });
        mobileNav.style.backgroundColor = '#112714';
        mobileNav.style.color = 'white';
        break;
  
      case 'cng-retro-fitment-shivamogga.html':
      case 'cng-retro-fitment-hassan.html':
      case 'cng-retro-fitment-mysuru.html':
        const logoImage2 = document.querySelector('.logoicon');
        const logoLink = document.querySelector('.logo_link');
  
        if (logoImage2) {
          logoImage2.src = './assets/images/cng/CNGFirst-logo-black.png';
          logoImage2.style.width = '140px';
          logoImage2.style.height = '40px';
        }
  
        if (logoLink) {
          logoLink.href = './cng-retrofitment-cngfirst.html';
        }
  
        logoText.innerHTML = "";
        break;
  
    }
  }