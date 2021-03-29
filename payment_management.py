from flask import Flask, request, jsonify
from flask_cors import CORS

import os, sys
from os import environ

import requests
from invokes import invoke_http

# import amqp_setup
import pika
import json

app = Flask(__name__)
CORS(app)

order_URL = environ.get('order_URL') or "http://localhost:5004/order"
customer_URL = environ.get('customer_URL') or "http://localhost:5002/customers/"
# payment_URL = 

@app.route("/order_completed", methods=['POST'])
def order_completed():
    # Simple check of input format and data of the request are JSON
    if request.is_json:
        try:
            order = request.get_json()
            print(order)
            print("\nReceived an order in JSON:", order)

            # do the actual work
            # 1. Send order info {customer_id, pickup_location, destination}
            result = processOrderCompleted(order)
            print('\n------------------------')
            print('\nresult: ', result)
            return jsonify(result)

        except Exception as e:
            # Unexpected error in code
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)

            return jsonify({
                "code": 500,
                "message": "payment_management.py internal error: " + ex_str
            }), 500

    # if reached here, not a JSON request.
    return jsonify({
        "code": 400,
        "message": "Invalid JSON input: " + str(request.get_data())
    }), 400

def processOrderCompleted(order):
    # 2. Updating the order status using order microservice
    # Invoke the order microservice
    order_id = order['order_id']
    print(order_id)
    print('\n-----Invoking order microservice-----')
    order_result = invoke_http(order_URL + "/" + order_id, method='PUT', json=order)
    print('order_result:', order_result)

    # 3. Check the order result; if a failure, send it to the error microservice.
    code = order_result["code"]

    if code not in range(200, 300):
        # Inform the error microservice
        #print('\n\n-----Invoking error microservice as order update fails-----')
        print('\n\n-----Publishing the (order update error) message with routing_key=order.error-----')

        # invoke_http(error_URL, method="POST", json=order_result)
        message = json.dumps(order_result)
        # amqp_setup.channel.basic_publish(exchange=amqp_setup.exchangename, routing_key="order.error", 
        #     body=message, properties=pika.BasicProperties(delivery_mode = 2)) 

        # make message persistent within the matching queues until it is received by some receiver 
        # (the matching queues have to exist and be durable and bound to the exchange)

        # - reply from the invocation is not used;
        # continue even if this invocation fails        
        print("\Order status ({:d}) published to the RabbitMQ Exchange:".format(
            code), order_result)

        # 7. Return error
        return {
            "code": 500,
            "data": {"order_result": order_result},
            "message": "Order update failure sent for error handling."
        }

    # # Notice that we are publishing to "Activity Log" only when there is no error in order creation.
    # # In http version, we first invoked "Activity Log" and then checked for error.
    # # Since the "Activity Log" binds to the queue using '#' => any routing_key would be matched 
    # # and a message sent to “Error” queue can be received by “Activity Log” too.

    else:
        # 4. Get c_phone_number for order using customer microservice
        # Invoke customer microservice
        
        print('\n-----Invoking customer microservice-----')
        customer_URL = "http://localhost:5002/customers/" + str(order_result['data']['customer_id'])
        customer_result = invoke_http(customer_URL, method='GET')

        print('customer_result:', customer_result)
        
        # 5. Create order using payment microservice
        # Invoke payment microservice 
        print('\n-----Invoking payment microservice-----')
        customer_id = customer_result["data"]["customer_id"]
        c_phone_number = customer_result["data"]["phone_number"]
        c_name = customer_result["data"]["customer_name"]
        credit_card = customer_result["data"]["credit_card"]
        print(customer_id)
        print(c_phone_number)
        print(c_name)
        print(credit_card)


        #check for method = "POST" / "GET"
        # payment_result = invoke_http(payment_URL, method='POST', json={
        #     'customer_id': customer_id,
        #     'c_phone_number': c_phone_number,
        # })
        # print('payment_result:', payment_result)


        # # Check the order result;
        # # if a failure, send it to the error microservice.
        # code = order_result['code']
        # message = json.dumps(order_result)
        # if code not in range(200, 300):
        #     # Inform the error microservice
        #     #print('\n\n-----Invoking error microservice as order creation fails-----')
        #     print('\n\n-----Publishing the (order error) message with routing_key=order.error-----')

        #     # invoke_http(error_URL, method="POST", json=order_result)
        #     amqp_setup.channel.basic_publish(exchange=amqp_setup.exchangename, routing_key="order.error", 
        #         body=message, properties=pika.BasicProperties(delivery_mode = 2))

        #     print("\nShipping status ({:d}) published to the RabbitMQ Exchange:".format(
        #         code), order_result)

        #     # 7. Return error
        #     return {
        #         "code": 400,
        #         "data": {
        #             "order_result": order_result
        #         },
        #         "message": "Simulated order creation record error sent for error handling."
        #     }
        # else:
        #     # 6. Record new order
        #     # record the activity log anyway
        #     #print('\n\n-----Invoking activity_log microservice-----')
        #     print('\n\n-----Publishing the (order info) message with routing_key=order.info-----')        

        #     # invoke_http(activity_log_URL, method="POST", json=order_result)            
        #     amqp_setup.channel.basic_publish(exchange=amqp_setup.exchangename, routing_key="order.info", 
        #         body=message)
        
        # print("\nOrder published to RabbitMQ Exchange.\n")
        # # - reply from the invocation is not used;
        # # continue even if this invocation fails

        # # 7. Return created order
        # return {
        #     "code": 201,
        #     "data": {
        #         "order_result": order_result,
        #         "price_result": price_result,
        #         "customer_result": customer_result
        #     }
        # }

# Execute this program if it is run as a main script (not by 'import')
if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) + " for requesting payment after completing an order...")
    app.run(host="0.0.0.0", port=5300, debug=True)
    # Notes for the parameters: 
    # - debug=True will reload the program automatically if a change is detected;
    #   -- it in fact starts two instances of the same flask program, and uses one of the instances to monitor the program changes;
    # - host="0.0.0.0" allows the flask program to accept requests sent from any IP/host (in addition to localhost),
    #   -- i.e., it gives permissions to hosts with any IP to access the flask program,
    #   -- as long as the hosts can already reach the machine running the flask program along the network;
    #   -- it doesn't mean to use http://0.0.0.0 to access the flask program.