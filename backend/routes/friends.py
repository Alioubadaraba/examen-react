from flask import Blueprint, request, jsonify
from models import db
from models.user import User
from models.friendship import Friendship
from utils.decorators import jwt_required_custom

friends_bp = Blueprint('friends', __name__)


# ── Liste des amis (accepted + blocked) ─────────────────
@friends_bp.route('', methods=['GET'])
@jwt_required_custom
def get_friends(current_user):
    friendships = Friendship.query.filter(
        ((Friendship.sender_id == current_user.id) |
         (Friendship.receiver_id == current_user.id)),
        Friendship.status.in_(['accepted', 'blocked'])
    ).all()

    friends = []
    for f in friendships:
        friend = f.receiver if f.sender_id == current_user.id else f.sender
        friends.append({
            **friend.to_dict(),
            'friendship_id': f.id,
            'status': f.status,
        })

    return jsonify({'friends': friends}), 200


# ── Demandes reçues en attente ───────────────────────────
@friends_bp.route('/pending', methods=['GET'])
@jwt_required_custom
def get_pending(current_user):
    pending = Friendship.query.filter_by(
        receiver_id=current_user.id,
        status='pending'
    ).all()

    result = []
    for f in pending:
        result.append({
            **f.sender.to_dict(),
            'friendship_id': f.id,
        })

    return jsonify({'pending': result}), 200


# ── Envoyer une demande d'ami ────────────────────────────
@friends_bp.route('/request', methods=['POST'])
@jwt_required_custom
def send_request(current_user):
    data     = request.get_json()
    username = data.get('username', '').strip()

    if not username:
        return jsonify({'message': 'Username requis'}), 400

    target = User.query.filter_by(username=username).first()

    if not target:
        return jsonify({'message': 'Utilisateur introuvable'}), 404

    if target.id == current_user.id:
        return jsonify({'message': 'Vous ne pouvez pas vous ajouter vous-même'}), 400

    existing = Friendship.query.filter(
        ((Friendship.sender_id == current_user.id) & (Friendship.receiver_id == target.id)) |
        ((Friendship.sender_id == target.id) & (Friendship.receiver_id == current_user.id))
    ).first()

    if existing:
        return jsonify({'message': 'Une relation existe déjà avec cet utilisateur'}), 409

    friendship = Friendship(
        sender_id=current_user.id,
        receiver_id=target.id,
        status='pending'
    )
    db.session.add(friendship)
    db.session.commit()

    return jsonify({'message': 'Demande envoyée'}), 201


# ── Accepter une demande ─────────────────────────────────
@friends_bp.route('/<int:friendship_id>/accept', methods=['PUT'])
@jwt_required_custom
def accept_request(current_user, friendship_id):
    f = Friendship.query.get_or_404(friendship_id)

    if f.receiver_id != current_user.id:
        return jsonify({'message': 'Action non autorisée'}), 403

    f.status = 'accepted'
    db.session.commit()

    return jsonify({'message': 'Demande acceptée'}), 200


# ── Refuser une demande ──────────────────────────────────
@friends_bp.route('/<int:friendship_id>/reject', methods=['PUT'])
@jwt_required_custom
def reject_request(current_user, friendship_id):
    f = Friendship.query.get_or_404(friendship_id)

    if f.receiver_id != current_user.id:
        return jsonify({'message': 'Action non autorisée'}), 403

    db.session.delete(f)
    db.session.commit()

    return jsonify({'message': 'Demande refusée'}), 200


# ── Supprimer un ami ─────────────────────────────────────
@friends_bp.route('/<int:friendship_id>', methods=['DELETE'])
@jwt_required_custom
def remove_friend(current_user, friendship_id):
    f = Friendship.query.get_or_404(friendship_id)

    if f.sender_id != current_user.id and f.receiver_id != current_user.id:
        return jsonify({'message': 'Action non autorisée'}), 403

    db.session.delete(f)
    db.session.commit()

    return jsonify({'message': 'Ami supprimé'}), 200


# ── Bloquer un utilisateur ───────────────────────────────
@friends_bp.route('/<int:friendship_id>/block', methods=['PUT'])
@jwt_required_custom
def block_user(current_user, friendship_id):
    f = Friendship.query.get_or_404(friendship_id)

    if f.sender_id != current_user.id and f.receiver_id != current_user.id:
        return jsonify({'message': 'Action non autorisée'}), 403

    f.status = 'blocked'
    db.session.commit()

    return jsonify({'message': 'Utilisateur bloqué'}), 200

# ── Débloquer un utilisateur ─────────────────────────────
@friends_bp.route('/<int:friendship_id>/unblock', methods=['PUT'])
@jwt_required_custom
def unblock_user(current_user, friendship_id):
    f = Friendship.query.get_or_404(friendship_id)

    if f.sender_id != current_user.id and f.receiver_id != current_user.id:
        return jsonify({'message': 'Action non autorisée'}), 403

    f.status = 'accepted'
    db.session.commit()

    return jsonify({'message': 'Utilisateur débloqué'}), 200