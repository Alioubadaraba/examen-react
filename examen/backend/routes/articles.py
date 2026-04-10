from flask import Blueprint, request, jsonify
from models import db
from models.article import Article
from models.friendship import Friendship
from utils.decorators import jwt_required_custom

articles_bp = Blueprint('articles', __name__)


# ── Liste des articles du dashboard ─────────────────────
@articles_bp.route('', methods=['GET'])
@jwt_required_custom
def get_articles(current_user):
    # Récupérer les IDs des amis acceptés
    accepted = Friendship.query.filter(
        ((Friendship.sender_id == current_user.id) |
         (Friendship.receiver_id == current_user.id)),
        Friendship.status == 'accepted'
    ).all()

    friend_ids = []
    for f in accepted:
        fid = f.receiver_id if f.sender_id == current_user.id else f.sender_id
        friend_ids.append(fid)

    # Mes articles + articles publics des amis non bloqués
    blocked = Friendship.query.filter(
        ((Friendship.sender_id == current_user.id) |
         (Friendship.receiver_id == current_user.id)),
        Friendship.status == 'blocked'
    ).all()

    blocked_ids = []
    for b in blocked:
        bid = b.receiver_id if b.sender_id == current_user.id else b.sender_id
        blocked_ids.append(bid)

    articles = Article.query.filter(
        (Article.user_id == current_user.id) |
        (
            Article.user_id.in_(friend_ids) &
            (Article.is_public == True) &
            (~Article.user_id.in_(blocked_ids))
        )
    ).order_by(Article.created_at.desc()).all()

    return jsonify({'articles': [a.to_dict() for a in articles]}), 200


# ── Créer un article ─────────────────────────────────────
@articles_bp.route('', methods=['POST'])
@jwt_required_custom
def create_article(current_user):
    data = request.get_json()

    titre   = data.get('titre', '').strip()
    contenu = data.get('contenu', '').strip()

    if not titre or not contenu:
        return jsonify({'message': 'Le titre et le contenu sont obligatoires'}), 400

    article = Article(
        user_id=current_user.id,
        titre=titre,
        contenu=contenu,
        is_public=data.get('is_public', True),
        allow_comments=data.get('allow_comments', True),
    )
    db.session.add(article)
    db.session.commit()

    return jsonify({'article': article.to_dict()}), 201


# ── Détail d'un article ──────────────────────────────────
@articles_bp.route('/<int:article_id>', methods=['GET'])
@jwt_required_custom
def get_article(current_user, article_id):
    article = Article.query.get_or_404(article_id)

    # Vérifier les droits d'accès
    if article.user_id != current_user.id:
        if not article.is_public:
            return jsonify({'message': 'Accès refusé'}), 403

    return jsonify({'article': article.to_dict()}), 200


# ── Modifier un article ──────────────────────────────────
@articles_bp.route('/<int:article_id>', methods=['PUT'])
@jwt_required_custom
def update_article(current_user, article_id):
    article = Article.query.get_or_404(article_id)

    if article.user_id != current_user.id:
        return jsonify({'message': 'Action non autorisée'}), 403

    data = request.get_json()

    article.titre          = data.get('titre', article.titre).strip()
    article.contenu        = data.get('contenu', article.contenu).strip()
    article.is_public      = data.get('is_public', article.is_public)
    article.allow_comments = data.get('allow_comments', article.allow_comments)

    db.session.commit()

    return jsonify({'article': article.to_dict()}), 200


# ── Supprimer un article ─────────────────────────────────
@articles_bp.route('/<int:article_id>', methods=['DELETE'])
@jwt_required_custom
def delete_article(current_user, article_id):
    article = Article.query.get_or_404(article_id)

    if article.user_id != current_user.id:
        return jsonify({'message': 'Action non autorisée'}), 403

    db.session.delete(article)
    db.session.commit()

    return jsonify({'message': 'Article supprimé'}), 200