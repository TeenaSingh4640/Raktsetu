from app import db
from datetime import datetime
from enum import Enum

class DonationStatus(Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"

class Donation(db.Model):
    __tablename__ = 'donations'
    
    id = db.Column(db.Integer, primary_key=True)
    donor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    hospital_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    appointment_date = db.Column(db.DateTime, nullable=False)
    blood_type = db.Column(db.String(5), nullable=False)
    amount_ml = db.Column(db.Integer)  # Amount in milliliters
    status = db.Column(db.String(20), default=DonationStatus.SCHEDULED.value)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    # Medical information
    hemoglobin = db.Column(db.Float)
    blood_pressure = db.Column(db.String(20))
    pulse = db.Column(db.Integer)
    temperature = db.Column(db.Float)
    
    notes = db.Column(db.Text)
    
    # Relationships
    hospital = db.relationship('User', foreign_keys=[hospital_id], backref='received_donations', lazy=True)
    
    def __repr__(self):
        return f'<Donation {self.id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'donor_id': self.donor_id,
            'hospital_id': self.hospital_id,
            'appointment_date': self.appointment_date.isoformat() if self.appointment_date else None,
            'blood_type': self.blood_type,
            'amount_ml': self.amount_ml,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'hemoglobin': self.hemoglobin,
            'blood_pressure': self.blood_pressure,
            'pulse': self.pulse,
            'temperature': self.temperature,
            'notes': self.notes
        }