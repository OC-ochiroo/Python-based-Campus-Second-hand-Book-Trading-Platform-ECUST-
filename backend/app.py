from flask import Flask, jsonify
from models import db, User

app = Flask(__name__)

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Force recreate database cleanly
with app.app_context():
    print("Creating fresh database...")
    db.drop_all()     #  deletes old tables if any
    db.create_all()   

@app.route("/")
def home():
    return "Backend running!"

@app.route("/test")
def test():
    return "DB connected!"

@app.route("/add_user")
def add_user():
    user = User(name="Ochir", email="test@test.com")
    db.session.add(user)
    db.session.commit()
    return "User added!"

@app.route("/users")
def get_users():
    users = User.query.all()
    return jsonify([
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "wechat": u.wechat_username
        }
        for u in users
    ])

if __name__ == "__main__":
    app.run(debug=True)
