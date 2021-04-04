from flask import Flask, request, jsonify
from flask_cors import CORS

import os, sys
from os import environ

import requests
from invokes import invoke_http

import amqp_setup
import pika
import json

app = Flask(__name__)
CORS(app)

driver_URL = environ.get('driver_URL') or "http://localhost:5001/driver"
order_URL = environ.get('order_URL') or  "http://localhost:5004/order"
#activity_log_URL = "http://localhost:5003/activity_log"
#error_URL =  "http://localhost:5004/error



#added by chin ning (on completed deiivery)
@app.route("/display_completed_delivery", methods=['GET'])
def display_completed_delivery():
    # 1. Get order info {customer_id, pickup_location, destination}
    # Invoke the order microservice
    print('\n-----Invoking order microservice-----')
    order_result = invoke_http(order_URL + "/get_completed_delivery" , method='GET')
    print('order_result:', order_result)

    # 2. Check the order result; if a failure, send it to the error microservice.
    code = order_result["code"]
    if code not in range(200, 300):

        # 7. Return error
        return {
            "code": 500,
            "data": {"order_result": order_result},
            "message": "Retrieval of completed orders failure sent for error handling."
        }

    else:
        return {
            "code": 201,
            "data": {
            "order_result": order_result
            }
        }
@app.route("/update_order", methods=['PUT'])
def update_order():
    if request.is_json:
        try:
            order_accept = request.get_json()
            print("\nOrder accepted, received order id and driver details in JSON:", order_accept)
            # do the actual work# 
            # 1. Get driver details from driver microservice.
            print('\n-----Invoking driver microservice-----')
            driver_result = invoke_http(driver_URL + "/" + str(order_accept['driver_id']), method='GET')
            print(driver_result)
            order_accept['driver_name'] = driver_result["data"]["driver_name"]
            order_accept['d_phone_number'] = driver_result["data"]["phone_number"]
            order_accept['driver_tele_id'] = driver_result["data"]["tele_id"]
            # 2. Update the order details using order microservice
            # Invoke the order microservice
            result = invoke_http(order_URL + "/" + str(order_accept['order_id']) , method='PUT', json=order_accept)
            print('order_result:', result)
            # 2. Check the order update result; if a failure, send it to the error microservice.
            code = result["code"]
            result['type'] = "delivery"
            result['activity_name'] = "accept_delivery"

            message = json.dumps(result)
            if code not in range(200, 300): 
                # Inform the error microservice
                #print('\n\n-----Invoking error microservice as pricing fails-----')
                print('\n\n-----Publishing the (accept error) message with routing_key=accept.error-----')

                amqp_setup.channel.basic_publish(exchange=amqp_setup.exchangename, routing_key="accept.error", 
                    body=message, properties=pika.BasicProperties(delivery_mode = 2))

                print("\nOrder Update status ({:d}) published to the RabbitMQ Exchange:".format(
                    code), result)

                # make message persistent within the matching queues until it is received by some receiver 
                # (the matching queues have to exist and be durable and bound to the exchange)

                # - reply from the invocation is not used;
                # continue even if this invocation fails        

                # Return error
                return {
                    "code": 500,
                    "data": {"result": result},
                    "message": "Update of accept order failure sent for error handling."
                }           
            else:
                # 10. Record order update
                # record the activity log anyway
                # print('\n\n-----Invoking activity_log microservice-----')
                print('\n\n-----Publishing the (accept info) message with routing_key=accept.info-----')        
            
                amqp_setup.channel.basic_publish(exchange=amqp_setup.exchangename, routing_key="accept.info", 
                    body=message)
            
                print("\nOrder update published to RabbitMQ Exchange.\n")
                # 3. Update the Driver UI 
                delivery_URL = "http://localhost:5200/display_order" 
                order_result = invoke_http(delivery_URL, method='GET')
                return {
                    "code": 201,
                    "data": {
                    "order_result": order_result
                    }
                } 
        except Exception as e:
            # Unexpected error in code
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)

            return jsonify({
                "code": 500,
                "message": "delivery_management.py internal error: " + ex_str
            }), 500

        # if reached here, not a JSON request.
        return jsonify({
            "code": 400,
            "message": "Invalid JSON input: " + str(request.get_data())
        }), 400


    # Execute this program if it is run as a main script (not by 'import')
if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) + " for delivery management...")
    app.run(host="0.0.0.0", port=5200, debug=True)
    # Notes for the parameters: 
    # - debug=True will reload the program automatically if a change is detected;
    #   -- it in fact starts two instances of the same flask program, and uses one of the instances to monitor the program changes;
    # - host="0.0.0.0" allows the flask program to accept requests sent from any IP/host (in addition to localhost),
    #   -- i.e., it gives permissions to hosts with any IP to access the flask program,
    #   -- as long as the hosts can already reach the machine running the flask program along the network;
    #              