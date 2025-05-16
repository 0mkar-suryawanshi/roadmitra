import { environment } from "./environment.js";

const baseUrl = !environment.isProd ? 'https://vmsmatrix.readyassist.net/api/' : 'https://vms.readyassist.net/api/';

const apis =
{

    common: {
        sendOtp: baseUrl + 'customers/login/v2/dry/web/__send_otps',
        verifyOtp: baseUrl + 'customers/verify-login-otp',
    },

    mecplusRewards: baseUrl + 'reward-items/web',

    marketing: {
        campaign: baseUrl + 'digital-marketing-campaign',
    },

    contact: {
        query: baseUrl + 'customers/query-register'
    },

    lead: {
        leadCreate: baseUrl + 'lead-orders/create',
        updateLead: baseUrl + 'lead-orders/update-order'
    },

    subscription: {
        subscriptionList: baseUrl + 'subscription/plans/fetch-plan/b2c',
        subscriptionPlans: baseUrl + 'subscription/plans/details/b2c',
        customerquery: baseUrl + 'customers/query-register',
        customerSubDetails: baseUrl + 'subscription-list/fetch-by/customer',
        subscriptionCertificateDownload: baseUrl + 'subscription-order-book/download-certificate-pdf',
        subscriptionVoucherList: baseUrl + 'subscription-vouchers/fetch/customer/vouchers',
        subscriptionVoucherVerify: baseUrl + 'subscription-vouchers/status-check',
        subscriptionVoucherTag: baseUrl + 'subscription-vouchers/tag-vehicle',
    },

    prime: {
        primeWebDetails: baseUrl + 'subscription/plans/prime/web/page',
    },

    cng: {
        nearestCng: baseUrl + 'fuel-stations/nearest',
        onthewayCng: baseUrl + 'fuel-stations/on-the-way',
        onthewayMultiCng: baseUrl + 'fuel-stations/on-the-way-multi',
    },

    inspection: {
        inspectionServices: baseUrl + 'vehicle-inspection/fetch-service',
        sendOtp: baseUrl + 'customers/login/v2/dry/web/__send_otps',
        verifyOtp: baseUrl + 'customers/verify-login-otp',
        inspectionLead: baseUrl + 'lead-orders/create',
        serviceList: baseUrl + 'vehicle-inspection/get-services-b2c',

        // without auth flow
        taxByLocation: baseUrl + 'vehicle-inspection/gst-calculation/lat-lng',
        sendOtpNew: baseUrl + 'customers/b2c/send-otp',
        verifyOtpNew: baseUrl + 'customers/b2c/verify-otp',
        vhExistCheckAdd: baseUrl + 'customer-vehicle-mapping/add-customer-vehicle',
    },

    vehicle: {
        vehicleList: baseUrl + 'customers/fetch-vehicle-make-model',
        customerVehicle: baseUrl + 'customers/fetch-customer-vehicle-details',
        createVehicle: baseUrl + 'customer-vehicle-mapping/add-customer-vehicle',
        checkIsExist: baseUrl + 'vehicle-registered/find/is-exist',
        searchVehicle: baseUrl + 'vehicle/master/vehicle-search-by-name'
    },

    rto: {
        isExist: baseUrl + 'rto-vehicle-data/fetch-inspection'
    },

    location: {
        taxByCoordinates: baseUrl + 'orders/gst-calculation/lat-lng',
        districtByCoordinates: baseUrl + 'district/get-by-points'
    },

    order: {
        createOrder: baseUrl + 'orders/new',
    },

    customer: {
        nameFromUpi: baseUrl + 'user/vpa/check'
    },

    careers: {
        jobs: 'https://api.hiringbull.com/api/Jobs/GetBasicList'
    },

    services: {
        fitment: baseUrl + 'service/fitment-services',
        productList: baseUrl + 'workshop-inventory-items/fetch-items/by-district',
        createOrder: baseUrl + 'orders/workshop/create',
        bikeGeneralService: baseUrl + 'customers/fetch-service-details',
        availableSlots: baseUrl + 'customers/orders/available-slots',
    },

    generalService: {
        serviceDetails: baseUrl + 'service/gen-service-details'
    },

    news: {
        newsList: baseUrl + 'news/fetch/b2c'
    },

    blogs: {
        blogList: baseUrl + 'blog-poster/published',
        blogDetails: baseUrl + 'blog-poster/by-slug'
    },

    assessment: {
        assessmentQuestion: 'https://script.google.com/macros/s/AKfycbzHGTpUz6FTbd-KsYcWUK45mOB0G6ft3DipEPaHLGvVFJykjZ06v3Zar-9FLrTLWAK7/exec',
        assessmentResultUpdate: 'https://script.google.com/macros/s/AKfycbx5_TQXklzQn0gmrZRw88SjUK58obMybN5kEU4tbH6BLR68s7F64d5L_-Q-9NFPCf00/exec',
        // assessmentResultUpdate: 'https://script.google.com/macros/s/AKfycbxJ9TamKov0H5Lg6yTyhqAtkRjcQ2sxqeZ5YrDGbWvriP2J188y-OltM1bEWFZJ-Udb/exec',
        assessmentMailSend: baseUrl + 'blog-poster/send-assessment-result',
    },

    assessmentCollege: {
        assessmentQuestion1: "https://script.google.com/macros/s/AKfycbyYp4h1WElFcxbpf1y6ON8bGYq9j2DK3a2xg1j16XlE263v7738QzmkwH7GZU3mIeDtxA/exec",
        assessmentQuestion2: "https://script.google.com/macros/s/AKfycbwWSmH1e5edD-kH8_CgX9wxdHdwxSP6RnmYgACCZIQHkh0jCaHkYXAzU4o4dfok--G2uQ/exec",
        assessmentQuestion3: "https://script.google.com/macros/s/AKfycbxyn3M9PveCzwkXnSF2UEEPy_3RyVjZaxs65Oq0CBtJZczgmgw7ZK6p1Ks3sp7MXd7kFQ/exec",
        assessmentResultUpdate1: "https://script.google.com/macros/s/AKfycbw9Va4cpO7s-HwhwcSn4LvKrcs4oVVoWh-E_bDLOLdT0C-9SVb3SGXhfgFbsDT8A5IYIw/exec",
        assessmentResultUpdate2: "https://script.google.com/macros/s/AKfycbyR5Pnmf7ujf71STo1VQ-zE4D5sD4bOLMSDW_4fIcBZmEgFJILScdFwyPCbqt-ImIIyyg/exec",
        assessmentResultUpdate3: "https://script.google.com/macros/s/AKfycbwlKRDIHiDa3PD488ekGtTwPlZDsN5I6HhK-CFkk1HNEvQPpT2zHwNNZyThgJNJJ4lrNg/exec",
    },
    
    towing: {
       towingDetails: baseUrl + 'orders/towing-service-details',
       towingDetailsNoAuth: baseUrl + 'orders/tow-service-info',
    },

    availability: {
        check: baseUrl + 'ondemand-service-availability/check'
    },

    razorPay: {
        getRefId: baseUrl + 'orders/fetch-razorpay-refId'
    },

}

export default apis;