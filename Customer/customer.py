import os
from os import environ
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL') or 'mysql+mysqlconnector://root@localhost:3306/customer'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_recycle': 299}

db = SQLAlchemy(app)
CORS(app)

class Customer(db.Model):
    __tablename__ = 'customer'

    customer_id = db.Column(db.String(100), primary_key=True)
    customer_name= db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.Integer, nullable=False)
    credit_card = db.Column(db.String(100), nullable=False)

    def __init__(self, customer_id, customer_name, phone_number, credit_card ):
        self.customer_id = customer_id
        self.customer_name = customer_name
        self.phone_number = phone_number
        self.credit_card=  credit_card

    def json(self):
        return {"customer_id": self.customer_id, "customer_name": self.customer_name, "phone_number": self.phone_number, "credit_card": self.credit_card}



#get all customers 
@app.route("/customers/get_all_customers", methods=['GET'])
def getAllCustomers():
    custlist=Customer.query.all()
    if len(custlist):
        return jsonify(
            {
                "code":200,
                "data":{
                    "customers":[customer.json() for customer in custlist]
                }
            }
        )
    return jsonify(
        {
            "code":404,
            "message":"There are no customers"
        }
    ),404

#check if customer id is present in the database 
#return true if cust has signed up 
#returns false if cust has not signed up 
@app.route("/customers/<string:id>")
def check_if_customer_exists(id):
    cust= Customer.query.filter_by(customer_id=id).first()
    print(cust)
    if cust:
        return jsonify(
            {
                "code": 200,
                "data": True
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": False
        }
    ), 404

#return the credit card of the customer 
@app.route("/customers/get_credit_card/<string:id>", methods=['GET'])
def get_credit_card(id):
    c_n=Customer.query.filter_by(customer_id=id).first()
    if c_n:
        return jsonify(
            {
                "code": 200,
                "data": c_n.json()['credit_card']
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Book not found."
        }
    ), 404


#add customer
@app.route("/customers", methods=['POST'])
def add_customer():
    data = request.get_json()
    customer = Customer(**data)
    id=customer.customer_id

    #check if the customer has already signed up
    if (Customer.query.filter_by(customer_id=id).first()):
        return jsonify(
            {
                "code": 400,
                "data": {
                    "customer_id": id
                },
                "message": "Customer has already signed up."
            }
        ), 400

    try:
        db.session.add(customer)
        db.session.commit()
    except Exception as e:
        return jsonify(
            {
                "code": 500,
                "message": "An error occurred creating a customer record." +str(e)
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": customer.json()
        }
    ), 201


#delete customer 
@app.route("/customers/<string:id>", methods=['DELETE'])
def delete_customers(id):
    cust=Customer.query.filter_by(customer_id=id).first()
    if cust:
        db.session.delete(cust)
        db.session.commit()
        return jsonify(
            {
                "code": 200,
                "data": {
                    "customer_id": id
                }
            }
        )

    return jsonify(
        {
            "code": 404,
            "data": {
                "customer_id": id
            },
            "message": "Customer is not found."
        }
    ), 404


if __name__ == '__main__':
    print("This is flask for " + os.path.basename(__file__) + ": manage customers")
    app.run(host='0.0.0.0', port=5002, debug=True)
