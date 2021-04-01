from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from os import environ
import requests
from datetime import datetime

import json
import os
import amqp_setup

app = Flask(__name__)

# SQL settings
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL') or 'mysql+mysqlconnector://root@localhost:3306/error'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Error(db.Model):
    __tablename__ = 'error'
    id = db.Column(db.Integer, primary_key=True)
    error_date_time = db.Column(db.DateTime, nullable=False)
    error_type = db.Column(db.String(300), nullable=False)
    activity_name = db.Column(db.String(100), nullable=False)
    info = db.Column(db.String(1000), nullable=False)

monitorBindingKey='*.error'

def receiveError():
    amqp_setup.check_setup()
    
    queue_name = "Error"   

    # set up a consumer and start to wait for coming messages
    amqp_setup.channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
    amqp_setup.channel.start_consuming() # an implicit loop waiting to receive messages; 
    #it doesn't exit by default. Use Ctrl+C in the command window to terminate it.

def callback(channel, method, properties, body): # required signature for the callback; no return
    print("\nReceived an error by " + __file__)
    processError(body)
    print() # print a new line feed

def processError(errorMsg):
    print("Printing the error message:")
    try:
        error = json.loads(errorMsg)
        print("--JSON:", error)
        print("Recording an error log:")
        print(errorMsg)
        # ADD Error log into Error DB
        error_date_time = datetime.now()
        error_type = error['type']
        activity_name = error['activity_name']
        info = error['message']
        error_log = Error(error_date_time=error_date_time,error_type=error_type,activity_name=activity_name, info=info)
        db.session.add(error_log)
        db.session.commit()
    except Exception as e:
        print("--NOT JSON:", e)
        print("--DATA:", errorMsg)
    print()




if __name__ == "__main__":  # execute this program only if it is run as a script (not by 'import')    
    print("\nThis is " + os.path.basename(__file__), end='')
    print(": monitoring routing key '{}' in exchange '{}' ...".format(monitorBindingKey, amqp_setup.exchangename))
    receiveError()
