from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models import db
from models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    nom_complet = data.get('nom_complet', '').strip()
    username    = data.get('username', '').strip()
    password    = data.get('password', '')

    if not nom_complet or not username or not password:
        return jsonify({'message': 'Tous les champs sont obligatoires'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Ce nom d\'utilisateur est déjà pris'}), 409

    user = User(
        nom_complet=nom_complet,
        username=username,
        password_hash=generate_password_hash(password),
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Compte créé avec succès'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data     = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')

    if not username or not password:
        return jsonify({'message': 'Champs requis'}), 400

    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Identifiants incorrects'}), 401

    token = create_access_token(identity=str(user.id))

    print(f">>> Login OK : {user.username} | token généré : {token[:30]}...")

    return jsonify({
        'token': token,
        'user':  user.to_dict(),
    }), 200