from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user       import User
from .article    import Article
from .friendship import Friendship
from .comment    import Comment
from .like       import Like