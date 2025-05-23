const observer1 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show1');
        }
        else {
            entry.target.classList.remove('show1');
        }
    });
})
const hiddenElements1 = document.querySelectorAll('.howwedosectionhead');
hiddenElements1.forEach((el) => observer1.observe(el));


const observer2 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show2');
        }
        else {
            entry.target.classList.remove('show2');
        }
    });
})
const hiddenElements2 = document.querySelectorAll('.howwedocardsection');
hiddenElements2.forEach((el) => observer2.observe(el));


const observer3 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show3');
        }
        else {
            entry.target.classList.remove('show3');
        }
    });
})
const hiddenElements3 = document.querySelectorAll('.updateheading');
hiddenElements3.forEach((el) => observer3.observe(el));


const observer4 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show4');
        }
        else {
            entry.target.classList.remove('show4');
        }
    });
})
const hiddenElements4 = document.querySelectorAll('.about-fitmentleftsectionimage');
hiddenElements4.forEach((el) => observer4.observe(el));



const testimonialcarousel = document.querySelector(".testimonial-carousel");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".testimonial-carousel img");
const carouselChildrens = [...carousel.children];

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if (!isDragging) return;
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

const infiniteScroll = () => {
    if (carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }
    clearTimeout(timeoutId);
    if (!testimonialcarousel.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if (window.innerWidth < 800 || !isAutoPlay) return;
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
testimonialcarousel.addEventListener("mouseenter", () => clearTimeout(timeoutId));
testimonialcarousel.addEventListener("mouseleave", autoPlay);

const faqHeaders = document.querySelectorAll(".faqs-container .faq-header");
faqHeaders.forEach((header, img) => {
    header.addEventListener("click", () => {
        header.nextElementSibling.classList.toggle("active");

        const open = header.querySelector(".open");
        const close = header.querySelector(".close");

        if (header.nextElementSibling.classList.contains("active")) {
            open.classList.remove("active");
            close.classList.add("active");
        } else {
            open.classList.add("active");
            close.classList.remove("active");
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    let timeoutIds = [];
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const listItems = entry.target.querySelectorAll('.about-fitmentrightsectiondetails li');
            if (entry.isIntersecting) {
                listItems.forEach((item, index) => {
                    const timeoutId = setTimeout(() => {
                        item.classList.add('active');
                    }, 500 * index);
                    timeoutIds.push(timeoutId);
                });
            } else {
                timeoutIds.forEach(timeoutId => {
                    clearTimeout(timeoutId);
                });
                listItems.forEach((item, index) => {
                    item.classList.remove('active');
                });
            }
        });
    });
    const section = document.getElementById('about-fitmentrightsection');
    observer.observe(section);
});

document.addEventListener("DOMContentLoaded", function () {
    let timeoutIds = [];
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const listItems = entry.target.querySelectorAll('.fitmentservicedolist li');
            if (entry.isIntersecting) {
                listItems.forEach((item, index) => {
                    const timeoutId = setTimeout(() => {
                        item.classList.add('show');
                    }, 300 * index);
                    timeoutIds.push(timeoutId);
                });
            } else {
                timeoutIds.forEach(timeoutId => {
                    clearTimeout(timeoutId);
                });
                listItems.forEach(item => {
                    item.classList.remove('show');
                });
            }
        });
    });
    const section = document.getElementById('fitmentSection');
    observer.observe(section);
});

document.addEventListener('DOMContentLoaded', (event) => {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const cardSections = entry.target.querySelectorAll('.chooseus_card-section');

                cardSections.forEach((section, index) => {
                    section.style.animation = 'movedown 1s linear forwards';
                    section.style.opacity = '0';
                    section.style.animationDelay = `${index}s`; 
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const chooseusAnim = document.querySelector('.chooseus-anim');
    observer.observe(chooseusAnim);
});

document.addEventListener('DOMContentLoaded', (event) => {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const timeline = entry.target.querySelector('.chooseus_timeline');
                const cardSections = entry.target.querySelectorAll('.chooseus_card-section');
                cardSections.forEach((section, index) => {
                    section.style.animation = 'movedown 1s linear forwards';
                    section.style.opacity = '0';
                    section.style.animationDelay = `${index}s`; 
                });

                timeline.classList.add('show-line');

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const chooseusAnim = document.querySelector('.chooseus-anim');
    observer.observe(chooseusAnim);
});

document.addEventListener('DOMContentLoaded', (event) => {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const timeline = entry.target.querySelector('.chooseus_timeline');
                const cardSections = entry.target.querySelectorAll('.chooseus_card-section');

                // Add animation properties to each card section
                cardSections.forEach((section, index) => {
                    section.style.animation = 'movedown 1s linear forwards';
                    section.style.opacity = '0';
                    section.style.animationDelay = `${index}s`; 
                });

                // Add class to dynamically change the timeline style
                timeline.classList.add('show-line');

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const chooseusAnim = document.querySelector('.chooseus-anim');
    observer.observe(chooseusAnim);
});
