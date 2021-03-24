# Test order microservice 
from invokes import invoke_http

# invoke driver microservice to get all drivers
# results = invoke_http("http://localhost:5004/order", method='POST', json={
# 	'customer_id': '32145',
# 	'c_phone_number': '32145678',
# 	'pickup_location': 'Jurong',
# 	'destination': 'city hall',
# 	'price': 6.50
# })

# results = invoke_http("http://localhost:5004/order/1", method='PUT', json={
# 	'driver_id': 1234,
# 	'd_phone_number': 12345689,
# 	'status': 'Delivering'
# })

results = invoke_http("http://localhost:5004/order/get_available_orders", method='GET')

print( type(results) )
print()
print( results )