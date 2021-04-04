# importing required libraries 
import requests, json, math 
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import stripe

app = Flask(__name__)
CORS(app)

@app.route("/payment", methods=['POST'])
def receivePayment():
	# Check if the order contains valid JSON
	payment_details = None
	if request.is_json:
		payment_details = request.get_json()
		payment_result = processPayment(payment_details)
		code = payment_result['code']
		if code not in range(200, 300):
			print(payment_result['message'])
		else: 
			return jsonify(payment_result), payment_result["code"]
	else:
		data = request.get_data()
		print("Payment failed to go through:")
		print(data)
		return jsonify({"code": 400,
			"data": str(data),
			"message": "Payment details should be in JSON."}), 400  # Bad Request input


def processPayment(details):
	print("Processing an payment for an order:")
	print(details)
	customer = details["customer_id"]
	price = details["price"]
	card = details["credit_card"]
	# enter your api key here 
	stripe.api_key = "sk_test_51IbDzyHA8Hke5K0TojMEVfeV8ihCgIxLTT6VMfTyDT5exzgfMJxaXdokcwWN5wgmx8G7G0Tfdx4tjPEFAMyhTj4M00smUxD1su"

	# Create one-time use credit card token
	a = stripe.Token.create(card={"number":details["credit_card"],"exp_month":4,"exp_year":2022,"cvc":"314"})

    # `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
	r = stripe.Charge.create(amount=int(price*100), currency="sgd", api_key=stripe.api_key, source=a["id"])

	# json method of response object 
	# return python dict from json object 
	# x = r.json() 

	# by default driving mode considered 
	# print the value of distance
	r["customer_id"] = customer
	if r:
		return {
			'code': 201,
			'data': r,
            'message': f"Payment to {customer} successful, charged ${price} to {card}"
		}
	else:
		code = 400 
		message = "Failure in process payment from API"
		return {
			'code': code,
			'message': message,
			'data': r
		}


# execute this program only if it is run as a script (not by 'import')
if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) +
          ": getting payment for completed orders ...")
    app.run(host='0.0.0.0', port=5006, debug=True)





