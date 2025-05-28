import { environment } from "./environment.js";

const baseUrl = !environment.isProd ? 'https://vmsmatrix.readyassist.net/api/' : 'https://vms.readyassist.net/api/';

const apis =
{

    common: {
        sendOtp: baseUrl + 'customers/login/v2/dry/web/__send_otps',
        verifyOtp: baseUrl + 'customers/verify-login-otp',
    },


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
    prime: {
        primeWebDetails: baseUrl + 'subscription/plans/prime/web/page',
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

    blogs: {
        blogList: baseUrl + 'blog-poster/published',
        blogDetails: baseUrl + 'blog-poster/by-slug'
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