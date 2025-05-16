export class GeolocationService {
    // Constants for configuration
    static NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/reverse';
    static DEFAULT_ZOOM = 10;

    /**
     * Get current location and reverse geocode it
     * @returns {Promise<{success: boolean, data?: {result: Object, position: Position}, error?: string}>}
     */
    async getCurrentLocation() {
        try {
            // Check if geolocation is supported
            if (!navigator.geolocation) {
                throw new Error("Geolocation is not supported by your browser.");
            }

            // Get current position wrapped in a Promise
            const position = await this.getCurrentPosition();

            // Get address details from coordinates
            const locationDetails = await this.reverseGeocode(
                position.coords.latitude,
                position.coords.longitude
            );

            return {
                success: true,
                data: {
                    result: locationDetails,
                    position: position
                }
            };

        } catch (error) {
            console.error('Geolocation error:', error);
            return {
                success: false,
                error: this.getErrorMessage(error)
            };
        }
    }

    /**
     * Wrap getCurrentPosition in a Promise
     * @returns {Promise<Position>}
     */
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        });
    }

    /**
     * Reverse geocode coordinates to get address
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @returns {Promise<Object>}
     */
    async reverseGeocode(lat, lon) {
        const params = new URLSearchParams({
            format: 'json',
            lat: lat.toString(),
            lon: lon.toString(),
            zoom: GeolocationService.DEFAULT_ZOOM.toString(),
            addressdetails: '1'
        });

        const response = await fetch(
            `${GeolocationService.NOMINATIM_BASE_URL}?${params}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'b2c-web/1.0'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * Get user-friendly error message
     * @param {Error|GeolocationPositionError} error 
     * @returns {string}
     */
    getErrorMessage(error) {
        if (error instanceof GeolocationPositionError) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    return "Location access was denied by the user.";
                case error.POSITION_UNAVAILABLE:
                    return "Location information is unavailable.";
                case error.TIMEOUT:
                    return "The request to get location timed out.";
                default:
                    return "An unknown error occurred while getting location.";
            }
        }
        return error.message || "An unexpected error occurred.";
    }


    // Add new constant for search URL
    static NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search';

    // ... (your existing code remains the same) ...

    /**
     * Search for locations based on query string
     * @param {string} searchQuery - The location search query
     * @param {Object} options - Search options (optional)
     * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
     */
    async searchLocation(searchQuery, options = {}) {
        try {
            if (!searchQuery || searchQuery.trim().length < 2) {
                throw new Error("Search query must be at least 2 characters long");
            }

            const defaultOptions = {
                limit: 5,           // Number of results to return
                countrycodes: 'IN',   // Limit to specific countries (comma-separated)
                language: 'en',     // Preferred language for results
                addressdetails: 1   // Include address details in results
            };

            const searchOptions = { ...defaultOptions, ...options };

            const params = new URLSearchParams({
                format: 'json',
                q: searchQuery.trim(),
                limit: searchOptions.limit.toString(),
                'accept-language': searchOptions.language,
                addressdetails: searchOptions.addressdetails.toString()
            });

            // Add country codes if specified
            if (searchOptions.countrycodes) {
                params.append('countrycodes', searchOptions.countrycodes);
            }

            const response = await fetch(
                `${GeolocationService.NOMINATIM_SEARCH_URL}?${params}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'b2c-web/1.0'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const results = await response.json();

            // Transform the results to a more user-friendly format
            const transformedResults = results.map(location => ({
                id: location.place_id,
                displayName: location.display_name,
                coordinates: {
                    latitude: parseFloat(location.lat),
                    longitude: parseFloat(location.lon)
                },
                type: location.type,
                address: location.address || {},
                importance: location.importance,
                boundingBox: location.boundingbox
            }));

            return {
                success: true,
                data: transformedResults
            };

        } catch (error) {
            console.error('Location search error:', error);
            return {
                success: false,
                error: error.message || "An error occurred while searching for locations"
            };
        }
    }
}