import apis from "./apiConfig.js";
import apiService from "./restAPI.js";
import Components from './util.js';

const { SnackBar, Loader, router,openExternalUrl } = Components;
const snackbar = new SnackBar();
const api = new apiService;

var animPosition;
var animPosition2;
var animImg;
var animDiv;
var animDiv2;
var animWrapper;


function rewardsSubmit() {
  const customerMobile = document.getElementById('phoneInp');
  const cxName = document.getElementById('nameInp');
  const cxEmail = document.getElementById('emailInp');
  const suggestion = document.getElementById('suggestionInp');
  if (customerMobile.value.toString().length !== 10) {
    snackbar.openSnack('Please provide valid details', 2000, 'snack_error')
    return;
  }
  const payload = {
    customerName: cxName.value || "Customer",
    customerMobileNo: customerMobile.value,
    customerEmailId: cxEmail.value || "noemail.com",
    title: "Rewards Suggestions",
    description: suggestion.value || "The customer has suggestions about our rewards in home page.",
    type: "service",
    department: "customer",
  }

  api.post(apis.contact.query, payload).then((res) => {
    customerMobile.value = "";
    cxName.value = "";
    cxEmail.value = "";
    suggestion.value = "";
    snackbar.openSnack('Our team will reach you soon', 2000, 'snack_success');
  });

}

window.rewardsSubmit = rewardsSubmit;

function getDivPosition(element) {
  const rect = element.getBoundingClientRect();
  const position = {
    top: rect.top,
    left: rect.left,
    bottom: rect.bottom,
    right: rect.right,
    width: rect.width,
    height: rect.height
  };
  return position;
}

document.getElementById('anim_wrapper').addEventListener('transitionend', (event) => {
  animImg.style.transform = "translateX(0px)";
})

document.addEventListener('scroll', () => {
  animDiv = document.getElementById('anim_wrapper');
  animPosition = getDivPosition(animDiv).top;
  animWrapper = document.getElementById('anim_wrapper');
  animImg = document.getElementById('anim_img');
  var windowHeight = window.innerHeight;

  if (animPosition < windowHeight - 50) {
    if(document.getElementById('pushVideo').querySelector('video')===null){
      document.getElementById('pushVideo').innerHTML=`<video autoplay controls loop muted width="1250px" height="703px" class="br20">
      <source src="https://public-prod-ready.s3.ap-south-1.amazonaws.com/sharable/videos/ra_home_video.mp4" type="video/mp4">
  </video>`;
    }
    animWrapper.style.transform = "translateX(0px) scale(1)";
  }
  else {
    animImg.style.transform = "translateY(300px)"
    animWrapper.style.transform = "translateX(-300px) scale(.1)"
  }
  
})

class Home {

  testimonials = [
    {
      name: "Ashok Shastry",
      info: "Co-Founder & CEO, DriveU",
      review: "Roadside Assistance from RoadMitra on DriveU is a great addition for our customers. It's great fit with our motto of simplifying the car ownership journey for the millions of car owners in India.",
      image: "./assets/images/landing/ashok.webp"
    },
    {
      name: "Sohinder Singh Gill",
      info: "CEO, Hero Electric",
      review: "As a company, our focus has been to strengthen our after-sales service to ensure a hassle-free experience for our B2C and B2B customer. The initiative with RoadMitra focuses on empowering and increasing awareness for EVs.",
      image: "./assets/images/landing/shohinder.webp"
    },
    {
      name: "Anup Naik",
      info: "CEO, Zeliot",
      review: "RoadMitra has been very instrumental in supporting our GPS related on-field operations. While we thought of deploying people on field to handle such huge scale, we found RoadMitra to be the best fit partner.",
      image: "./assets/images/landing/anup_naik.webp"
    },
    {
      name: "Debanjali Sengupta",
      info: "Country Head, Shell",
      review: "We are extremely happy to have associated with a start-up like RoadMitra, which shares our empathy and understanding of the relevance of mechanics in the entire mobility ecosystem.",
      image: "./assets/images/landing/debanjali.webp"
    },
  ]

  news = [
    {
      title: "moneycontrol",
      image: "./assets/images/news/news1.jpg",
      description: "Vivek Oberoi represents his portfolio,including RoadMitra,at WEF 2025 in Davos",
      goTo: "https://www.youtube.com/watch?v=L4VKrDheAP0&t=125s",
      className: "padding-x padding-end",
    },
    {
      title: "Linkedin",
      image: "./assets/images/news/news2.jpg",
      description: "Global Change Makers Award 2024",
      goTo: "https://www.linkedin.com/posts/vimal3747_starting-2025-with-a-bang-thrilled-and-activity-7280658948498595840-upJg/",
      className: "padding-x padding-center",
    },
    {
      title: "ET Auto",
      image: "./assets/images/news/news3.jpg",
      description: "Exploring How RoadMitra Integrates into India’s EV Infrastructure",
      goTo: "https://www.linkedin.com/posts/et-auto_etautoevc-letstalkev-evexpo-ugcPost-7277260951349870594-1kkc/",
      className: "padding-x padding-start"
    },
  ]

  testimonialHtml = ""
  scrollIndex = 0;
  scrollDivs = document.getElementsByClassName('testimonialCard');
  scrollContainer = document.getElementById('clientTestimonials');
  scrollMeasure = 1;
  newsHtml = "";

  constructor() {
    this.routeTo = new router().routeTo;
    this.goToExturl = new openExternalUrl().openurl;
    this.api = new apiService();
    this.loader = new Loader();
    this.snackbar = new SnackBar();
    this.setTestimonials();
    this.setTestimonialAnimation();
    this.setNews();
  }

  route(url) {
    this.loader.openLoader();
    window.location.href = "https://app.readyassist.in" + url;
  }

  setTestimonials() {
    for (const x of this.testimonials) {
      this.testimonialHtml += `<div class="col-12 col-lg-6 px-lg-20" >
      
        <div class="testimonialCard flex flex-col justify-between">
          <p>${x.review}</p>
          <div class="flex items-center justify-end">
            <div>
              <p class="weight600">${x.name}</p>
              <p class="weight300" style="font-size: 12px">${x.info}</p>
            </div>
            <img alt="" class="testimonialImage" src=${x.image} />
          </div>
        </div>
        </div>`;
    }
    document.getElementById('clientTestimonials').innerHTML = this.testimonialHtml;
  }

  setTestimonialAnimation() {
    setInterval(() => {
      this.scrollMeasure = this.scrollDivs[this.scrollIndex].offsetLeft - this.scrollContainer.offsetLeft;
      this.scrollContainer.scrollLeft = this.scrollMeasure;
      if (this.scrollIndex === this.testimonials.length - 1 || (this.scrollContainer.getBoundingClientRect().right + 50 >= this.scrollDivs[3].getBoundingClientRect().left)) {
        this.scrollIndex = -1;
      }
      this.scrollIndex++;
    }, 4000);
  }

  setNews() {
    for (const x of this.news) {
      this.newsHtml += `<div class="col-12 col-lg-4 px-20">
  <div class="pointer col-12" onclick="window.open('${x.goTo}', '_blank')">
          <p style="color:#ffcc33" class="weight600 py-10">${x.title}</p>
          <img width="376px" height="281px" style="max-width:100%;height:auto" src=${x.image} alt="news image" class="w-100 my-2 br20"/>
      </div>
  </div>`;
    }
    document.getElementById('newsSeg').innerHTML = this.newsHtml;
  }

  submitJoin() {
    var name = document.getElementById('sp_name');
    var number = document.getElementById('sp_number');

    if (name.value.length < 4 || number.value.toString().length !== 10) {
      this.snackbar.openSnack('Please provide valid details', 2000, 'snack_error')
      return;
    }

    const payload = {
      customerName: name.value,
      customerMobileNo: number.value,
      title: "Service Partner related query",
      description: "Become our RSA partner & get assured business & take your business next level with us. Choose your path to partnership & get all the support you need to succeed.",
      type: "support",
    }

    this.api.post(apis.contact.query, payload)
      .then(res => {
        name.value = "";
        number.value = "";
        this.snackbar.openSnack('Your request submitted successfully', 2000, 'snack_success')
      });

  }
}

window.home = new Home();

// document.addEventListener("DOMContentLoaded", function() {

//   setTimeout(function() {
//     if (!sessionStorage.getItem('popup')) {
//       sessionStorage.setItem('popup', "1");
//       document.getElementById('popup').classList.remove('hidden');
//     }
//   }, 3000);
  
//   document.getElementById('closeBtn').addEventListener('click', function() {
//       document.getElementById('popup').classList.add('hidden');
//   });

// });




