from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # donor, hospital, authority
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    phone = db.Column(db.String(15))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Role-specific fields
    # For donors
    blood_type = db.Column(db.String(5))
    dob = db.Column(db.Date)
    gender = db.Column(db.String(10))
    address = db.Column(db.String(255))
    city = db.Column(db.String(50))
    state = db.Column(db.String(50))
    country = db.Column(db.String(50))
    postal_code = db.Column(db.String(20))
    
    # For hospitals
    hospital_name = db.Column(db.String(100))
    hospital_registration_number = db.Column(db.String(50))
    hospital_type = db.Column(db.String(50))  # government, private, etc.
    
    # For authorities
    authority_name = db.Column(db.String(100))
    authority_type = db.Column(db.String(50))  # blood bank authority, health department, etc.
    jurisdiction = db.Column(db.String(100))
    
    # Relationships
    donations = db.relationship('Donation', backref='donor', lazy=True, 
                               foreign_keys='Donation.donor_id')
    inventory_items = db.relationship('BloodInventory', backref='hospital', lazy=True)
    alerts_created = db.relationship('Alert', backref='creator', lazy=True, 
                                    foreign_keys='Alert.creator_id')
    
    def __repr__(self):
        return f'<User {self.email}>'
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        user_dict = {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        
        # Add role-specific fields
        if self.role == 'donor':
            user_dict.update({
                'blood_type': self.blood_type,
                'dob': self.dob.isoformat() if self.dob else None,
                'gender': self.gender,
                'address': self.address,
                'city': self.city,
                'state': self.state,
                'country': self.country,
                'postal_code': self.postal_code,
            })
        elif self.role == 'hospital':
            user_dict.update({
                'hospital_name': self.hospital_name,
                'hospital_registration_number': self.hospital_registration_number,
                'hospital_type': self.hospital_type,
                'address': self.address,
                'city': self.city,
                'state': self.state,
                'country': self.country,
                'postal_code': self.postal_code,
            })
        elif self.role == 'authority':
            user_dict.update({
                'authority_name': self.authority_name,
                'authority_type': self.authority_type,
                'jurisdiction': self.jurisdiction,
            })
            
        return user_dict