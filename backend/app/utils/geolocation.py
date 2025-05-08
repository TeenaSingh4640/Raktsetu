from geopy.distance import geodesic
import os
import requests
from flask import current_app

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the distance between two points in kilometers using the geodesic distance.
    """
    if not all([lat1, lon1, lat2, lon2]):
        return None
    
    point1 = (lat1, lon1)
    point2 = (lat2, lon2)
    return geodesic(point1, point2).kilometers

def geocode_address(address, city=None, state=None, country=None):
    """
    Convert an address to geographic coordinates using Google Maps API.
    Returns a tuple of (latitude, longitude) or None if geocoding fails.
    """
    api_key = os.environ.get('GOOGLE_MAPS_API_KEY')
    if not api_key:
        current_app.logger.warning("No Google Maps API key found for geocoding")
        return None
    
    # Build the full address string
    address_parts = [part for part in [address, city, state, country] if part]
    full_address = ", ".join(address_parts)
    
    # Make request to Google Maps Geocoding API
    url = f"https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": full_address,
        "key": api_key
    }
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        if data["status"] == "OK" and data["results"]:
            location = data["results"][0]["geometry"]["location"]
            return (location["lat"], location["lng"])
        else:
            current_app.logger.error(f"Geocoding error: {data.get('status')}")
            return None
    except Exception as e:
        current_app.logger.error(f"Geocoding exception: {str(e)}")
        return None