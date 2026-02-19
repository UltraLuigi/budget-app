from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from models import Transaction

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

@app.route("/transactions")
def get_transactions():
    transactions = db.session.execute(db.select(Transaction)).all()
    return jsonify([dict(transaction) for transaction in transactions]) # check if can remove jsonify and just return list

@app.route("/transactions", methods=["POST"])
def add_transaction():
    data = request.get_json()
    new_transaction = Transaction(
        description=data["description"],
        amount=data["amount"],
        category=data["category"]
    )
    db.session.add(new_transaction)
    db.session.commit()
    return jsonify({"message": "Transaction added successfully"}), 201

@app.route("/transactions/<int:id>", methods=["DELETE"])
def delete_transaction(id):
    transaction = db.session.get_or_404(Transaction, id)
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({"message": "Transaction deleted successfully"}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)