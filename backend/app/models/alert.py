from app import db
from datetime import datetime
from enum import Enum

class AlertPriority(Enum):
    LOW = "low"
    MEDIUM = "medium" 
    HIGH = "high"
    EMERGENCY = "emergency"

class AlertStatus(Enum):
    ACTIVE = "active"
    RESOLVED = "resolved"
    EXPIRED = "expired"

class Alert(db.Model):
    __tablename__ = 'alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    blood_type = db.Column(db.String(5), nullable=False)
    units_needed = db.Column(db.Integer, nullable=False)
    priority = db.Column(db.String(20), nullable=False, default=AlertPriority.MEDIUM.value)
    status = db.Column(db.String(20), nullable=False, default=AlertStatus.ACTIVE.value)
    
    title = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at = db.Column(db.DateTime)
    
    # Location information
    hospital_name = db.Column(db.String(100))
    address = db.Column(db.String(200))
    city = db.Column(db.String(50))
    state = db.Column(db.String(50))
    postal_code = db.Column(db.String(20))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    
    def __repr__(self):
        return f'<Alert {self.id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'creator_id': self.creator_id,
            'blood_type': self.blood_type,
            'units_needed': self.units_needed,
            'priority': self.priority,
            'status': self.status,
            'title': self.title,
            'message': self.message,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'hospital_name': self.hospital_name,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'postal_code': self.postal_code,
            'latitude': self.latitude,
            'longitude': self.longitude
        }