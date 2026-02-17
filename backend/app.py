from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)



if __name__ == '__main__':
    with app.app_context():
        from models import Transaction
        db.create_all()
    app.run(debug=True)