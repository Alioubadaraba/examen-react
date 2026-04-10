from functools import wraps
from flask import jsonify, request
from flask_jwt_extended import decode_token
from models.user import User

def jwt_required_custom(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({'message': 'Token manquant'}), 401
        
        token = auth_header.split(' ')[1]
        try:
            decoded = decode_token(token)
            user_id = decoded['sub']
            user = User.query.get(int(user_id))
            if not user:
                return jsonify({'message': 'Utilisateur introuvable'}), 404
            return f(user, *args, **kwargs)
        except Exception as e:
            print(f"Erreur token : {e}")
            return jsonify({'message': 'Token invalide ou expiré'}), 401
    return decorated