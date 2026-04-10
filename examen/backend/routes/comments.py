from flask import Blueprint, request, jsonify
from models import db
from models.article import Article
from models.comment import Comment
from utils.decorators import jwt_required_custom

comments_bp = Blueprint('comments', __name__)


# ── Récupérer les commentaires d'un article ──────────────
@comments_bp.route('/<int:article_id>/comments', methods=['GET'])
@jwt_required_custom
def get_comments(current_user, article_id):
    article = Article.query.get_or_404(article_id)

    comments = Comment.query.filter_by(
        article_id=article_id
    ).order_by(Comment.created_at.asc()).all()

    return jsonify({'comments': [c.to_dict() for c in comments]}), 200


# ── Ajouter un commentaire ───────────────────────────────
@comments_bp.route('/<int:article_id>/comments', methods=['POST'])
@jwt_required_custom
def add_comment(current_user, article_id):
    article = Article.query.get_or_404(article_id)

    if not article.allow_comments:
        return jsonify({'message': 'Les commentaires sont désactivés'}), 403

    data    = request.get_json()
    contenu = data.get('contenu', '').strip()

    if not contenu:
        return jsonify({'message': 'Le commentaire ne peut pas être vide'}), 400

    comment = Comment(
        article_id=article_id,
        user_id=current_user.id,
        contenu=contenu,
    )
    db.session.add(comment)
    db.session.commit()

    return jsonify({'comment': comment.to_dict()}), 201


# ── Supprimer un commentaire ─────────────────────────────
@comments_bp.route('/<int:article_id>/comments/<int:comment_id>', methods=['DELETE'])
@jwt_required_custom
def delete_comment(current_user, article_id, comment_id):
    comment = Comment.query.get_or_404(comment_id)
    article = Article.query.get_or_404(article_id)

    # Seul l'auteur du commentaire ou l'auteur de l'article peut supprimer
    if comment.user_id != current_user.id and article.user_id != current_user.id:
        return jsonify({'message': 'Action non autorisée'}), 403

    db.session.delete(comment)
    db.session.commit()

    return jsonify({'message': 'Commentaire supprimé'}), 200