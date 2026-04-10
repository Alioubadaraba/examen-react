from datetime import datetime
from . import db

class Article(db.Model):
    __tablename__ = 'articles'

    id             = db.Column(db.Integer, primary_key=True)
    user_id        = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    titre          = db.Column(db.String(200), nullable=False)
    contenu        = db.Column(db.Text, nullable=False)
    is_public      = db.Column(db.Boolean, default=True)
    allow_comments = db.Column(db.Boolean, default=True)
    created_at     = db.Column(db.DateTime, default=datetime.utcnow)

    comments = db.relationship('Comment', backref='article', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id':              self.id,
            'user_id':         self.user_id,
            'titre':           self.titre,
            'contenu':         self.contenu,
            'is_public':       self.is_public,
            'allow_comments':  self.allow_comments,
            'created_at':      self.created_at.isoformat(),
            'author_username': self.author.username,
        }