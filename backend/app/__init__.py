from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config=None):
    app = Flask(__name__)
    
    # Configure the app
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///raktsetu.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
    
    if config:
        app.config.update(config)
    
    # Initialize extensions with app
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Import models to ensure they're registered with SQLAlchemy
    # This is important for migrations to work properly
    from app.models.user import User
    from app.models.donation import Donation
    from app.models.blood_inventory import BloodInventory
    from app.models.alert import Alert
    
    # Register blueprints/routes
    from app.api.auth import auth_bp
    from app.api.users import users_bp
    from app.api.donations import donations_bp
    from app.api.blood_inventory import inventory_bp
    from app.api.alerts import alerts_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(donations_bp, url_prefix='/api/donations')
    app.register_blueprint(inventory_bp, url_prefix='/api/inventory')
    app.register_blueprint(alerts_bp, url_prefix='/api/alerts')
    
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()
    
    return app