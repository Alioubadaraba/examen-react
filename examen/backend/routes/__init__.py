from flask import Blueprint

from .auth     import auth_bp
from .articles import articles_bp
from .friends import friends_bp
from .comments import comments_bp