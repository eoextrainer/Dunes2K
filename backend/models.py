from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Game progress
    career_player = db.relationship('CareerPlayer', backref='user', uselist=False)
    achievements = db.relationship('Achievement', secondary='user_achievements')
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class CareerPlayer(db.Model):
    __tablename__ = 'career_players'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    player_name = db.Column(db.String(80), nullable=False)
    position = db.Column(db.String(20), nullable=False)  # PG, SG, SF, PF, C
    height = db.Column(db.Integer)  # in cm
    weight = db.Column(db.Integer)  # in lbs
    
    # Stats
    overall_rating = db.Column(db.Integer, default=60)
    points = db.Column(db.Integer, default=0)
    assists = db.Column(db.Integer, default=0)
    rebounds = db.Column(db.Integer, default=0)
    games_played = db.Column(db.Integer, default=0)
    
    # Attributes
    speed = db.Column(db.Integer, default=50)
    shooting = db.Column(db.Integer, default=50)
    dribbling = db.Column(db.Integer, default=50)
    defense = db.Column(db.Integer, default=50)
    stamina = db.Column(db.Integer, default=50)

class Team(db.Model):
    __tablename__ = 'teams'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    city = db.Column(db.String(80), nullable=False)
    primary_color = db.Column(db.String(7))  # Hex color
    secondary_color = db.Column(db.String(7))
    wins = db.Column(db.Integer, default=0)
    losses = db.Column(db.Integer, default=0)

class GameSession(db.Model):
    __tablename__ = 'game_sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'))
    opponent_id = db.Column(db.Integer, db.ForeignKey('teams.id'))
    user_score = db.Column(db.Integer, default=0)
    opponent_score = db.Column(db.Integer, default=0)
    date_played = db.Column(db.DateTime, default=datetime.utcnow)
