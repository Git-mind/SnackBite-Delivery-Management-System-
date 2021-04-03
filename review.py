#!/usr/bin/env python3
# The above shebang (#!) operator tells Unix-like environments
# to run this file as a python3 script

import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from os import environ

from datetime import datetime
import json

from datetime import datetime

app = Flask(__name__)
# 3308 port used here, please alter to 3306 if necessary 
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL') or 'mysql+mysqlconnector://root@localhost:3306/review'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_recycle': 299}

db = SQLAlchemy(app)

CORS(app)  

class Review(db.Model):
    __tablename__ = 'review'

    review_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.String(100), nullable=False)
    customer_name = db.Column(db.String(100), nullable=False)
    driver_id = db.Column(db.Integer, nullable=False)
    driver_name = db.Column(db.String(100), nullable=False)
    order_id = db.Column(db.Integer, nullable=False)
    feedback = db.Column(db.String(140), nullable=False)

    def json(self):
        return {
            'review_id': self.review_id,
            'customer_id': self.customer_id,
            'customer_name': self.customer_name,
            'driver_id': self.driver_id,
            'driver_name': self.driver_name,
            'order_id': self.order_id,
            'feedback': self.feedback
        }

@app.route("/review")
def get_all():
    reviewlist = Review.query.all()
    if len(reviewlist):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "orders": [review.json() for review in reviewlist]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no reviews"
        }
    ), 404


@app.route("/review/<string:review_id>")
def find_by_review_id(review_id):
    review = Review.query.filter_by(review_id=review_id).first()
    if review:
        return jsonify(
            {
                "code": 200,
                "data": review.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "data": {
                "review_id": review_id
            },
            "message": "Review not found."
        }
    ), 404

#need
@app.route("/review/customer/<string:customer_id>")
def find_by_customer_id(customer_id):
    reviewlist = Review.query.filter_by(customer_id=customer_id).all()
    # reviewlist = Review.query.all()
    if len(reviewlist):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "reviews": [review.json() for review in reviewlist]
                }
            }
        ) 
    return jsonify(
        {
            "code": 404,
            "message": "There are no reviews"
        }
    ), 404

@app.route("/review/driver/<string:driver_id>")
def find_by_driver_id(driver_id):
    reviewlist = Review.query.filter_by(driver_id=driver_id).all()
    # reviewlist = Review.query.all()
    if len(reviewlist):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "reviews": [review.json() for review in reviewlist]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no reviews"
        }
    ), 404

@app.route("/review", methods=['POST'])
def create_review():
    customer_id = request.json.get('customer_id')
    customer_name = request.json.get('customer_name')
    driver_id = request.json.get('driver_id')
    driver_name = request.json.get('driver_name')
    order_id = request.json.get('order_id')
    feedback = request.json.get('feedback')
    review = Review(customer_id=customer_id, 
    customer_name=customer_name,
    driver_id=driver_id,
    driver_name=driver_name,
    order_id=order_id,
    feedback=feedback)
    
    try:
        db.session.add(review)
        db.session.commit()
    except Exception as e:
        return jsonify(
            {
                "code": 500,
                "message": "An error occurred while adding new review. " + str(e)
            }
        ), 500
    
    print(json.dumps(review.json(), default=str))
    print()

    return jsonify(
        {
            "code": 201,
            "data": review.json()
        }
    ), 201


if __name__ == '__main__':
    print("This is flask for " + os.path.basename(__file__) + ": manage reviews ...")
    app.run(host='0.0.0.0', port=5005, debug=True)