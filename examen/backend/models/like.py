from datetime import datetime
from . import db

class Like(db.Model):
    __tablename__ = 'likes'

    id         = db.Column(db.Integer, primary_key=True)
    article_id = db.Column(db.Integer, db.ForeignKey('articles.id'), nullable=False)
    user_id    = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user    = db.relationship('User', foreign_keys=[user_id])
    article = db.relationship('Article', foreign_keys=[article_id])

    def to_dict(self):
        return {
            'id':         self.id,
            'article_id': self.article_id,
            'user_id':    self.user_id,
            'created_at': self.created_at.isoformat(),
        }