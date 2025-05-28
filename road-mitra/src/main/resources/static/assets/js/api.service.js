import apis from "./apiConfig.js";

const withToken = {
    headers: {
        "Content-Type": "application/json",
        Authorization: '',
    }
};

export class ApiService {
    constructor() {
        const token = sessionStorage.getItem('cxToken');
        withToken.headers.Authorization = `Bearer ${token}`;  
    }

    async saveToken(token) {
        withToken.headers.Authorization = `Bearer ${token}`;
    }

    async createLeadOrder(payload) {
        try {
            const res = await fetch(apis.lead.leadCreate, {
                method: 'POST',
                headers: withToken.headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch (error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async sendOtp(payload) {
        try {
            const res = await fetch(apis.inspection.sendOtp, {
                method: 'POST',
                headers: withToken.headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch (error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async verifyOtp(payload) {
        try {
            const res = await fetch(apis.inspection.verifyOtp, {
                method: 'POST',
                headers: withToken.headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch (error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    // customer vehicle
    async getVehicleList(id) {
        const queryParams = new URLSearchParams({ userId: id }).toString();
        try {
            const res = await fetch(`${apis.vehicle.customerVehicle}?${queryParams}`, {
                method: 'GET',
                headers: withToken.headers
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch (error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async getAllVehicle(nameText) {
        const queryParams = new URLSearchParams({ type: ['CAR'], mode: 'vehicleName', searchQuery: nameText, }).toString();
        try {
            const res = await fetch(`${apis.vehicle.vehicleList}?${queryParams}`, {
                method: 'GET',
                headers: withToken.headers
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch (error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async checkIsVehicleExist(regNo) {
        const queryParams = new URLSearchParams(regNo).toString();
        try {
            const res = await fetch(`${apis.vehicle.checkIsExist}?${queryParams}`, {
                method: 'GET',
                headers: withToken.headers
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch (error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async createVehicle(payload) {
        try {
            const res = await fetch(apis.vehicle.createVehicle, {
                method: 'POST',
                headers: withToken.headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch (error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async fetchTaxDetails(payload) {
        try {
            const res = await fetch(apis.location.taxByCoordinates, {
                method: 'POST',
                headers: withToken.headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch (error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async getDistrictByPointers(pointers) {
        try {
            const res = await fetch(`${apis.location.districtByCoordinates}/${pointers.lat}/${pointers.lng}`,{
                method: 'GET',
                headers: withToken.headers,
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch(error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async createOrder(payload) {
        try {
            const res = await fetch(apis.order.createOrder, {
                method: 'POST',
                headers: withToken.headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch(error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async getRazorPaymentId(payload) {
        try {
            const res = await fetch(`${apis.razorPay.getRefId}?orderId=${payload.orderId}`, {
                method: 'GET',
                headers: withToken.headers
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();;
        } catch(error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async searchVehicle(payload) {
        try {
            const res = await fetch(apis.vehicle.searchVehicle, {
                method: 'POST',
                headers: withToken.headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch(error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async checkVehicleExistRto(payload) {
        try {
            const res = await fetch(apis.rto.isExist, {
                method: 'POST',
                headers: withToken.headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch(error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async getNameFromUpi(payload) {
        try {
            const res = await fetch(apis.customer.nameFromUpi, {
                method: 'POST',
                headers: withToken.headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch(error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async fetchTaxDetailsByLocation(payload) {
        try {
            const res = await fetch(apis.inspection.taxByLocation, {
                method: 'POST',
                headers: withToken.headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch (error) {
            // Handle network errors or unexpected exceptions
            return {
                success: false,
                message: error.message || 'An unexpected error occurred'
            };
        }
    }
    
    async inspectionSendOtp(payload) {
        try {
            const res = await fetch(apis.inspection.sendOtpNew, {
                method: 'POST',
                headers: withToken.headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch(error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async inspectionVerifyOtp(payload) {    
        try {
            const res = await fetch(apis.inspection.verifyOtpNew, {
                method: 'POST',
                headers: withToken.headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch(error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async vhExistCheckAdd(payload) {
        try {
            const res = await fetch(apis.inspection.vhExistCheckAdd, {
                method: 'POST',
                headers: withToken.headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch(error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }


    async fetchFitmentService(payload) {
        try {
            const res = await fetch(apis.services.fitment, {
                method: 'POST',
                headers: withToken.headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch(error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async getBikeGeneralServices(params) {
        const queryParams = new URLSearchParams(params).toString();
        try {
            const res = await fetch(`${apis.services.bikeGeneralService}?${queryParams}`, {
                method: 'GET',
                headers: withToken.headers,
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch (error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async updateLeadOrder(payload) {
        try {
            const res = await fetch(apis.lead.updateLead, {
                method: 'PUT',
                headers: withToken.headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch (error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async towingPriceCalculator(payload) {
        try {
            const res = await fetch(apis.towing.towingDetails, {
                method: 'POST',
                headers: withToken.headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch (error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async towingPriceDisplay(payload) {
        try {
            const res = await fetch(apis.towing.towingDetailsNoAuth, {
                method: 'POST',
                headers: withToken.headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch (error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    async onDemandCheck(payload) {
        try {
            const res = await fetch(apis.availability.check, {
                method: 'POST',
                headers: withToken.headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch (error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

    

    async fetchAvailableSlots(payload) {
        try {
            const res = await fetch(apis.services.availableSlots, {
                method: 'POST',
                headers: withToken.headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return {
                    success: false,
                    message: `Error ${res.status}: ${res.statusText}`
                };
            }
            return await res.json();
        } catch (error) {
            return {
                success: false,
                message: error.message || 'An error occurred'
            };
        }
    }

}
