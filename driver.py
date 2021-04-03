#!/usr/bin/env python3
# The above shebang (#!) operator tells Unix-like environments
# to run this file as a python3 script

# This microservice receives request for driver id from delivery management system and returns driver information
# MySQL Database is Driver (Driver ID, Name, phoneNo)

import os
from os import environ
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

from datetime import datetime
import json


#everything need

app = Flask(__name__)
# 3308 port used here, please alter to 3306 if necessary 
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL') or 'mysql+mysqlconnector://root@localhost:3306/driver'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_recycle': 299}

db = SQLAlchemy(app)

CORS(app)  

class Driver(db.Model):
    __tablename__ = 'driver'

    driver_id = db.Column(db.Integer, primary_key=True)
    driver_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.Integer, nullable=False)

    def json(self):
        return {
            'driver_id': self.driver_id,
            'driver_name': self.driver_name,
            'phone_number': self.phone_number
        }

@app.route("/driver")
def get_all():
    driverlist = Driver.query.all()
    if len(driverlist):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "drivers": [driver.json() for driver in driverlist]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no drivers"
        }
    ), 404

@app.route("/driver/<string:driver_id>")
def find_by_driver_id(driver_id):
    driver = Driver.query.filter_by(driver_id=driver_id).first()
    if driver:
        return jsonify(
            {
                "code": 200,
                "data": driver.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "data": {
                "driver_id": driver_id
            },
            "message": "Driver not found."
        }
    ), 404

@app.route("/driver", methods=['POST'])
def add_driver():
    driver_name = request.json.get('driver_name')
    phone_number = request.json.get('phone_number')
    driver = Driver(driver_name=driver_name, phone_number=phone_number)
    
    try:
        db.session.add(driver)
        db.session.commit()
    except Exception as e:
        return jsonify(
            {
                "code": 500,
                "message": "An error occurred while adding new driver. " + str(e)
            }
        ), 500
    
    print(json.dumps(driver.json(), default=str))
    print()

    return jsonify(
        {
            "code": 201,
            "data": driver.json()
        }
    ), 201

#need
@app.route("/driver/<string:driver_id>", methods=['PUT'])
def update_driver(driver_id):
    try:
        driver = Driver.query.filter_by(driver_id=driver_id).first()
        if not driver:
            return jsonify(
                {
                    "code": 404,
                    "data": {
                        "driver_id": driver_id
                    },
                    "message": "Driver not found."
                }
            ), 404

        # update status
        data = request.get_json()
        if data['phone_number']:
            driver.phone_number = data['phone_number']
            db.session.commit()
            return jsonify(
                {
                    "code": 200,
                    "data": driver.json()
                }
            ), 200
    except Exception as e:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "driver_id": driver_id
                },
                "message": "An error occurred while updating the driver details. " + str(e)
            }
        ), 500

if __name__ == '__main__':
    print("This is flask for " + os.path.basename(__file__) + ": manage drivers ...")
    app.run(host='0.0.0.0', port=5001, debug=True)