import os
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

# Database configuration
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_NAME = os.getenv('DB_NAME', 'telegram_miniapp')

# Create database URL
DATABASE_URL = f"mysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

# Create declarative base
Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    telegram_id = Column(Integer, unique=True, nullable=False)
    username = Column(String(255))
    first_name = Column(String(255))
    last_name = Column(String(255))
    language_code = Column(String(10))
    is_premium = Column(Boolean, default=False)
    added_to_attachment_menu = Column(Boolean, default=False)
    launched_webapp = Column(Boolean, default=False)
    first_seen = Column(DateTime, default=datetime.utcnow)
    last_interaction = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

def init_db():
    """Initialize the database, creating all tables if they don't exist."""
    # Create database if it doesn't exist
    create_db_engine = create_engine(f"mysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}")
    try:
        create_db_engine.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
    except Exception as e:
        print(f"Error creating database: {e}")
    finally:
        create_db_engine.dispose()

    # Create all tables
    Base.metadata.create_all(engine)

# Create session factory
Session = sessionmaker(bind=engine)

def get_session():
    """Get a new database session."""
    return Session()

def create_or_update_user(user_data: dict, launched_webapp: bool = False):
    """Create or update user information in the database."""
    session = get_session()
    try:
        user = session.query(User).filter_by(telegram_id=user_data['id']).first()
        
        if user:
            # Update existing user
            for key, value in user_data.items():
                if hasattr(user, key):
                    setattr(user, key, value)
            if launched_webapp:
                user.launched_webapp = True
            user.last_interaction = datetime.utcnow()
        else:
            # Create new user
            user = User(
                telegram_id=user_data['id'],
                username=user_data.get('username'),
                first_name=user_data.get('first_name'),
                last_name=user_data.get('last_name'),
                language_code=user_data.get('language_code'),
                is_premium=user_data.get('is_premium', False),
                added_to_attachment_menu=user_data.get('added_to_attachment_menu', False),
                launched_webapp=launched_webapp
            )
            session.add(user)
        
        session.commit()
        return user
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def mark_webapp_launched(telegram_id: int):
    """Mark that a user has launched the webapp."""
    session = get_session()
    try:
        user = session.query(User).filter_by(telegram_id=telegram_id).first()
        if user:
            user.launched_webapp = True
            user.last_interaction = datetime.utcnow()
            session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()
