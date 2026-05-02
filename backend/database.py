from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, JSON, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

# 1. Database Location (SQLite file)
SQLALCHEMY_DATABASE_URL = "sqlite:///./healthway.db"

# 2. Setup Engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# 3. Define the Analysis Table (The actual Database structure)
class AnalysisRecord(Base):
    __tablename__ = "analysis_records"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    filename = Column(String)
    diagnosis = Column(String)
    confidence = Column(Float)
    risk_level = Column(String)
    observations = Column(JSON)  # Stores the detailed findings as a list
    raw_data = Column(Text, nullable=True) # For any extra technical meta-data

# 4. Create the tables
def init_db():
    Base.metadata.create_all(bind=engine)

# 5. Helper to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
