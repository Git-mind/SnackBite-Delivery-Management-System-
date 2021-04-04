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

customer_URL = environ.get('customer_URL') or "http://localhost:5002/customers"
order_URL = environ.get('order_URL') or "http://localhost:5004/order" 
#activity_log_URL = "http://localhost:5003/activity_log"
#error_URL = "http://localhost:5004/error"

@app.route("/delete_customer", methods=['POST'])
def delete_customer():
    # Simple check of input format and data of the request are JSON
    if request.is_json:
        try:
            c_account = request.get_json()
            print("\nReceived a request to delete customer account in JSON:", c_account)

            # do the actual work
            # 1. Send customer id
            result = processDeleteCustomer(c_account)
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
                "message": "account_management.py internal error: " + ex_str
            }), 500

    # if reached here, not a JSON request.
    return jsonify({
        "code": 400,
        "message": "Invalid JSON input: " + str(request.get_data())
    }), 400


def processDeleteCustomer(c_account):
    # 2. Delete customer using customer microservice
    # Invoke the customer microservice
    print(c_account)

    print('\n-----Invoking customer microservice-----')
    customer_result = invoke_http(customer_URL + "/" + str(c_account['customer_id']), method='DELETE')
    print('customer_result:', customer_result)

    # 3. Check the customer deletion result; if a failure, send it to the error microservice.
    code = customer_result["code"]
    customer_result['type'] = "delete"
    customer_result['activity_name'] = "customer_deletion"
    message = json.dumps(customer_result)
    if code not in range(200, 300):
        #print('\n\n-----Invoking error microservice as order creation fails-----')
        print('\n\n-----Publishing the (account error) message with routing_key=account.error-----')

        amqp_setup.channel.basic_publish(exchange=amqp_setup.exchangename, routing_key="account.error", 
            body=message, properties=pika.BasicProperties(delivery_mode = 2))

        print("\Customer deletion status ({:d}) published to the RabbitMQ Exchange:".format(
            code), customer_result)

        # 4. Return error
        return {
            "code": 400,
            "data": {
                "customer_result": customer_result
            },
            "message": "There is an error with customer deletion"
        }
    else:
        # 5. Record customer deletion result
        # record the activity log anyway
        #print('\n\n-----Invoking activity_log microservice-----')
        print('\n\n-----Publishing the (account deletion info) message with routing_key=account.info-----')        
          
        amqp_setup.channel.basic_publish(exchange=amqp_setup.exchangename, routing_key="account.info", 
            body=message)
    
        print("\nOrder published to RabbitMQ Exchange.\n")
            
        # 6. Remove corresponding orders for deleted customer 
        # Invoke order microservice
        
        print('\n-----Invoking order microservice-----')
        order_result = invoke_http(order_URL + "/customer_delete/" + str(c_account['customer_id']), method='DELETE')

        print('order_result:', order_result)
            
        # Check the order result;
        # if a failure, send it to the error microservice.
        code = order_result['code']
        order_result['type'] = "order"
        order_result['activity_name'] = "order_deletion"
        message = json.dumps(order_result)
        print(order_result)

        if code not in range(200, 300):
            #7. Inform the error microservice
            #print('\n\n-----Invoking error microservice as order deletion fails-----')
            print('\n\n-----Publishing the (order error) message with routing_key=account.error-----')

            amqp_setup.channel.basic_publish(exchange=amqp_setup.exchangename, routing_key="account.error", 
                body=message, properties=pika.BasicProperties(delivery_mode = 2))

            print("\nOrder deletion status ({:d}) published to the RabbitMQ Exchange:".format(
                code), order_result)

            # 8. Return error
            return {
                "code": 400,
                "data": {
                    "order_result": order_result
                },
                "message": "Simulated order deletion error sent for error handling."
            }
        else:
            # 9. Record order deletions
            # Record the activity log anyway
            #print('\n\n-----Invoking activity_log microservice-----')
            print('\n\n-----Publishing the (order deletion info) message with routing_key=account.info-----')        
        
            amqp_setup.channel.basic_publish(exchange=amqp_setup.exchangename, routing_key="account.info", 
                body=message)
        
        print("\nOrder deletion published to RabbitMQ Exchange.\n")
        # - reply from the invocation is not used;
        # continue even if this invocation fails

    # 10. Return created order
    return {
        "code": 201,
        "data": {
            "order_result": order_result,
            "customer_result": customer_result
        }
    }


# Execute this program if it is run as a main script (not by 'import')
if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) + " for deleting customer account and corresponding existing orders...")
    app.run(host="0.0.0.0", port=5500, debug=True)
    # Notes for the parameters: 
    # - debug=True will reload the program automatically if a change is detected;
    #   -- it in fact starts two instances of the same flask program, and uses one of the instances to monitor the program changes;
    # - host="0.0.0.0" allows the flask program to accept requests sent from any IP/host (in addition to localhost),
    #   -- i.e., it gives permissions to hosts with any IP to access the flask program,
    #   -- as long as the hosts can already reach the machine running the flask program along the network;
    #   -- it doesn't mean to use http://0.0.0.0 to access the flask program.
