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
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost:3306/activity'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Activity(db.Model):
    __tablename__ = 'activity'
    id = db.Column(db.Integer, primary_key=True)
    activityDatetime = db.Column(db.DateTime, nullable=False)
    activityType = db.Column(db.String(300), nullable=False)
    activity_name = db.Column(db.String(100), nullable=False)
    customer_id = db.Column(db.String(32), nullable=False)
    info = db.Column(db.String(1000), nullable=False)

monitorBindingKey='*.info'

def consume():
    amqp_setup.check_setup()
    queue_name = 'Activity_Log'
    amqp_setup.channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
    amqp_setup.channel.start_consuming()


def callback(channel, method, properties, body): # required signature for the callback; no return
    print("\nReceived an activity log by " + __file__)
    processOrderLog(json.loads(body))
    print() # print a new line feed


def processOrderLog(order): 
    print("Recording an activity log:")
    print(order)

    activityDatetime = datetime.now()
    activityType = order['type']
    activity_name = order['activity_name']
    customer_id = order['data']['customer_id']
    info = "successful"
    activity = Activity(activityDatetime=activityDatetime,activityType=activityType,activity_name=activity_name,customer_id=customer_id, info=info)
    db.session.add(activity)
    db.session.commit()

if __name__ == "__main__":  
    print("\nThis is " + os.path.basename(__file__), end='')
    print(": monitoring routing key '{}' in exchange '{}' ...".format(monitorBindingKey, amqp_setup.exchangename))
    consume()