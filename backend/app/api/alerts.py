from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Alert, User, AlertPriority, AlertStatus
from app.utils.geolocation import calculate_distance, geocode_address
from datetime import datetime, timedelta
from sqlalchemy import text

alerts_bp = Blueprint('alerts', __name__)

@alerts_bp.route('/', methods=['GET'])
@jwt_required()
def get_alerts():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get query parameters for filtering
    status = request.args.get('status')
    priority = request.args.get('priority')
    blood_type = request.args.get('blood_type')
    
    query = Alert.query
    
    # Apply filters
    if status:
        query = query.filter_by(status=status)
    
    if priority:
        query = query.filter_by(priority=priority)
    
    if blood_type:
        query = query.filter_by(blood_type=blood_type)
    
    # If donor, only show active alerts
    if current_user.role == 'donor':
        query = query.filter_by(status=AlertStatus.ACTIVE.value)
        
        # If donor has blood type specified, show them alerts for their blood type
        if current_user.blood_type:
            query = query.filter_by(blood_type=current_user.blood_type)
    
    # If hospital, show alerts they created and all active alerts
    elif current_user.role == 'hospital':
        # Show created alerts and active alerts
        query = query.filter(
            (Alert.creator_id == current_user_id) | 
            (Alert.status == AlertStatus.ACTIVE.value)
        )
    
    # Sort by priority and creation date
    query = query.order_by(Alert.priority.desc(), Alert.created_at.desc())
    
    alerts = query.all()
    return jsonify([alert.to_dict() for alert in alerts]), 200

@alerts_bp.route('/<int:alert_id>', methods=['GET'])
@jwt_required()
def get_alert(alert_id):
    alert = Alert.query.get(alert_id)
    if not alert:
        return jsonify({'error': 'Alert not found'}), 404
    
    return jsonify(alert.to_dict()), 200

@alerts_bp.route('/', methods=['POST'])
@jwt_required()
def create_alert():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    # Only hospitals can create alerts
    if current_user.role != 'hospital':
        return jsonify({'error': 'Only hospitals can create alerts'}), 403
    
    data = request.get_json()
    
    required_fields = ['blood_type', 'units_needed', 'title']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Set default values for optional fields
    priority = data.get('priority', AlertPriority.MEDIUM.value)
    message = data.get('message', '')
    
    # Calculate expiry date (default: 7 days for medium priority)
    expires_at = None
    if priority == AlertPriority.LOW.value:
        expires_at = datetime.utcnow() + timedelta(days=14)
    elif priority == AlertPriority.MEDIUM.value:
        expires_at = datetime.utcnow() + timedelta(days=7)
    elif priority == AlertPriority.HIGH.value:
        expires_at = datetime.utcnow() + timedelta(days=3)
    elif priority == AlertPriority.EMERGENCY.value:
        expires_at = datetime.utcnow() + timedelta(days=1)
    
    # Override with custom expiry if provided
    if 'expires_at' in data:
        try:
            expires_at = datetime.fromisoformat(data['expires_at'])
        except ValueError:
            return jsonify({'error': 'Invalid expires_at format'}), 400
    
    # Use hospital's name and location if not provided
    hospital_name = data.get('hospital_name', current_user.hospital_name)
    address = data.get('address', current_user.address)
    city = data.get('city', current_user.city)
    state = data.get('state', current_user.state)
    postal_code = data.get('postal_code', current_user.postal_code)
    country = data.get('country', current_user.country)
    
    # Get coordinates from request or geocode the address
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    
    # If coordinates are not provided, try to geocode the address
    if not (latitude and longitude) and address:
        try:
            geocoded = geocode_address(address, city, state, country)
            if geocoded:
                latitude, longitude = geocoded
                current_app.logger.info(f"Geocoded address to: {latitude}, {longitude}")
        except Exception as e:
            current_app.logger.error(f"Geocoding error: {str(e)}")
    
    # Create alert
    alert = Alert(
        creator_id=current_user_id,
        blood_type=data['blood_type'],
        units_needed=data['units_needed'],
        priority=priority,
        status=AlertStatus.ACTIVE.value,
        title=data['title'],
        message=message,
        expires_at=expires_at,
        hospital_name=hospital_name,
        address=address,
        city=city,
        state=state,
        postal_code=postal_code,
        latitude=latitude,
        longitude=longitude
    )
    
    db.session.add(alert)
    db.session.commit()
    
    return jsonify({
        'message': 'Alert created successfully',
        'alert': alert.to_dict()
    }), 201

@alerts_bp.route('/<int:alert_id>', methods=['PUT'])
@jwt_required()
def update_alert(alert_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    alert = Alert.query.get(alert_id)
    if not alert:
        return jsonify({'error': 'Alert not found'}), 404
    
    # Check permissions: only creator or authority can update
    if alert.creator_id != current_user_id and current_user.role != 'authority':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    # Update fields
    updateable_fields = ['blood_type', 'units_needed', 'priority', 'status', 
                         'title', 'message', 'hospital_name', 'address', 
                         'city', 'state', 'postal_code', 'latitude', 'longitude']
    
    for field in updateable_fields:
        if field in data:
            setattr(alert, field, data[field])
    
    # Handle expiry date separately
    if 'expires_at' in data:
        try:
            expires_at = datetime.fromisoformat(data['expires_at'])
            alert.expires_at = expires_at
        except ValueError:
            return jsonify({'error': 'Invalid expires_at format'}), 400
    
    db.session.commit()
    
    return jsonify({
        'message': 'Alert updated successfully',
        'alert': alert.to_dict()
    }), 200

@alerts_bp.route('/<int:alert_id>', methods=['DELETE'])
@jwt_required()
def delete_alert(alert_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    alert = Alert.query.get(alert_id)
    if not alert:
        return jsonify({'error': 'Alert not found'}), 404
    
    # Check permissions: only creator or authority can delete
    if alert.creator_id != current_user_id and current_user.role != 'authority':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    db.session.delete(alert)
    db.session.commit()
    
    return jsonify({'message': 'Alert deleted successfully'}), 200

@alerts_bp.route('/<int:alert_id>/resolve', methods=['PUT'])
@jwt_required()
def resolve_alert(alert_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    alert = Alert.query.get(alert_id)
    if not alert:
        return jsonify({'error': 'Alert not found'}), 404
    
    # Check permissions: only creator or authority can resolve
    if alert.creator_id != current_user_id and current_user.role != 'authority':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    # Update status to resolved
    alert.status = AlertStatus.RESOLVED.value
    db.session.commit()
    
    return jsonify({
        'message': 'Alert resolved successfully',
        'alert': alert.to_dict()
    }), 200

@alerts_bp.route('/nearby', methods=['GET'])
@jwt_required()
def get_nearby_alerts():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get query parameters
    latitude = request.args.get('latitude', type=float)
    longitude = request.args.get('longitude', type=float)
    radius = request.args.get('radius', 20, type=int)  # Default 20 km
    blood_type = request.args.get('blood_type')
    
    if not latitude or not longitude:
        return jsonify({'error': 'Latitude and longitude are required'}), 400
    
    # Use PostgreSQL's native geospatial functionality if available
    try:
        # SQL query using the Haversine formula directly in PostgreSQL
        radius_query = """
            SELECT id FROM alerts
            WHERE status = 'active'
            AND (
                6371 * acos(
                    cos(radians(:latitude)) *
                    cos(radians(latitude)) *
                    cos(radians(longitude) - radians(:longitude)) +
                    sin(radians(:latitude)) *
                    sin(radians(latitude))
                )
            ) <= :radius
        """
        
        # Add blood type filter if specified
        if blood_type:
            radius_query += " AND blood_type = :blood_type"
            nearby_alert_ids = db.session.execute(
                text(radius_query),
                {"latitude": latitude, "longitude": longitude, "radius": radius, "blood_type": blood_type}
            ).all()
        else:
            nearby_alert_ids = db.session.execute(
                text(radius_query),
                {"latitude": latitude, "longitude": longitude, "radius": radius}
            ).all()
        
        # Extract IDs from query result
        alert_ids = [row[0] for row in nearby_alert_ids]
        
        # Fetch full alert objects
        nearby_alerts = Alert.query.filter(Alert.id.in_(alert_ids)).all()
        
    except Exception as e:
        current_app.logger.error(f"PostgreSQL geospatial query error: {str(e)}")
        # Fallback to Python-based calculation if PostgreSQL query fails
        active_alerts = Alert.query.filter_by(status=AlertStatus.ACTIVE.value).all()
        
        # Filter to alerts with coordinates and within radius
        nearby_alerts = []
        for alert in active_alerts:
            if (alert.latitude and alert.longitude and
                (not blood_type or alert.blood_type == blood_type)):
                # Calculate rough distance
                distance = calculate_distance(latitude, longitude, 
                                             alert.latitude, alert.longitude)
                if distance is not None and distance <= radius:
                    nearby_alerts.append(alert)
    
    # Convert alerts to dictionary and add distance
    result = []
    for alert in nearby_alerts:
        distance = calculate_distance(latitude, longitude, alert.latitude, alert.longitude)
        alert_dict = alert.to_dict()
        alert_dict['distance'] = distance
        result.append(alert_dict)
    
    # Sort by distance
    result.sort(key=lambda x: x['distance'])
    
    return jsonify(result), 200