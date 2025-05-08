from app import db
from datetime import datetime

class BloodInventory(db.Model):
    __tablename__ = 'blood_inventory'
    
    id = db.Column(db.Integer, primary_key=True)
    hospital_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    blood_type = db.Column(db.String(5), nullable=False)  # A+, A-, B+, B-, AB+, AB-, O+, O-
    units_available = db.Column(db.Integer, default=0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expiry_date = db.Column(db.Date)
    
    def __repr__(self):
        return f'<BloodInventory {self.blood_type} at hospital {self.hospital_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'hospital_id': self.hospital_id,
            'blood_type': self.blood_type,
            'units_available': self.units_available,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None,
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None
        }