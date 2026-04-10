from flask import Blueprint, request, jsonify
from models.user import User
from utils.decorators import jwt_required_custom

users_bp = Blueprint('users', __name__)


# ── Rechercher un utilisateur par username ───────────────
@users_bp.route('/search', methods=['GET'])
@jwt_required_custom
def search_user(current_user):
    username = request.args.get('username', '').strip()

    if not username:
        return jsonify({'message': 'Username requis'}), 400

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({'message': 'Utilisateur introuvable'}), 404

    if user.id == current_user.id:
        return jsonify({'message': 'C\'est votre propre compte'}), 400

    return jsonify({'user': user.to_dict()}), 200