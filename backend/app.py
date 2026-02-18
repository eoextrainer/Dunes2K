from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from config import Config
from models import db, User, CareerPlayer, Team, GameSession
from datetime import timedelta

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
jwt = JWTManager(app)

db.init_app(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and user.check_password(data['password']):
        access_token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(days=1)
        )
        return jsonify({'token': access_token, 'user_id': user.id}), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/career/player', methods=['POST'])
@jwt_required()
def create_career_player():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    career_player = CareerPlayer(
        user_id=user_id,
        player_name=data['player_name'],
        position=data['position'],
        height=data['height'],
        weight=data['weight'],
        speed=data.get('speed', 50),
        shooting=data.get('shooting', 50),
        dribbling=data.get('dribbling', 50),
        defense=data.get('defense', 50)
    )
    
    db.session.add(career_player)
    db.session.commit()
    
    return jsonify({'message': 'Career player created', 'id': career_player.id}), 201

@app.route('/api/games/save', methods=['POST'])
@jwt_required()
def save_game():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    game = GameSession(
        user_id=user_id,
        team_id=data['team_id'],
        opponent_id=data['opponent_id'],
        user_score=data['user_score'],
        opponent_score=data['opponent_score']
    )
    
    db.session.add(game)
    db.session.commit()
    
    return jsonify({'message': 'Game saved'}), 200

@app.route('/api/teams', methods=['GET'])
def get_teams():
    teams = Team.query.all()
    return jsonify([{
        'id': t.id,
        'name': t.name,
        'city': t.city,
        'primary_color': t.primary_color,
        'secondary_color': t.secondary_color,
        'record': f"{t.wins}-{t.losses}"
    } for t in teams]), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
