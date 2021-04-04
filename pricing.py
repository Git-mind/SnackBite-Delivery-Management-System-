# importing required libraries 
import requests, json, math 
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/pricing", methods=['POST'])
def receiveOrder():
	# Check if the order contains valid JSON
	order = None
	if request.is_json:
		order = request.get_json()
		pricing_result = processPricing(order)
		code = pricing_result['code']
		if code not in range(200, 300):
			print(pricing_result['message'])
		else: 
			return jsonify(pricing_result), pricing_result["code"]
	else:
		data = request.get_data()
		print("Received an invalid order:")
		print(data)
		return jsonify({"code": 400,
			# make the data string as we dunno what could be the actual format
			"data": str(data),
			"message": "Order should be in JSON."}), 400  # Bad Request input


def processPricing(order):
	print("Processing an order's pricing for delivery:")
	print(order)
	# enter your api key here 
	api_key ='AIzaSyB8audUPR7PuCkyzggFrOCAS1m7fZ_ENyY'

	# Take source as input (lat,long)
	# source ="55.930385, -3.118425"
	source = order['pickup_location']

	# Take destination as input  (lat,long)
	# dest = "50.087692, 14.421150"
	dest = order['destination']

	# url variable store url 
	url ='https://maps.googleapis.com/maps/api/distancematrix/json?'

	# Get method of requests module 
	# return response object 
	r = requests.get(url + 'origins=' + source +
	'&destinations=' + dest +
	'&key=' + api_key) 

	# json method of response object 
	# return python dict from json object 
	x = r.json() 

	# by default driving mode considered 
	# print the value of distance
	new_list= x["rows"]
	
	if new_list[0]["elements"][0]["status"] == "OK":
		distance= math.ceil(new_list[0]["elements"][0]["distance"]["value"]/1000)
		flat_rate= 3
		total_price = format(3.50+ distance * 0.50,'.2f')
		code = 201 
		return {
			'code': code,
			'data': {
				'price': total_price,
				'pickup_location': order['pickup_location'],
				'destination': order['destination'],
				'customer_id': order['customer_id']
			} 
		}
	else:
		code = 400 
		message = "Failure in getting price from API"
		return {
			'code': code,
			'message': message,
			'data': x
		}


# execute this program only if it is run as a script (not by 'import')
if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) +
          ": pricing for orders ...")
    app.run(host='0.0.0.0', port=5003, debug=True)





