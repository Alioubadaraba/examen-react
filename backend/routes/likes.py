from flask import Blueprint, jsonify
from models import db
from models.like import Like
from models.article import Article
from utils.decorators import jwt_required_custom

likes_bp = Blueprint('likes', __name__)


# ── Liker ou unliker un article ──────────────────────────
@likes_bp.route('/<int:article_id>/like', methods=['POST'])
@jwt_required_custom
def toggle_like(current_user, article_id):
    article = Article.query.get_or_404(article_id)

    existing = Like.query.filter_by(
        article_id=article_id,
        user_id=current_user.id
    ).first()

    if existing:
        db.session.delete(existing)
        db.session.commit()
        liked = False
    else:
        like = Like(article_id=article_id, user_id=current_user.id)
        db.session.add(like)
        db.session.commit()
        liked = True

    count = Like.query.filter_by(article_id=article_id).count()

    return jsonify({
        'liked': liked,
        'count': count,
    }), 200


# ── Nombre de likes d'un article ─────────────────────────
@likes_bp.route('/<int:article_id>/likes', methods=['GET'])
@jwt_required_custom
def get_likes(current_user, article_id):
    count = Like.query.filter_by(article_id=article_id).count()
    liked = Like.query.filter_by(
        article_id=article_id,
        user_id=current_user.id
    ).first() is not None

    return jsonify({
        'count': count,
        'liked': liked,
    }), 200