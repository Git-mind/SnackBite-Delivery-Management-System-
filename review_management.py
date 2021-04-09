from flask import Flask, request, jsonify
from flask_cors import CORS

import os, sys
from os import environ

import requests
from invokes import invoke_http

import amqp_setup
from amqp_setup import *

import pika
import json

app = Flask(__name__)
CORS(app)

driver_URL = environ.get('driver_URL') or "http://localhost:5001/driver"
customer_URL = environ.get('customer_URL') or "http://localhost:5002/customers"
review_URL = environ.get('review_URL') or  "http://localhost:5005/review"
order_URL= environ.get('order_URL') or  "http://localhost:5004/order"


@app.route("/create_review", methods=['POST'])
def create_review():
    # Simple check of input format and data of the request are JSON
    if request.is_json:
        try:
            review = request.get_json()
            print("\nReceived a review in JSON:", review)

            # do the actual work
            # 1. Send review info {order_id, feedback}
            result = processCreateReview(review)
            print('\n------------------------')
            print('\nresult: ', result)
            return jsonify(result), result["code"]

        except Exception as e:
            # Unexpected error in code
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)

            return jsonify({
                "code": 500,
                "message": "review_management.py internal error: " + ex_str
            }), 500

    # if reached here, not a JSON request.
    return jsonify({
        "code": 400,
        "message": "Invalid JSON input: " + str(request.get_data())
    }), 400


def processCreateReview(review):
    # check for amqp connection. If connection timeout, re-establish connection to amqp
    # The shared connection and channel created when the module is imported may be expired, 
    # timed out, disconnected by the broker or a client;
    # - re-establish the connection/channel is they have been closed
    check_setup()

    
    # 2. Get order details from order microservice
    # Invoke the order microservice

    print('\n-----Invoking order microservice-----')

    order_result = invoke_http(order_URL + "/" + str(review['order_id']) , method='GET')
    print('order_result:', order_result)

    # 6. Get customer name from customer microservice.
    print('\n-----Invoking customer microservice-----')
    customer_result = invoke_http(customer_URL + "/" + str(review['customer_id']), method='GET')
    customer_name = customer_result["data"]["customer_name"]

    # 7. Get driver name from driver microservice.
    print('\n-----Invoking driver microservice-----')
    driver_result = invoke_http(driver_URL + "/" + str(review['driver_id']), method='GET')
    print(driver_result)
    driver_name = driver_result["data"]["driver_name"]

    # 8. Create review using order microservice
    # Invoke review microservice 
    print('\n-----Invoking review microservice-----')
    customer_id = order_result["data"]["customer_id"]
    driver_id = order_result["data"]["driver_id"]
    order_id = order_result["data"]["order_id"]
    feedback = review["feedback"]
    review_result = invoke_http(review_URL, method='POST', json={
        'customer_id': customer_id,
        'customer_name': customer_name,
        'driver_id': driver_id,
        'driver_name': driver_name,
        'order_id': order_id,
        'feedback': feedback
    })
    print('review_result:', review_result)
    # Check the order result;
    # if a failure, send it to the error microservice.
    code = review_result['code']
    review_result['type'] = "review"
    review_result['activity_name'] = "review_creation"
    message = json.dumps(review_result)
    print(review_result)
    if code not in range(200, 300):
        #8. Inform the error microservice
        #print('\n\n-----Invoking error microservice as review creation fails-----')
        print('\n\n-----Publishing the (review error) message with routing_key=review.error-----')

        amqp_setup.channel.basic_publish(exchange=amqp_setup.exchangename, routing_key="order.error", 
            body=message, properties=pika.BasicProperties(delivery_mode = 2))

        print("\Review Creation status ({:d}) published to the RabbitMQ Exchange:".format(
            code), review_result)

        # 9. Return error
        return {
            "code": 401,
            "data": {
                "review_result": review_result
            },
            "message": "Simulated review creation record error sent for error handling."
        }
    else:
        # 10. Record new review
        # record the activity log anyway
        #print('\n\n-----Invoking activity_log microservice-----')
        print('\n\n-----Publishing the (review info) message with routing_key=review.info-----')        
    
        amqp_setup.channel.basic_publish(exchange=amqp_setup.exchangename, routing_key="review.info", 
            body=message)
    
    print("\Review published to RabbitMQ Exchange.\n")
    # - reply from the invocation is not used;
    # continue even if this invocation fails

    # 11. Return created review
    return {
        "code": 201,
        "data": {
            "review_result": review_result,
            "order_result": order_result,
        }
    }


# Execute this program if it is run as a main script (not by 'import')
if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) + " for placing a review...")
    app.run(host="0.0.0.0", port=5400, debug=True)
    # Notes for the parameters: 
    # - debug=True will reload the program automatically if a change is detected;
    #   -- it in fact starts two instances of the same flask program, and uses one of the instances to monitor the program changes;
    # - host="0.0.0.0" allows the flask program to accept requests sent from any IP/host (in addition to localhost),
    #   -- i.e., it gives permissions to hosts with any IP to access the flask program,
    #   -- as long as the hosts can already reach the machine running the flask program along the network;
    #   -- it doesn't mean to use http://0.0.0.0 to access the flask program.
