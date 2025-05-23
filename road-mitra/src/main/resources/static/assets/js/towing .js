import Components from "./util.js";
import { ApiService } from "./api.service.js";
import { GeolocationService } from "./geo-location-service.js";
import { environment } from "./environment.js";
const apiService = new ApiService();
const { SnackBar } = Components;
const snackbar = new SnackBar();

function showLoader() {
  document.querySelector(".loader_parent").style.display = "flex";
}

function hideLoader() {
  document.querySelector(".loader_parent").style.display = "none";
}
hideLoader();

// BOOKING FORM

function getBokkingDetails() {
  var bookingDetails = {
    mobile: document.getElementById("mobileNo").value,
    vehicleRegNo: document.getElementById("vehicleReg").value,
    vehicleMakeModel: document.getElementById("vehicleMakeModel").value,
    PickupLocation: document.getElementById("pickupLocation").value,
    DropLocation: document.getElementById("dropLocation").value,
  };
  return bookingDetails;
}

let globalBookingDetails;

async function validateForm() {
  const bookingDetails = getBokkingDetails();

  const validationFields = [
    {
      field: bookingDetails.mobile,
      message: "Please enter a valid 10-digit mobile number",
      minLength: 10,
    },
    {
      field: bookingDetails.vehicleRegNo,
      message: "Please enter a valid vehicle registration number",
      minLength: 5,
    },
    {
      field: bookingDetails.vehicleMakeModel,
      message: "Please Enter Vehicle Make and Model",
      minLength: 3,
    },
    {
      field: bookingDetails.PickupLocation,
      message: "Please Enter Pickup Location",
      minLength: 3,
    },
    {
      field: bookingDetails.DropLocation,
      message: "Please Enter Drop Location",
      minLength: 3,
    },
  ];

  for (const { field, message, minLength } of validationFields) {
    if (!field || field.trim().length < minLength) {
      snackbar.openSnack(message, 2000, "snack_error");
      return;
    }
  }
  globalBookingDetails = bookingDetails;

  leadPayload.customerMobile = bookingDetails.mobile;
  leadPayload.status = "Customer given Booking Details";
  leadPayload.pickUpLocation = [
    selectedLocations.pickup.coordinates.latitude,
    selectedLocations.pickup.coordinates.longitude,
  ];
  leadPayload.dropLocation = [
    selectedLocations.drop.coordinates.latitude,
    selectedLocations.drop.coordinates.longitude,
  ];
  leadPayload.vehicleType = selectedVehicleDetails.vehicleType;
  leadPayload.vehicleId = selectedVehicleDetails.masterId;
  leadPayload.districtId = pickupdistrict.districtId;

  const isOtpVerified = sessionStorage.getItem("otpVerified") === "true";
  const cxMobile = sessionStorage.getItem("customerMobile");
  if (isOtpVerified && cxMobile === bookingDetails.mobile) {
    leadPayload.status = "Customer OTP Verified";
    createLead(leadPayload);
    await displaySlots();
    return;
  } else {
    await createLead(leadPayload);
    await displaySlots();
    return;
  }
}
window.validateForm = validateForm;

async function displaySlots() {
  if (storedPaymentRefId && storedPaymentRefId.length > 0 ) {
    openOrderScreen();
  } else {
    document.getElementById("otpVerification").style.display = "flex";
    document.querySelector(".otp-container").style.display = "none";
    document.querySelector(".orderScreen").style.display = "none";
    document.querySelector(".slotSelection").style.display = "flex";
    const body = document.body;
    body.style.height = "100vh";
    body.style.overflowY = "hidden";

    await fetchSlots();
  }
}

function closeSlotSelection () {
  document.getElementById("otpVerification").style.display = "none";
  const body = document.body;
  body.style.height = "auto";
  body.style.overflowY = "scroll";
}
window.closeSlotSelection = closeSlotSelection;

async function proceedOtpStep() {
  const isOtpVerified = sessionStorage.getItem("otpVerified") === "true";
  const cxMobile = sessionStorage.getItem("customerMobile");
  if (isOtpVerified && cxMobile === globalBookingDetails.mobile) {
    await getTowingService();
    return;
  }
  else {
    await displayOtpVerification();
    await sendOtp(globalBookingDetails.mobile);
  }
}
window.proceedOtpStep = proceedOtpStep;

let availabilitySlots = [];
let selectedSlot = null;
let selectedDaySlot = 0;
let selectedTimeSlot = null;

async function fetchSlots() {
  showLoader();
  const payload = {
    serviceId: 11,
    bookingDate: "tomorrow",
  };
  try {
    const res = await apiService.fetchAvailableSlots(payload);
    if (res.success) {
      hideLoader();
      availabilitySlots = res.data;
      generateDaysAndSlots();
    } else {
      hideLoader();
      snackbar.openSnack(res.message, 2000, "snack_error");
      return [];
    }
  } catch (error) {
    hideLoader();
    console.error("Error fetching slots:", error);
    snackbar.openSnack("Error fetching slots", 2000, "snack_error");
  }
}

function generateDaysAndSlots() {
  const daySlotContainer = document.querySelectorAll(".slot-box__scroll")[0];

  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() + i);
    days.push(day);
  }

  daySlotContainer.innerHTML = "";
  days.forEach((date, index) => {
    const dayText = date.toLocaleDateString("en-US", { weekday: "short" });
    const monthDay = `${date.toLocaleString("en-US", {
      month: "short",
    })} ${date.getDate()}`;

    const dayDiv = document.createElement("div");
    dayDiv.className = "day-slot";
    dayDiv.setAttribute("onclick", "selectDaySlot(this)");
    dayDiv.setAttribute("data-index", index);

    if (index === 0) {
      dayDiv.classList.add("active");
    }

    dayDiv.innerHTML = `
            <div class="day-slot__date">${monthDay}</div>
            <div class="day-slot__divider"></div>
            <div class="day-slot__label">${dayText}</div>
        `;
    daySlotContainer.appendChild(dayDiv);
  });

  bindTimeSlots(0);
}

let currentSlots = [];

function bindTimeSlots(dayIndex) {
  const timeSlotContainer = document.querySelectorAll(".slot-box__scroll")[1];
  timeSlotContainer.innerHTML = "";
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(today);
  selectedDate.setDate(today.getDate() + dayIndex);

  currentSlots = availabilitySlots.filter((slot) => {
    if (dayIndex === 0) {
      const slotTime = new Date();
      slotTime.setHours(parseInt(slot.hour), parseInt(slot.minute), 0, 0);
      return slotTime > now;
    }
    return true;
  });

  if (currentSlots.length === 0) {
    timeSlotContainer.innerHTML = `<div class="no-slots">No available slots</div>`;
    selectedTimeSlot = null;
    selectedSlot = null;
    return;
  }

  currentSlots.forEach((slot, index) => {
    const timeDiv = document.createElement("div");
    timeDiv.className = "time-slot";
    timeDiv.setAttribute("onclick", "selectTimeSlot(this)");
    timeDiv.setAttribute("data-index", index);

    timeDiv.innerHTML = `
      <div class="time-slot__text">${slot.short.toUpperCase()}</div>
    `;
    timeSlotContainer.appendChild(timeDiv);
  });
  const firstTimeSlotElement = timeSlotContainer.querySelector(".time-slot");
  if (firstTimeSlotElement) {
    firstTimeSlotElement.classList.add("active");
    selectedTimeSlot = currentSlots[0];
    setSelectedSlotDateTime();
  }
}

function selectDaySlot(element) {
  document.querySelectorAll(".day-slot").forEach((el) => el.classList.remove("active"));
  element.classList.add("active");
  const index = parseInt(element.getAttribute("data-index"));
  selectedDaySlot = index;
  bindTimeSlots(index);
}
window.selectDaySlot = selectDaySlot;


function selectTimeSlot(element) {
  document.querySelectorAll(".time-slot").forEach((el) => el.classList.remove("active"));
  element.classList.add("active");
  const index = parseInt(element.getAttribute("data-index"));
  selectedTimeSlot = currentSlots[index];
  setSelectedSlotDateTime();
}
window.selectTimeSlot = selectTimeSlot;

function setSelectedSlotDateTime() {
  if (!selectedTimeSlot) return;
  const today = new Date();
  const selectedDate = new Date(today);
  selectedDate.setDate(today.getDate() + selectedDaySlot);
  selectedDate.setHours(parseInt(selectedTimeSlot.hour));
  selectedDate.setMinutes(parseInt(selectedTimeSlot.minute));
  selectedDate.setSeconds(0);
  selectedDate.setMilliseconds(0);
  selectedSlot = selectedDate.toISOString();
  leadPayload.bookingSlot = selectedSlot;
  leadPayload.status = "Customer Slot Selected";
  createLead(leadPayload);
}
window.setSelectedSlotDateTime = setSelectedSlotDateTime;

async function sendOtp(mobile) {
  showLoader();
  const payload = {
    mobileNo: mobile,
  };
  const res = await apiService.sendOtp(payload);
  if (res.success) {
    hideLoader();
    return true;
  } else {
    hideLoader();
    console.error("OTP sending failed:", res.message || "Unknown error");
    return false;
  }
}

let countdown = 10;
let interval;

async function displayOtpVerification() {
  document.querySelector(".otp-container").style.display = "flex";
  document.querySelector(".orderScreen").style.display = "none";
  document.querySelector(".slotSelection").style.display = "none";
  document.getElementById("otpMobileNo").textContent = globalBookingDetails.mobile;
  document.getElementById("otpVerification").style.display = "flex";
  const body = document.body;
  body.style.height = "100vh";
  body.style.overflowY = "hidden";
  startOtpTimer();
}

function startOtpTimer() {
  clearInterval(interval);
  countdown = 10;
  const resendBtn = document.getElementById("resendBtn");
  resendBtn.disabled = true;
  resendBtn.innerHTML = `Resend OTP in <span id="timer">${countdown}</span>s`;

  interval = setInterval(() => {
    countdown--;
    document.getElementById("timer").textContent = countdown;

    if (countdown <= 0) {
      clearInterval(interval);
      resendBtn.innerHTML = "Resend OTP";
      resendBtn.disabled = false;
    }
  }, 1000);
}

async function resendOtp() {
  clearInterval(interval);
  await sendOtp(globalBookingDetails.mobile);
  startOtpTimer();
}
window.resendOtp = resendOtp;

function closeOtpVerification() {
  document.getElementById("otpVerification").style.display = "none";
  const body = document.body;
  body.style.height = "auto";
  body.style.overflowY = "scroll";
}
window.closeOtpVerification = closeOtpVerification;

const handleOtpInput = (event, index) => {
  const inputs = document.querySelectorAll(".otp-input");
  const key = event.key;

  if (key === "Backspace" || key === "Delete") {
    inputs[index].value = "";
    if (index > 0) {
      inputs[index - 1].focus();
    }
  } else if (!isNaN(key) && key.length === 1) {
    inputs[index].value = key;
    if (index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  } else if (key === "ArrowRight" && index < inputs.length - 1) {
    inputs[index + 1].focus();
  } else if (key === "ArrowLeft" && index > 0) {
    inputs[index - 1].focus();
  }
};
document.querySelectorAll(".otp-input").forEach((input, index) => {
  input.addEventListener("keyup", (event) => handleOtpInput(event, index));
});

let customerDetails = null;

async function verifyOtp() {
  showLoader();
  const otp = [...document.querySelectorAll(".otp-input")]
    .map((input) => input.value)
    .join("");
  if (otp.length === 4) {
    const payload = {
      mobileNo: globalBookingDetails.mobile,
      otp: otp,
    };
    apiService.verifyOtp(payload).then((res) => {
      if (res.success) {
        hideLoader();
        customerDetails = res.data;
        sessionStorage.setItem("otpVerified", "true");
        sessionStorage.setItem("cxToken", res.data.token);
        sessionStorage.setItem("customerId", res.data.customerId);
        sessionStorage.setItem("customerName", res.data.customerName);
        sessionStorage.setItem("customerMobile", globalBookingDetails.mobile);
        sessionStorage.setItem("isSubscribed", res.data.isSubscribed);
        sessionStorage.setItem("orderCount", res.data.orderCount);
        sessionStorage.setItem("customerEmailId", res.data.customerEmailId);
        apiService.saveToken(sessionStorage.getItem("cxToken"));
        snackbar.openSnack(res.message, 2000, "snack_success");
        leadPayload.customerId = customerDetails.customerId;
        leadPayload.customerName = customerDetails.customerName;
        leadPayload.isSubscribed = customerDetails.isSubscribed;
        leadPayload.status = "Customer OTP Verified";
        createLead(leadPayload);
        getTowingService();
      } else {
        hideLoader();
        snackbar.openSnack(res.message, 2000, "snack_error");
      }
    });
  } else {
    hideLoader();
    snackbar.openSnack("Please enter a valid 4-digit OTP", 2000, "snack_error");
  }
}
window.verifyOtp = verifyOtp;

const leadPayload = {
  customerId: null,
  customerMobile: "",
  status: "",
  vehicleId: null,
  isSubscribed: false,
  pickUpLocation: [],
  dropLocation: [],
  isTowing: true,
  platform: "B2C-WEB",
  serviceId: 11,
  vehicleType: "",
  statusUpdatingCount: 0,
  districtId: 0,
  clientId: 1,
  orderId: null,
  bookingSlot: null,
  paymentId: null,
  paymentStatus: null,
};

let leadDetails = null;

async function createLead(leadPayload) {
  const res = await apiService.createLeadOrder(leadPayload);
  if (res.success) {
    leadDetails = res.data;
    if (leadDetails.id) {
      sessionStorage.setItem("leadId", leadDetails.id);
    }else{
      sessionStorage.setItem("leadId", null);
    }
  } else {
    hideLoader();
  }
}

let towingPriceDetails = null;

async function getTowingService() {
  if (!selectedVehicleDetails.vehicleRegId) {
    await addCxVehicle();
  }
  showLoader();
  const payload = {
    origin: {
      lat: selectedLocations.pickup.coordinates.latitude,
      lng: selectedLocations.pickup.coordinates.longitude,
    },
    destination: {
      lat: selectedLocations.drop.coordinates.latitude,
      lng: selectedLocations.drop.coordinates.longitude,
    },
    pickDistrictId: pickupdistrict.districtId,
    dropDistrictId: dropdistrict.districtId,
    serviceId: 11,
    vehicleId: selectedVehicleDetails.masterId,
    clientId: 1,
    registeredVehicleId: selectedVehicleDetails.vehicleRegId,
  };
  try {
    const res = await apiService.towingPriceCalculator(payload);
    if (res.success) {
      hideLoader();
      towingPriceDetails = res.data;
      await createOrder();
    } else {
      hideLoader();
      snackbar.openSnack(
        "Currently we are not providing towing for this vehicle",
        2000,
        "snack_error"
      );
      return;
    }
  } catch (error) {
    console.error("Towing service request failed:", error);
    hideLoader();
    snackbar.openSnack("Error fetching towing service", 2000, "snack_error");
  }
}

let towingInfo = [];

async function checkOnDemand() {
  showLoader();
  const bookNowBtn = document.querySelector(".book_online_btn");
  bookNowBtn.disabled = true;
  bookNowBtn.classList.add("disabled");
  const payload = {
    clientId: 1,
    districtId: pickupdistrict.districtId,
    registeredVehicleId: selectedVehicleDetails.vehicleRegId,
    serviceId: 11,
  };
  try {
    const res = await apiService.onDemandCheck(payload);
    hideLoader();
    if (res.success) {
      bookNowBtn.disabled = false;
      bookNowBtn.classList.remove("disabled");
      await getTowingInfo();
    } else {
      showOndemandMsg(
        res.message || "Service is not available at this location."
      );
    }
  } catch (error) {
    hideLoader();
    console.error("Error fetching towing info:", error);
  }
}

async function showOndemandMsg(message) {
  const summaryContainer = document.querySelector(".booking_form");
  const existingSummary = document.querySelector(".towing_summary");
  const bookNowBtn = document.querySelector(".book_online_btn");

  if (existingSummary) {
    existingSummary.remove();
  }
  const towingSummaryDiv = document.createElement("div");
  towingSummaryDiv.classList.add("towing_summary");
  towingSummaryDiv.style.cssText =
    "background: #ffe6e6; padding: 10px; border-radius: 5px;";
  towingSummaryDiv.innerHTML = `
    <div>
      <p style="margin: 0px !important;">${message}</p>
    </div>
  `;
  summaryContainer.appendChild(towingSummaryDiv);
  bookNowBtn.disabled = true;
  bookNowBtn.classList.add("disabled");
}

async function getTowingInfo() {
  const bookNowBtn = document.querySelector(".book_online_btn");
  showLoader();
  const payload = {
    clientId: 1,
    origin: {
      lat: selectedLocations.pickup.coordinates.latitude,
      lng: selectedLocations.pickup.coordinates.longitude,
    },
    destination: {
      lat: selectedLocations.drop.coordinates.latitude,
      lng: selectedLocations.drop.coordinates.longitude,
    },
    serviceId: 11,
    vehicleId: selectedVehicleDetails.masterId,
    districtId: pickupdistrict.districtId,
  };

  try {
    const res = await apiService.towingPriceDisplay(payload);
    if (res.success) {
      hideLoader();
      towingInfo = res.data;
      updateTowingSummary();
    } else {
      hideLoader();
      snackbar.openSnack(
        "Currently we are not providing towing for this vehicle",
        2000,
        "snack_error"
      );
      return;
    }
  } catch (error) {
    hideLoader();
    console.error("Error fetching towing info:", error);
  }
}

function updateTowingSummary() {
  const summaryContainer = document.querySelector(".booking_form");
  const existingSummary = document.querySelector(".towing_summary");
  if (existingSummary) {
    existingSummary.remove();
  }
  if (towingInfo.distance === 0) {
    showOndemandMsg("❌ Pickup and drop-off locations can't be the same. Please choose different locations.");
    return;
  }
  const towingSummaryDiv = document.createElement("div");
  towingSummaryDiv.classList.add("towing_summary");
  towingSummaryDiv.setAttribute("onclick", "towingDetailsOpen()");

  towingSummaryDiv.innerHTML = `
    <div style="display: flex;align-items: center;gap: 20px;">
      <p>Total Distance of towing : <span>${towingInfo.distance}</span></p>
      <p>Total Amount: <span class="no-wrap"> ₹&nbsp;${Math.round(
    towingInfo.totalAmount
  )}*</span></p>
      <img src="./assets/images/common/icons/info.svg" alt="">
    </div>
    <div class="tollParking">*Toll, permit and parking charges are extra.</div>
  `;
  summaryContainer.appendChild(towingSummaryDiv);
}

async function checkAndFetchTowingInfo() {
  if (
    selectedLocations.pickup?.coordinates &&
    selectedLocations.drop?.coordinates &&
    selectedVehicleDetails?.masterId
  ) {
    await checkOnDemand();
  }
}

window.checkAndFetchTowingInfo = checkAndFetchTowingInfo;

function towingDetailsOpen() {
  const popup = document.getElementById("towingCostPopup");

  if (!popup) {
    console.error("Popup element not found");
    return;
  }

  // Ensure towingInfo exists and has the required data
  if (!towingInfo || Object.keys(towingInfo).length === 0) {
    console.error("Towing info is empty or undefined");
    return;
  }

  // Bind values dynamically
  document.querySelector(
    ".total_distance"
  ).textContent = `${towingInfo.distance}`;
  document.querySelector(
    ".km_covered"
  ).textContent = `(upto ${towingInfo.baseKm} Km covered)`;
  document.querySelector(
    ".perKm"
  ).textContent = `₹ ${towingInfo.perKmCharge}/km`;
  document.querySelector(
    ".service_charges"
  ).textContent = `₹ ${towingInfo.serviceCharge}`;
  document.querySelector(".towing_tax").textContent = `₹ ${towingInfo.tax}`;
  document.querySelector(
    ".total_amount"
  ).textContent = `Total Payable Amount : ₹ ${Math.round(
    towingInfo.totalAmount
  )}/-`;
  document.querySelector(
    ".formula_description"
  ).textContent = `${towingInfo.formulaDescription}`;
  document.getElementById("towingCostPopup").style.display = "flex";

  // Hide Extra Distance charge if distance is within baseKm
  const extraDistanceRow = document.querySelector(".extra_distance_row");
  if (towingInfo.extraKm > 0) {
    extraDistanceRow.style.display = "flex";
    document.querySelector(".perKm").textContent = `₹ ${Math.round(
      towingInfo.extraKm * towingInfo.perKmCharge
    )}`;
    document.querySelector(
      ".extra_distance_details"
    ).textContent = `(${Math.round(towingInfo.extraKm)} km @ ₹${towingInfo.perKmCharge
    }/km)`;
  } else {
    extraDistanceRow.style.display = "none";
  }

  const body = document.body;
  body.style.height = "100vh";
  body.style.overflowY = "hidden";
}
window.towingDetailsOpen = towingDetailsOpen;

function towingDetailsClose() {
  document.getElementById("towingCostPopup").style.display = "none";
  const body = document.body;
  body.style.height = "auto";
  body.style.overflowY = "scroll";
}
window.towingDetailsClose = towingDetailsClose;

let orderDetails = null;
async function createOrder() {
  showLoader();
  let nightCharge = 0;
  let hours = new Date(selectedSlot).getHours();
  if (hours >= 19 || hours < 7) {
    nightCharge = 50;
    let gstAmount = nightCharge * 0.18;
    nightCharge += gstAmount;
    towingPriceDetails.totalAmount += nightCharge;
  }

  const orderCreatePayload = {
    source: "customer_web",
    platform: "web",
    orderType: "TOWING",
    pickUpAddress: selectedLocations.pickup.displayName,
    refNo: "",
    dropAddress: selectedLocations.drop.displayName,
    bookingSlot: selectedSlot,
    pickUpCoordinate: `${selectedLocations.pickup.coordinates.latitude}, ${selectedLocations.pickup.coordinates.longitude}`,
    dropCoordinate: `${selectedLocations.drop.coordinates.latitude}, ${selectedLocations.drop.coordinates.longitude}`,
    registrationNumber: selectedVehicleDetails.registrationNumber,
    registeredVehicle: selectedVehicleDetails.vehicleRegId,
    client: 1,
    service: 11,
    vehicleMaster: selectedVehicleDetails.masterId,
    customer: Number(sessionStorage.getItem("customerId")),
    isTowing: true,
    district: pickupdistrict.districtId,
    subTotal: towingPriceDetails.serviceCharge,
    total: towingPriceDetails.totalAmount,
    version: "1",
    maxDistance: 10000,
    deviceType: 4,
    couponId: null,
    discountAmount: 0,
    isSubscribed: sessionStorage.getItem("isSubscribed") === "true",
    subscriptionId: null,
    orderStatus: 0,
    isPaid: false,
    scheduleStatus: 0,
    leadOrderId: Number(sessionStorage.getItem("leadId")),
    customerGstIn: "",
    customerGstInPinCode: null,
    customerGstLegalName: null,
  };

  try {
    const res = await apiService.createOrder(orderCreatePayload);
    if (res.success) {
      hideLoader();
      orderDetails = res.data;
      sessionStorage.setItem("orderId", res.data);
      disableAllInputs(); 
      openOrderScreen();
      showLoader();
      setTimeout(() => {
        getRazorpayPaymentId(res.data);
      },2000);
    } else {
      hideLoader();
    }
  } catch (error) {
    console.error("Order creation failed:", error);
    hideLoader();
  }
}

function disableAllInputs() {
  const elements = document.querySelectorAll('.form_input , .form_sug_input , .locate_btn');
  elements.forEach(el => {
    el.disabled = true;
  });
}

function enableAllInputs() {
  const elements = document.querySelectorAll('.form_input , .form_sug_input , .locate_btn');
  elements.forEach(el => {
    el.disabled = false;
  });
}

async function openOrderScreen() {
  document.getElementById("otpVerification").style.display = "flex";
  const body = document.body;
  body.style.height = "100vh";
  body.style.overflowY = "hidden";
  document.querySelector(".otp-container").style.display = "none";
  document.querySelector(".slotSelection").style.display = "none";
  document.querySelector(".orderScreen").style.display = "flex";
  document.getElementById("orderId").textContent = orderDetails;
  const orderAmount = document.querySelector(".order_amount");

  orderAmount.innerHTML = `Please Pay Rs. <span>${Math.round(
    towingPriceDetails.totalAmount
  )}</span>/- to confirm your Order`;
  const orderBtnSection = document.querySelector(".order_btn_section");
  orderBtnSection.innerHTML = `<button class="retry_btn" onclick="proceedToPay()">Proceed to Pay</button>`;
}

function closeOrderScreen() {
  document.getElementById("otpVerification").style.display = "none";
  const body = document.body;
  body.style.height = "auto";
  body.style.overflowY = "scroll";
}
window.closeOrderScreen = closeOrderScreen;

let storedPaymentRefId = null;
async function getRazorpayPaymentId(orderId) {
  showLoader();
  const payload = {
    orderId: orderId,
  };

  try {
    hideLoader();
    const res = await apiService.getRazorPaymentId(payload);
    if (res.success) {
      hideLoader();
      storedPaymentRefId = res.data.paymentRefId;
      proceedToPay(storedPaymentRefId);
      return;
    }
    else{
      hideLoader();
    }
  } catch (error) {
    hideLoader();
    console.error("Error fetching payment ID:", error);
  }
}

let orderLogData = {
  orderId: null,
  paymentId: null,
  paymentVendor: null,
};

async function proceedToPay(refId) {
  try {
    if (!refId) {
      refId = storedPaymentRefId; // Use the stored reference ID if available
    }

    if (!refId) {
      console.error("No payment reference ID available.");
      snackbar.openSnack(
        "😥 We encountered an issue. Please contact our customer support team for assistance.",
        2000,
        "snack_error"
      );
      hideLoader();
      return;
    }

    orderLogData.paymentId = refId;
    orderLogData.paymentVendor = "RAZORPAY";
    const options = {
      key: environment.razorPayApi,
      currency: "INR",
      amount: towingPriceDetails.totalAmount * 100,
      name: "Towing Service",
      description: "",
      image: "https://RoadMitra.in/assets/images/home/logo.png",
      order_id: refId,
      theme: { color: "#ffcc33" },

      handler: function (result) {
        if (result.razorpay_payment_id) {
          updateLeadStatus("payment success");
          sessionStorage.setItem("paymentSuccess", "true");
          const orderBtnSection = document.querySelector(".order_btn_section");
          const orderAmount = document.querySelector(".order_amount");
          orderAmount.innerHTML = "Payment Successful";
          orderBtnSection.innerHTML =
            '<button class="retry_btn" id="trackOrder" onclick="trackOrder()">Track Order</button>';
          clearData();
        }
      },

      prefill: {
        name: sessionStorage.getItem("customerName") || "Guest",
        email: sessionStorage.getItem("customerEmail") || "guest@example.com",
        contact: sessionStorage.getItem("customerMobile") || "9999999999",
        readOnly: false,
      },

      readonly: { name: false, email: false, contact: false },

      config: {
        display: {
          blocks: {
            highlighted: {
              name: "My Custom Block",
              instruments: ["gpay", "freecharge"],
            },
          },
          sequence: ["block.other", "upi", "card", "wallets"],
          preferences: { show_default_blocks: false },
        },
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
    razorpayInstance.on("payment.failed", function (response) {
      sessionStorage.setItem("paymentSuccess", "false");
      updateLeadStatus("payment failed");
      const orderAmount = document.querySelector(".order_amount");
      orderAmount.innerHTML = `Payment Failed. Please Pay Rs. <span>${towingPriceDetails.totalAmount}</span>/- to confirm your Order`;
      const orderBtnSection = document.querySelector(".order_btn_section");
      orderBtnSection.innerHTML = `<button class="retry_btn" id="retryOrder" onclick="proceedToPay()">Retry</button>`;
    });
  } catch (error) {
    console.error("Error in Razorpay:", error);
  }
}
window.proceedToPay = proceedToPay;

function trackOrder() {
  orderDetails = sessionStorage.getItem("orderId");
  const trackUrl =
    "https://tracko.RoadMitra.net/order-track/" + (9999999999 + orderDetails);
  window.open(trackUrl, "_blank");
}
window.trackOrder = trackOrder;

async function updateLeadStatus(status) {
  const payload = {
    id: leadDetails.id,
    notes: "Customer confirmed through B2C-WEB",
    orderId: orderDetails.orderId,
    payAfterService: false,
    sourceOfConvert: status === "payment success" ? "B2C-WEB" : null,
    status: status,
  };
  const res = await apiService.updateLeadOrder(payload);
}

function clearData() {
  sessionStorage.removeItem("otpVerified");
  sessionStorage.removeItem("cxToken");
  sessionStorage.removeItem("customerId");
  sessionStorage.removeItem("customerName");
  sessionStorage.removeItem("customerMobile");
  sessionStorage.removeItem("isSubscribed");
  sessionStorage.removeItem("orderCount");
  sessionStorage.removeItem("customerEmailId");
  sessionStorage.removeItem("leadId");
  selectedVehicleDetails = {};
  selectedLocations = {};
  orderLogData = {};
  orderDetails = null;
  towingPriceDetails = null;
  customerDetails = null;
  globalBookingDetails = null;
  availabilitySlots = [];
  selectedSlot = null;
  selectedDaySlot = 0;
  selectedTimeSlot = null;
  document.querySelectorAll(".otp-input").value = "";
  document.getElementById("mobileNo").value = "";
  document.getElementById("vehicleReg").value = "";
  document.getElementById("vehicleMakeModel").value = "";
  document.getElementById("pickupLocation").value = "";
  document.getElementById("dropLocation").value = "";
  enableAllInputs();
}

let selectedVehicleDetails = {
  vehicleRegId: null,
  vehicleType: "",
  masterId: null,
  vehicleCategoryId: null,
  registrationNumber: "",
};

document.getElementById("vehicleReg").addEventListener("input", () => {
  const vehicleMakeModelInput = document.getElementById("vehicleMakeModel");
  vehicleMakeModelInput.value = "";
  vehicleMakeModelInput.placeholder = "Vehicle Make & Model";
  vehicleMakeModelInput.removeAttribute("readonly");
  selectedVehicleDetails.vehicleRegId = null;
  selectedVehicleDetails.vehicleType = null;
  selectedVehicleDetails.masterId = null;
  selectedVehicleDetails.vehicleCategoryId = null;
});

async function checkVehicleRegNo() {
  const vehicleRegInput = document.getElementById("vehicleReg");
  const vehicleMakeModelInput = document.getElementById("vehicleMakeModel");
  const regNo = vehicleRegInput.value.trim();

  if (!regNo) return;

  vehicleMakeModelInput.placeholder = "Searching for Make and Model...";
  vehicleMakeModelInput.disabled = true;

  try {
    showLoader();
    const res = await apiService.checkIsVehicleExist(
      `registrationNumber=${regNo}`
    );

    if (res.success && res.data) {
      hideLoader();
      vehicleMakeModelInput.value = `${res.data.vehicleName} ${res.data.cc}`;
      selectedVehicleDetails.vehicleRegId = res.data.id;
      selectedVehicleDetails.vehicleType = res.data.vehicleType;
      selectedVehicleDetails.masterId = res.data.vehicleId;
      selectedVehicleDetails.vehicleCategoryId = res.data.vehicleCategoryId;
      selectedVehicleDetails.registrationNumber = regNo;
      vehicleMakeModelInput.setAttribute("readonly", true);
      checkAndFetchTowingInfo();
      snackbar.openSnack("Vehicle Found Successfully", 2000, "snack_success");
    } else {
      hideLoader();
      vehicleMakeModelInput.value = "";
      vehicleMakeModelInput.placeholder = "Enter Vehicle Make & Model";
      vehicleMakeModelInput.removeAttribute("readonly");
      vehicleMakeModelInput.addEventListener("input", fetchVehicleSuggestions);
      selectedVehicleDetails.registrationNumber = regNo;
      snackbar.openSnack(
        res.message || "Vehicle Not Found. Enter details manually.",
        2000,
        "snack_error"
      );
    }
  } catch (error) {
    hideLoader();
    console.error("Vehicle API Error:", error);
    snackbar.openSnack("Failed to fetch vehicle details!", 2000, "snack_error");
  } finally {
    hideLoader();
    vehicleMakeModelInput.disabled = false;
  }
}
window.checkVehicleRegNo = checkVehicleRegNo;

async function addCxVehicle() {
  showLoader();
  const vehicleRegInput = document.getElementById("vehicleReg");
  const regNo = vehicleRegInput.value.trim();
  const payload = {
    chassisNumber: null,
    clientId: 1,
    customerId: sessionStorage.getItem("customerId").toString(),
    regNo: regNo,
    vehicleMasterId: selectedVehicleDetails.masterId,
  };
  const res = await apiService.createVehicle(payload);
  if (res.success) {
    hideLoader();
    selectedVehicleDetails.vehicleRegId = res.data.id;
  } else {
    hideLoader();
    snackbar.openSnack(res.message, 2000, "snack_error");
  }
}

let debounceTimer;

async function fetchVehicleSuggestions() {
  clearTimeout(debounceTimer);
  if (document.getElementById("vehicleReg").value.length < 1) return;
  debounceTimer = setTimeout(async () => {
    const query = document.getElementById("vehicleMakeModel").value.trim();
    if (query.length < 4) return;

    try {
      const payload = { nameQuery: query };
      const suggestionRes = await apiService.searchVehicle(payload);

      if (suggestionRes.success && suggestionRes.data.length > 0) {
        showVehicleSuggestions(suggestionRes.data);
      } else {
        hideVehicleSuggestions();
      }
    } catch (error) {
      console.error("Vehicle Suggestions API Error:", error);
    }
  }, 300);
}

function showVehicleSuggestions(suggestions) {
  const suggestionBox = document.getElementById("vehicleSuggestions");
  suggestionBox.innerHTML = "";
  suggestionBox.style.display = "none";
  if (!suggestions.length) return;

  suggestions.forEach((vehicle) => {
    const div = document.createElement("div");
    div.textContent = `${vehicle.make} ${vehicle.model}`;
    div.classList.add("suggestion-item");
    div.onclick = () => {
      document.getElementById(
        "vehicleMakeModel"
      ).value = `${vehicle.make} ${vehicle.model}`;
      selectedVehicleDetails.vehicleType = vehicle.type;
      selectedVehicleDetails.masterId = vehicle.masterId;
      selectedVehicleDetails.vehicleRegId = null;
      selectedVehicleDetails.vehicleCategoryId = vehicle.vehicleCategoryId;
      hideVehicleSuggestions();
      checkAndFetchTowingInfo();
    };
    suggestionBox.appendChild(div);
  });
  suggestionBox.style.display = "block";
}

function hideVehicleSuggestions() {
  const suggestionBox = document.getElementById("vehicleSuggestions");
  suggestionBox.innerHTML = "";
  suggestionBox.style.display = "none";
}

function enforceVehicleSelection() {
  const inputField = document.getElementById("vehicleMakeModel");

  inputField.addEventListener("blur", () => {
    setTimeout(() => {
      if (!selectedVehicleDetails.masterId || inputField.value.trim() === "") {
        inputField.value = "";
      }
      hideVehicleSuggestions();
    }, 200);
  });

  inputField.addEventListener("input", () => {
    if (!inputField.value.trim()) {
      hideVehicleSuggestions();
    }
  });
}

document.addEventListener("DOMContentLoaded", enforceVehicleSelection);

const geoService = new GeolocationService();
let selectedLocations = {
  pickup: null,
  drop: null,
};

let pickupdistrict = {};
let dropdistrict = {};

let debounceTimeout;
async function getLocationSuggestions(query, suggestionBoxId) {
  clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(async () => {
    const suggestionBox = document.getElementById(suggestionBoxId);
    suggestionBox.innerHTML = "";
    suggestionBox.style.display = "none";

    if (query.length < 2) return;

    suggestionBox.innerHTML = '<div class="suggestion-item">Loading...</div>';
    suggestionBox.style.display = "block";

    try {
      const response = await geoService.searchLocation(query);
      suggestionBox.innerHTML = "";

      if (response.success && response.data.length) {
        response.data.forEach((location) => {
          const div = document.createElement("div");
          div.textContent = location.displayName;
          div.classList.add("suggestion-item");
          div.onclick = () => selectLocation(location, suggestionBoxId);
          suggestionBox.appendChild(div);
        });
        suggestionBox.style.display = "block";
      } else {
        suggestionBox.innerHTML =
          '<div class="suggestion-item">No results found</div>';
      }
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      suggestionBox.innerHTML =
        '<div class="suggestion-item">Error loading suggestions</div>';
    }
  }, 500);
}
window.getLocationSuggestions = getLocationSuggestions;

async function getCurrentLocation(inputId) {
  try {
    const location = await geoService.getCurrentLocation();

    if (!location.success) {
      throw new Error(location.error);
    }

    const result = location.data.result;

    document.getElementById(inputId).value = result.display_name;

    if (inputId === "pickupLocation") {
      selectedLocations.pickup = {
        displayName: location.data.result.display_name || location.data.result,
        coordinates: {
          latitude: location.data.position.coords.latitude,
          longitude: location.data.position.coords.longitude,
        },
      };
      const { latitude, longitude } = selectedLocations.pickup.coordinates;
      getDistrictByLocation({ lat: latitude, lng: longitude }, "pickup").then(
        checkAndFetchTowingInfo
      );
      if (selectedLocations.pickup){
        const suggestionBox = document.getElementById('pickupSuggestions');
        suggestionBox.innerHTML = "";
        suggestionBox.style.display = "none";
      }
    } else {
      selectedLocations.drop = {
        displayName: location.data.result.display_name || location.data.result,
        coordinates: {
          latitude: location.data.position.coords.latitude,
          longitude: location.data.position.coords.longitude,
        },
      };
      const { latitude, longitude } = selectedLocations.drop.coordinates;
      getDistrictByLocation({ lat: latitude, lng: longitude }, "drop").then(checkAndFetchTowingInfo);
      if (selectedLocations.drop){
        const suggestionBox = document.getElementById('dropSuggestions');
        suggestionBox.innerHTML = "";
        suggestionBox.style.display = "none";
      }
    }
  } catch (error) {
    console.error("Error fetching current location:", error);
  }
}
window.getCurrentLocation = getCurrentLocation;

function selectLocation(location, suggestionBoxId) {
  const isPickup = suggestionBoxId === "pickupSuggestions";
  const inputId = isPickup ? "pickupLocation" : "dropLocation";
  document.getElementById(inputId).value = location.displayName;
  if (isPickup) {
    selectedLocations.pickup = location;
    const { latitude: lat, longitude: lng } =
      selectedLocations.pickup.coordinates;
    getDistrictByLocation({ lat, lng }, "pickup").then(checkAndFetchTowingInfo);
  } else {
    selectedLocations.drop = location;
    const { latitude: lat, longitude: lng } =
      selectedLocations.drop.coordinates;
    getDistrictByLocation({ lat, lng }, "drop").then(checkAndFetchTowingInfo);
  }
  document.getElementById(suggestionBoxId).innerHTML = "";
  document.getElementById(suggestionBoxId).style.display = "none";
}

window.selectLocation = selectLocation;

function enforceSelection(inputId, type) {
  const inputField = document.getElementById(inputId);

  inputField.addEventListener("blur", () => {
    const selected = selectedLocations[type];
    if (!selected || inputField.value !== selected.displayName) {
      inputField.value = "";
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  enforceSelection("pickupLocation", "pickup");
  enforceSelection("dropLocation", "drop");
});

async function getDistrictByLocation(pointers, type) {
  try {
    const res = await apiService.getDistrictByPointers(pointers);
    if (res.success) {
      if (type === "pickup") {
        pickupdistrict = res.data;
      } else {
        dropdistrict = res.data;
      }
    } else {
      snackbar.openSnack(res.message, 2000, "snack_error");
    }
  } catch (error) {
    console.error("Error fetching district:", error);
  }
}

// cx_testi
const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll( ".cx_carousel_btns .leftbtn button");
const arrowBtnright = document.querySelectorAll(".cx_carousel_btns .rightbtn button");
const carouselChildrens = [...carousel.children];

let isDragging = false,
  isAutoPlay = true,
  startX,
  startScrollLeft,
  timeoutId;
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

carouselChildrens
  .slice(-cardPerView)
  .reverse()
  .forEach((card) => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  });

carouselChildrens.slice(0, cardPerView).forEach((card) => {
  carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

arrowBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
  });
});
arrowBtnright.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
  });
});

const dragStart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
  if (!isDragging) return;
  carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
};

const infiniteScroll = () => {
  if (carousel.scrollLeft === 0) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  } else if (
    Math.ceil(carousel.scrollLeft) ===
    carousel.scrollWidth - carousel.offsetWidth
  ) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }

  clearTimeout(timeoutId);
  if (!wrapper.matches(":hover")) autoPlay();
};

const autoPlay = () => {
  timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 2500);
};
autoPlay();
carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);

//Faq
const faqs = document.querySelectorAll(".faq");
faqs.forEach((faq) => {
  faq.addEventListener("click", () => {
    if (faq.classList.contains("active")) {
      faq.classList.remove("active");
    } else {
      faqs.forEach((f) => f.classList.remove("active"));
      faq.classList.add("active");
    }
  });
});

function clearInput(inputId) {
  document.getElementById(inputId).value = "";
  if (inputId === "pickupLocation") {
    selectedLocations.pickup = null;
  } else {
    selectedLocations.drop = null;
  }
}
window.clearInput = clearInput;

function preloadImages(urls, callback) {
  let loadedImages = 0;
  let totalImages = urls.length;

  urls.forEach((url, index) => {
    let img = new Image();
    img.src = url.replace(/url\(["']?(.*?)["']?\)/, "$1");
    img.onload = () => {
      loadedImages++;
      if (loadedImages === totalImages) {
        callback();
      }
    };
  });
}

function startBackgroundCarousel() {
  let towingHomeScreen = document.getElementById("towingHomeScreen");
  let images = [
    "url('./assets/images/towing/towing-banner-car.webp')",
    "url('./assets/images/towing/towing-banner-bike.webp')",
  ];
  let index = 0;
  towingHomeScreen.style.backgroundImage = images[0];
  preloadImages(images, () => {
    setInterval(() => {
      index = (index + 1) % images.length;
      towingHomeScreen.style.backgroundImage = images[index];
      towingHomeScreen.style.transition = "background-image 0.5s ease-in-out";
    }, 2000);
  });
}

startBackgroundCarousel();

const startYear = 2016;
const currentYear = new Date().getFullYear();
const experienceYears = currentYear - startYear;
document.getElementById("experienceYears").innerText = experienceYears < 10 ? `0${experienceYears}` : experienceYears;
