from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app import db
from app.models import User
from datetime import datetime, timezone

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['email', 'password', 'role']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Check if email already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409
    
    # Create new user
    new_user = User(
        email=data['email'],
        role=data['role']
    )
    new_user.set_password(data['password'])
    
    # Add role-specific fields
    if data['role'] == 'donor':
        fields = ['first_name', 'last_name', 'blood_type', 'dob', 'gender', 
                 'phone', 'address', 'city', 'state', 'country', 'postal_code']
        for field in fields:
            if field in data:
                setattr(new_user, field, data[field])
                
    elif data['role'] == 'hospital':
        fields = ['hospital_name', 'hospital_registration_number', 'hospital_type', 
                 'phone', 'address', 'city', 'state', 'country', 'postal_code']
        for field in fields:
            if field in data:
                setattr(new_user, field, data[field])
                
    elif data['role'] == 'authority':
        fields = ['authority_name', 'authority_type', 'jurisdiction', 'phone']
        for field in fields:
            if field in data:
                setattr(new_user, field, data[field])
    else:
        return jsonify({'error': 'Invalid role specified'}), 400
    
    # Save to database
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully', 'user_id': new_user.id}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Create tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    current_user_id = get_jwt_identity()
    access_token = create_access_token(identity=current_user_id)
    return jsonify({'access_token': access_token}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_user_info():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200