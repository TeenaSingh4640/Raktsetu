from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    # Only authorities should be able to see all users
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != 'authority':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    # Optional query parameters for filtering
    role = request.args.get('role')
    query = User.query
    
    if role:
        query = query.filter_by(role=role)
    
    users = query.all()
    return jsonify([user.to_dict() for user in users]), 200

@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    current_user_id = get_jwt_identity()
    
    # Users can see their own profiles, authorities can see any profile
    current_user = User.query.get(current_user_id)
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
        
    if current_user_id != user_id and current_user.role != 'authority':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200

@users_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()
    
    # Users can update their own profiles, authorities can update any profile
    current_user = User.query.get(current_user_id)
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
        
    if current_user_id != user_id and current_user.role != 'authority':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Prevent changing email to an existing one
    if 'email' in data and data['email'] != user.email:
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already in use'}), 409
    
    # Handle password change separately
    if 'password' in data:
        user.set_password(data['password'])
        del data['password']
    
    # Prevent changing role unless you're an authority
    if 'role' in data and data['role'] != user.role and current_user.role != 'authority':
        return jsonify({'error': 'Only authorities can change user roles'}), 403
    
    # Update user fields based on role
    updateable_fields = ['email', 'first_name', 'last_name', 'phone']
    
    if user.role == 'donor':
        updateable_fields.extend(['blood_type', 'dob', 'gender', 
                                'address', 'city', 'state', 'country', 'postal_code'])
    elif user.role == 'hospital':
        updateable_fields.extend(['hospital_name', 'hospital_registration_number', 'hospital_type',
                                'address', 'city', 'state', 'country', 'postal_code'])
    elif user.role == 'authority':
        updateable_fields.extend(['authority_name', 'authority_type', 'jurisdiction'])
    
    # Update fields
    for field in updateable_fields:
        if field in data:
            setattr(user, field, data[field])
    
    db.session.commit()
    
    return jsonify({
        'message': 'User updated successfully',
        'user': user.to_dict()
    }), 200

@users_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    # Only authorities can delete users
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != 'authority':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({'message': 'User deleted successfully'}), 200

@users_bp.route('/donors', methods=['GET'])
@jwt_required()
def get_donors():
    # Hospital and authority users can see donors
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role not in ['hospital', 'authority']:
        return jsonify({'error': 'Unauthorized access'}), 403
    
    donors = User.query.filter_by(role='donor').all()
    return jsonify([donor.to_dict() for donor in donors]), 200

@users_bp.route('/hospitals', methods=['GET'])
@jwt_required()
def get_hospitals():
    # All authenticated users can see hospitals
    hospitals = User.query.filter_by(role='hospital').all()
    return jsonify([hospital.to_dict() for hospital in hospitals]), 200

@users_bp.route('/authorities', methods=['GET'])
@jwt_required()
def get_authorities():
    # All authenticated users can see authorities
    authorities = User.query.filter_by(role='authority').all()
    return jsonify([authority.to_dict() for authority in authorities]), 200