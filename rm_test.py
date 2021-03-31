# Test om composite microservice 
from invokes import invoke_http

# Update destination, pick up location, price 
json = {"order_id":1, "feedback": "complex micro test"}
results = invoke_http("http://localhost:5400/create_review", method='POST', json=json)

# results = invoke_http("http://localhost:5004/order/get_available_orders", method='GET')

print( type(results) )
print()
print( results )