# Test om composite microservice 
from invokes import invoke_http

# Update destination, pick up location, price 
# json = {"order_id":2, "pickup_location": "Jurong East", "destination": "Pasir Ris Singapore", "customer_id": 1}
json = {"customer_id": 1, 'pickup_location':"Jurong East", "destination":"Pasir Ris"}
results = invoke_http("http://localhost:5100/create_order", method='POST', json=json)

# results = invoke_http("http://localhost:5004/order/get_available_orders", method='GET')

print( type(results) )
print()
print( results )