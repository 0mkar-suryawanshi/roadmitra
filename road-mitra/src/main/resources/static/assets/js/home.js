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

class Home {
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

}

window.home = new Home();

