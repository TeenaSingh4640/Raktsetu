from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Donation, User, DonationStatus
from datetime import datetime

donations_bp = Blueprint('donations', __name__)

@donations_bp.route('/', methods=['GET'])
@jwt_required()
def get_donations():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    # Filter by status, date range if provided
    status = request.args.get('status')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = Donation.query
    
    # Role-based filtering
    if current_user.role == 'donor':
        # Donors can only see their own donations
        query = query.filter_by(donor_id=current_user_id)
    elif current_user.role == 'hospital':
        # Hospitals can only see donations made to them
        query = query.filter_by(hospital_id=current_user_id)
    elif current_user.role != 'authority':
        # Authorities can see all donations
        return jsonify({'error': 'Unauthorized access'}), 403
    
    # Apply filters
    if status:
        query = query.filter_by(status=status)
    
    if start_date:
        try:
            start = datetime.fromisoformat(start_date)
            query = query.filter(Donation.appointment_date >= start)
        except ValueError:
            return jsonify({'error': 'Invalid start_date format'}), 400
    
    if end_date:
        try:
            end = datetime.fromisoformat(end_date)
            query = query.filter(Donation.appointment_date <= end)
        except ValueError:
            return jsonify({'error': 'Invalid end_date format'}), 400
    
    donations = query.all()
    return jsonify([donation.to_dict() for donation in donations]), 200

@donations_bp.route('/<int:donation_id>', methods=['GET'])
@jwt_required()
def get_donation(donation_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    donation = Donation.query.get(donation_id)
    if not donation:
        return jsonify({'error': 'Donation not found'}), 404
    
    # Check permissions
    if (current_user.role == 'donor' and donation.donor_id != current_user_id) or \
       (current_user.role == 'hospital' and donation.hospital_id != current_user_id) and \
       current_user.role != 'authority':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    return jsonify(donation.to_dict()), 200

@donations_bp.route('/', methods=['POST'])
@jwt_required()
def create_donation():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    # Only donors or hospitals can create donations
    if current_user.role not in ['donor', 'hospital']:
        return jsonify({'error': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    required_fields = ['appointment_date', 'blood_type']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Determine donor_id and hospital_id based on who's creating
    donor_id = data.get('donor_id', None)
    hospital_id = data.get('hospital_id', None)
    
    if current_user.role == 'donor':
        donor_id = current_user_id
        if not hospital_id:
            return jsonify({'error': 'hospital_id is required for donors'}), 400
    else:  # hospital role
        hospital_id = current_user_id
        if not donor_id:
            return jsonify({'error': 'donor_id is required for hospitals'}), 400
    
    # Validate that the donor and hospital exist
    donor = User.query.filter_by(id=donor_id, role='donor').first()
    if not donor:
        return jsonify({'error': 'Donor not found'}), 404
    
    hospital = User.query.filter_by(id=hospital_id, role='hospital').first()
    if not hospital:
        return jsonify({'error': 'Hospital not found'}), 404
    
    # Parse appointment date
    try:
        appointment_date = datetime.fromisoformat(data['appointment_date'])
    except ValueError:
        return jsonify({'error': 'Invalid appointment_date format'}), 400
    
    # Create donation
    donation = Donation(
        donor_id=donor_id,
        hospital_id=hospital_id,
        appointment_date=appointment_date,
        blood_type=data['blood_type'],
        status=DonationStatus.SCHEDULED.value,
        notes=data.get('notes', '')
    )
    
    db.session.add(donation)
    db.session.commit()
    
    return jsonify({
        'message': 'Donation scheduled successfully',
        'donation': donation.to_dict()
    }), 201

@donations_bp.route('/<int:donation_id>', methods=['PUT'])
@jwt_required()
def update_donation(donation_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user:
        return jsonify({'error': 'User not found'}), 404
    
    donation = Donation.query.get(donation_id)
    if not donation:
        return jsonify({'error': 'Donation not found'}), 404
    
    # Check permissions
    if ((current_user.role == 'donor' and donation.donor_id != current_user_id) or 
        (current_user.role == 'hospital' and donation.hospital_id != current_user_id)) and \
        current_user.role != 'authority':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    data = request.get_json()
    
    # Different fields can be updated by different roles
    if current_user.role == 'donor':
        # Donors can only cancel their appointment
        if 'status' in data and data['status'] == DonationStatus.CANCELLED.value:
            donation.status = data['status']
        else:
            return jsonify({'error': 'Donors can only cancel donations'}), 403
            
    elif current_user.role in ['hospital', 'authority']:
        # Hospitals can update all fields
        updateable_fields = ['status', 'notes', 'amount_ml', 'hemoglobin', 
                            'blood_pressure', 'pulse', 'temperature']
                            
        # Parse appointment date if provided
        if 'appointment_date' in data:
            try:
                appointment_date = datetime.fromisoformat(data['appointment_date'])
                donation.appointment_date = appointment_date
            except ValueError:
                return jsonify({'error': 'Invalid appointment_date format'}), 400
        
        # Update status with special handling
        if 'status' in data:
            donation.status = data['status']
            if data['status'] == DonationStatus.COMPLETED.value:
                donation.completed_at = datetime.utcnow()
        
        # Update other fields
        for field in updateable_fields:
            if field in data and field != 'status':  # status already handled
                setattr(donation, field, data[field])
    
    db.session.commit()
    
    return jsonify({
        'message': 'Donation updated successfully',
        'donation': donation.to_dict()
    }), 200

@donations_bp.route('/<int:donation_id>', methods=['DELETE'])
@jwt_required()
def delete_donation(donation_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if not current_user or current_user.role != 'authority':
        return jsonify({'error': 'Unauthorized access'}), 403
    
    donation = Donation.query.get(donation_id)
    if not donation:
        return jsonify({'error': 'Donation not found'}), 404
    
    db.session.delete(donation)
    db.session.commit()
    
    return jsonify({'message': 'Donation deleted successfully'}), 200