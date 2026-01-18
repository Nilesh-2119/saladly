"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface LocationSelectorProps {
    onLocationSelect: (location: {
        lat: number;
        lng: number;
        address: string;
    }) => void;
}

export default function LocationSelector({
    onLocationSelect,
}: LocationSelectorProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const [mapLoaded, setMapLoaded] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<{
        lat: number;
        lng: number;
        address: string;
    } | null>(null);
    const [error, setError] = useState("");

    // Default location (Pune, India)
    const defaultCenter = { lat: 18.5204, lng: 73.8567 };

    // Reverse geocode
    const reverseGeocode = useCallback((lat: number, lng: number) => {
        if (!window.google?.maps?.Geocoder) return;
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results?.[0]) {
                setSelectedLocation({ lat, lng, address: results[0].formatted_address });
            } else {
                setSelectedLocation({ lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
            }
        });
    }, []);

    // Initialize map once Google is ready
    const initializeMap = useCallback(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        const map = new google.maps.Map(mapContainerRef.current, {
            center: defaultCenter,
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
        });
        mapInstanceRef.current = map;

        const marker = new google.maps.Marker({
            position: defaultCenter,
            map,
            draggable: true,
        });
        markerRef.current = marker;

        marker.addListener("dragend", () => {
            const pos = marker.getPosition();
            if (pos) reverseGeocode(pos.lat(), pos.lng());
        });

        map.addListener("click", (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                marker.setPosition(e.latLng);
                reverseGeocode(e.latLng.lat(), e.latLng.lng());
            }
        });

        // Places Autocomplete
        if (searchInputRef.current && google.maps.places) {
            const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
                componentRestrictions: { country: "in" },
                fields: ["formatted_address", "geometry"],
            });
            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (place.geometry?.location) {
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();
                    map.setCenter({ lat, lng });
                    map.setZoom(17);
                    marker.setPosition({ lat, lng });
                    setSelectedLocation({ lat, lng, address: place.formatted_address || "" });
                }
            });
        }

        reverseGeocode(defaultCenter.lat, defaultCenter.lng);
        setMapLoaded(true);
    }, [reverseGeocode]);

    // Load script + init
    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
            setError("Missing API key in .env.local");
            return;
        }

        // If already loaded
        if (window.google?.maps) {
            initializeMap();
            return;
        }

        // Check if script tag already exists
        if (document.querySelector('script[src*="maps.googleapis.com"]')) {
            // Poll until google.maps is available
            const interval = setInterval(() => {
                if (window.google?.maps) {
                    clearInterval(interval);
                    initializeMap();
                }
            }, 200);
            return () => clearInterval(interval);
        }

        // Load script
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.onload = () => initializeMap();
        script.onerror = () => setError("Failed to load Google Maps");
        document.head.appendChild(script);
    }, [initializeMap]);

    // GPS
    const useGPS = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude: lat, longitude: lng } = pos.coords;
                if (mapInstanceRef.current && markerRef.current) {
                    mapInstanceRef.current.setCenter({ lat, lng });
                    mapInstanceRef.current.setZoom(17);
                    markerRef.current.setPosition({ lat, lng });
                    reverseGeocode(lat, lng);
                }
                setIsLocating(false);
            },
            (err) => {
                setIsLocating(false);
                alert(err.code === 1 ? "Location access denied" : "Could not get location");
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const confirmLocation = () => {
        if (selectedLocation) onLocationSelect(selectedLocation);
    };

    return (
        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
            {/* Search */}
            <div className="p-3 border-b border-gray-100">
                <div className="relative">
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search for area, street or building..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Map */}
            <div className="relative h-[350px] bg-gray-100">
                {error ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-50 p-6 z-20">
                        <div className="text-center">
                            <p className="text-red-600 font-medium mb-2">⚠️ {error}</p>
                            <code className="text-xs bg-white p-2 rounded block">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key</code>
                        </div>
                    </div>
                ) : !mapLoaded ? (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-center">
                            <svg className="w-8 h-8 text-primary animate-spin mx-auto" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <p className="text-sm text-gray-500 mt-2">Loading map...</p>
                        </div>
                    </div>
                ) : null}

                <div ref={mapContainerRef} className="w-full h-full" />

                {selectedLocation && mapLoaded && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-xl p-3 shadow-lg z-20">
                        <p className="text-sm font-medium">📍 Selected Location</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{selectedLocation.address}</p>
                    </div>
                )}
            </div>

            {/* Buttons */}
            <div className="p-4 space-y-3">
                <button
                    onClick={confirmLocation}
                    disabled={!selectedLocation}
                    className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                    Confirm Location
                </button>
                <button
                    onClick={useGPS}
                    disabled={isLocating || !mapLoaded}
                    className="w-full py-3.5 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isLocating ? (
                        <>
                            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Locating...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Use Current Location
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
