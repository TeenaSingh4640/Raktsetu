from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import BloodInventory, User
from datetime import datetime, date

inventory_bp = Blueprint('blood_inventory', __name__)

@inventory_bp.route('/', methods=['GET'])
@jwt_required()
def get_inventory():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    # Filter by hospital if specified
    hospital_id = request.args.get('hospital_id', type=int)
    blood_type = request.args.get('blood_type')
    
    query = BloodInventory.query
    
    # Apply filters based on role
    if current_user.role == 'hospital':
        # Hospitals can only see their own inventory
        query = query.filter_by(hospital_id=current_user_id)
    elif current_user.role == 'authority':
        # Authorities can filter by hospital
        if hospital_id:
            query = query.filter_by(hospital_id=hospital_id)
    elif current_user.role == 'donor':
        # Donors can see all inventory but no filtering
        pass
    
    # Filter by blood type if specified
    if blood_type:
        query = query.filter_by(blood_type=blood_type)
    
    inventory_items = query.all()
    return jsonify([item.to_dict() for item in inventory_items]), 200

@inventory_bp.route('/<int:inventory_id>', methods=['GET'])
@jwt_required()
def get_inventory_item(inventory_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    inventory_item = BloodInventory.query.get(inventory_id)
    if not inventory_item:
        return jsonify({'error': 'Inventory item not found'}), 404
    
    # Hospitals can only view their own inventory
    if current_user.role == 'hospital' and inventory_item.hospital_id != current_user_id:
        return jsonify({'error': 'Unauthorized access'}), 403
    
    return jsonify(inventory_item.to_dict()), 200

@inventory_bp.route('/', methods=['POST'])
@jwt_required()
def create_inventory_item():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    # Only hospitals and authorities can add inventory
    if current_user.role not in ['hospital', 'authority']:
        return jsonify({'error': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    required_fields = ['blood_type', 'units_available']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Determine hospital_id based on who's creating
    hospital_id = data.get('hospital_id')
    
    if current_user.role == 'hospital':
        hospital_id = current_user_id
    elif not hospital_id:
        return jsonify({'error': 'hospital_id is required for authorities'}), 400
    
    # Validate that the hospital exists
    hospital = User.query.filter_by(id=hospital_id, role='hospital').first()
    if not hospital:
        return jsonify({'error': 'Hospital not found'}), 404
    
    # Check if an inventory entry for this blood type at this hospital already exists
    existing_inventory = BloodInventory.query.filter_by(
        hospital_id=hospital_id, 
        blood_type=data['blood_type']
    ).first()
    
    if existing_inventory:
        return jsonify({
            'error': 'Inventory for this blood type already exists. Use PUT to update.'
        }), 409
    
    # Parse expiry date if provided
    expiry_date = None
    if 'expiry_date' in data:
        try:
            expiry_date = date.fromisoformat(data['expiry_date'])
        except ValueError:
            return jsonify({'error': 'Invalid expiry_date format'}), 400
    
    # Create inventory item
    inventory_item = BloodInventory(
        hospital_id=hospital_id,
        blood_type=data['blood_type'],
        units_available=data['units_available'],
        expiry_date=expiry_date
    )
    
    db.session.add(inventory_item)
    db.session.commit()
    
    return jsonify({
        'message': 'Blood inventory created successfully',
        'inventory': inventory_item.to_dict()
    }), 201

@inventory_bp.route('/<int:inventory_id>', methods=['PUT'])
@jwt_required()
def update_inventory(inventory_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    inventory_item = BloodInventory.query.get(inventory_id)
    if not inventory_item:
        return jsonify({'error': 'Inventory item not found'}), 404
    
    # Check permissions
    if current_user.role == 'hospital' and inventory_item.hospital_id != current_user_id:
        return jsonify({'error': 'Unauthorized access'}), 403
    elif current_user.role not in ['hospital', 'authority']:
        return jsonify({'error': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    # Update fields
    updateable_fields = ['units_available']
    for field in updateable_fields:
        if field in data:
            setattr(inventory_item, field, data[field])
    
    # Parse expiry date if provided
    if 'expiry_date' in data:
        try:
            expiry_date = date.fromisoformat(data['expiry_date'])
            inventory_item.expiry_date = expiry_date
        except ValueError:
            return jsonify({'error': 'Invalid expiry_date format'}), 400
    
    # Update last_updated automatically
    inventory_item.last_updated = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({
        'message': 'Inventory updated successfully',
        'inventory': inventory_item.to_dict()
    }), 200

@inventory_bp.route('/<int:inventory_id>', methods=['DELETE'])
@jwt_required()
def delete_inventory(inventory_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role not in ['hospital', 'authority']:
        return jsonify({'error': 'Unauthorized access'}), 403
    
    inventory_item = BloodInventory.query.get(inventory_id)
    if not inventory_item:
        return jsonify({'error': 'Inventory item not found'}), 404
    
    # Hospitals can only delete their own inventory
    if current_user.role == 'hospital' and inventory_item.hospital_id != current_user_id:
        return jsonify({'error': 'Unauthorized access'}), 403
    
    db.session.delete(inventory_item)
    db.session.commit()
    
    return jsonify({'message': 'Inventory deleted successfully'}), 200

@inventory_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_inventory_summary():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get total available units by blood type
    blood_types = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    summary = {}
    
    for blood_type in blood_types:
        query = db.session.query(db.func.sum(BloodInventory.units_available))
        
        # Filter by hospital for hospital role
        if current_user.role == 'hospital':
            query = query.filter(BloodInventory.hospital_id == current_user_id)
            
        query = query.filter(BloodInventory.blood_type == blood_type)
        total_units = query.scalar() or 0
        
        summary[blood_type] = total_units
    
    return jsonify(summary), 200

@inventory_bp.route('/hospital/<int:hospital_id>', methods=['GET'])
@jwt_required()
def get_hospital_inventory(hospital_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    # Verify the hospital exists
    hospital = User.query.filter_by(id=hospital_id, role='hospital').first()
    if not hospital:
        return jsonify({'error': 'Hospital not found'}), 404
    
    # Hospitals can only view their own inventory
    if current_user.role == 'hospital' and hospital_id != current_user_id:
        return jsonify({'error': 'Unauthorized access'}), 403
    
    inventory_items = BloodInventory.query.filter_by(hospital_id=hospital_id).all()
    
    return jsonify([item.to_dict() for item in inventory_items]), 200