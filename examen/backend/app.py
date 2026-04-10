from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from config import Config
from models import db

from routes.auth     import auth_bp
from routes.articles import articles_bp
from routes.friends  import friends_bp
from routes.comments import comments_bp
from routes.users    import users_bp
from routes.likes    import likes_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Extensions
    db.init_app(app)
    jwt = JWTManager(app)
    CORS(app, origins=['http://localhost:3000'])

    # Blueprints
    app.register_blueprint(auth_bp,     url_prefix='/api/auth')
    app.register_blueprint(articles_bp, url_prefix='/api/articles')
    app.register_blueprint(friends_bp,  url_prefix='/api/friends')
    app.register_blueprint(comments_bp, url_prefix='/api/articles')
    app.register_blueprint(likes_bp,    url_prefix='/api/articles')
    app.register_blueprint(users_bp,    url_prefix='/api/users')

    with app.app_context():
        db.create_all()

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)