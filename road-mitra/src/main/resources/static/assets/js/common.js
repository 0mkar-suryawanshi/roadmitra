import apis from "./apiConfig.js";
import { environment } from './environment.js';

function updateCampaignStatus(id) {
  const urlWithParams = `${apis.marketing.campaign}?id=${encodeURIComponent(id)}`;
  fetch(urlWithParams, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
const urlParams = new URLSearchParams(window.location.search);
const dynamicId = urlParams.get('campaign');
if (dynamicId) {
  updateCampaignStatus(dynamicId);
}

function openurl(url) {
  window.open("https://" + url, "_blank");
}
window.openurl = openurl;

const devServices = [
  { id: 1, category: 'RSA', vtype: '', name: 'Flat Tyre (Tube)' },
  { id: 2, category: 'RSA', vtype: '', name: 'Flat Tyre (Tubeless)' },
  { id: 4, category: 'RSA', vtype: '', name: 'Battery Jumpstart' },
  { id: 5, category: 'RSA', vtype: '', name: 'Starting Problem' },
  { id: 6, category: 'RSA', vtype: '', name: 'Minor Repair' },
  { id: 8, category: 'RSA', vtype: '', name: 'Key Unlock Assistance' },
  { id: 11, category: 'TOWING', vtype: '', name: 'Flatbed Towing' },
  { id: 12, category: 'TOWING', vtype: 'car', name: 'Lifting Towing' },
  { id: 46, category: 'FITMENT', vtype: 'bike', name: 'Tyre Fitting' },
  { id: 18, category: 'FITMENT', vtype: '', name: 'Light Fitting' },
  { id: 105, category: 'FITMENT', vtype: 'car', name: 'DashCam Installation' },
  { id: 112, category: 'FITMENT', vtype: 'car', name: 'Front & Rear DashCam Fitment' },
  { id: 57, category: '2WDSS', vtype: 'bike', name: 'General Service' },
  { id: 79, category: 'INSPECTION', vtype: 'car', name: 'Car Full Inspection' },
  { id: 109, category: 'FITMENT', vtype: 'car', name: 'SeatCover Installation' },
  { id: 57, category: 'FITMENT', vtype: 'car', name: 'Media player installation' },
  { id: 73, category: 'FITMENT', vtype: 'car', name: 'GPS Device Installation' },

  { id: '', category: 'RSA', vtype: '', name: 'flatTyre' },
  { id: '', category: 'TOWING', vtype: '', name: 'towing' },
  { id: '', category: 'FITMENT', vtype: '', name: 'fitmentService' },
  { id: 105, category: 'FITMENT', vtype: 'car', name: 'dashCam' }
]

const prodServices = [
  { id: 1, category: 'RSA', vtype: '', name: 'Flat Tyre (Tube)' },
  { id: 2, category: 'RSA', vtype: '', name: 'Flat Tyre (Tubeless)' },
  { id: 4, category: 'RSA', vtype: '', name: 'Battery Jumpstart' },
  { id: 5, category: 'RSA', vtype: '', name: 'Starting Problem' },
  { id: 6, category: 'RSA', vtype: '', name: 'Minor Repair' },
  { id: 8, category: 'RSA', vtype: '', name: 'Key Unlock Assistance' },
  { id: 11, category: 'TOWING', vtype: '', name: 'Flatbed Towing' },
  { id: 12, category: 'TOWING', vtype: 'car', name: 'Lifting Towing' },
  { id: 16, category: 'FITMENT', vtype: 'bike', name: 'Tyre Fitting' },
  { id: 18, category: 'FITMENT', vtype: '', name: 'Light Fitting' },
  { id: 75, category: 'FITMENT', vtype: 'car', name: 'DashCam Installation' },
  { id: 86, category: 'FITMENT', vtype: 'car', name: 'Front & Rear DashCam Fitment' },
  { id: 62, category: '2WDSS', vtype: 'bike', name: 'General Service' },
  { id: 87, category: 'INSPECTION', vtype: 'car', name: 'Car Full Inspection' },
  { id: 103, category: 'FITMENT', vtype: 'car', name: 'SeatCover Installation' },
  { id: 57, category: 'FITMENT', vtype: 'car', name: 'Media player installation' },
  { id: 73, category: 'FITMENT', vtype: 'car', name: 'GPS Device Installation' },

  { id: '', category: 'RSA', vtype: '', name: 'flatTyre' },
  { id: '', category: 'TOWING', vtype: '', name: 'towing' },
  { id: '', category: 'FITMENT', vtype: '', name: 'fitmentService' },
  { id: 75, category: 'FITMENT', vtype: 'car', name: 'dashCam' }
];

function toggleSlider(screenEvent, serviceName) {
  const body = document.body;
  body.style.height = '100dvh';
  body.style.overflowY = 'hidden';

  const slider = document.getElementById('globalSlider');
  slider.classList.toggle('open');

  const services = environment.isProd ? prodServices : devServices;
  const service = services.find(s => s.name === serviceName);

  let iframeURL = '';

  const baseURL = environment.isProd ? 'https://app.readyassist.in' : 'http://localhost:4200';

  // Hardcoded URLs based on screenEvent with dynamic id and vtype
  switch (screenEvent) {
    case 'bookService':
      iframeURL = `${baseURL}/book-service`;
      break;
    case 'serviceBooking':
      iframeURL = `${baseURL}/book-service/service?id=${service.id}&category=${service.category}&vType=${service.vtype}`;
      break;

    default:
      console.error('Invalid screenEvent passed to toggleSlider');
      return;
  }

  slider.innerHTML = `
    <div style="position: absolute; top: 12px; right: 14px;cursor: pointer">
      <span onclick="closeSlider()" style="font-size: 22px;color: #FF3131;font-weight: 800;">&#10005;</span>
    </div>

    <!-- Loader shown while iframe is loading -->
    <div id="loader1" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
      <div>
        <div class="loader1"></div>
        <p style="padding-top: 10px;color: #000;font-weight: 500;font-size: 18px;letter-spacing: 1px;text-align: center;margin-left: 15px;">Loading...</p>
      </div>
    </div>

    <iframe id="dynamicIframe" allow="geolocation" class="dynamic_iframe" src="${iframeURL}" frameborder="0">
    </iframe>
    <div id="reloadBtn" style="display: none; position: absolute; bottom: 20px; right: 20px;">
      <button style="padding: 10px 20px; background-color: #000; color: #fff; border: none; border-radius: 5px; cursor: pointer;" onclick="reloadIframe('${iframeURL}')">Reload</button>
    </div>
  `;

  const iframe = document.getElementById('dynamicIframe');
  const loader = document.getElementById('loader1');
  const reloadBtn = document.getElementById('reloadBtn');

  iframe.onload = function () {
    loader.style.display = 'none';
    reloadBtn.style.display = 'none';
  };

  iframe.onerror = function () {
    loader.style.display = 'none';
    reloadBtn.style.display = 'block';
  };

  setTimeout(() => {
    if (loader.style.display !== 'none') {
      reloadBtn.style.display = 'block';
    }
  }, 10000);
}



function reloadIframe(iframeURL) {
  const iframe = document.getElementById('dynamicIframe');
  const loader = document.getElementById('loader');
  if (iframe && loader) {
    loader.style.display = 'block';
    iframe.src = '';
    setTimeout(() => {
      iframe.src = iframeURL;
    }, 100);
  } else {
    console.error('Iframe or loader not found.');
  }
}
window.reloadIframe = reloadIframe;


function closeSlider() {
  const body = document.body;
  body.style.height = '100%';
  body.style.overflowY = 'visible';
  const slider = document.getElementById('globalSlider');
  if (slider.classList.contains('open')) {
    slider.classList.remove('open');
  }
  slider.innerHTML = '';
}

window.toggleSlider = toggleSlider;
window.closeSlider = closeSlider;

