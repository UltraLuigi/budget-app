from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
class Base(DeclarativeBase):
    pass
db = SQLAlchemy(app, model_class=Base)

class Transaction(db.Model):
    id = db.mapped_column(db.Integer, primary_key=True)
    amount = db.mapped_column(db.Float, nullable=False)
    category = db.mapped_column(db.String(50), nullable=False)
    description = db.mapped_column(db.String(200), nullable=False)
    date = db.mapped_column(db.Date, default=db.func.current_date())

@app.route("/transactions")
def get_transactions():
    transactions = db.session.scalars(db.select(Transaction)).all()
    return jsonify([{
        "id": t.id,
        "amount": t.amount,
        "category": t.category,
        "description": t.description,
        "date": t.date.isoformat() if t.date else None
    } for t in transactions])

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
    transaction = db.get_or_404(Transaction, id)
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({"message": "Transaction deleted successfully"}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)