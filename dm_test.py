# Test order_management complex microservice 
from invokes import invoke_http

# invoke driver microservice to get all drivers
results = invoke_http("http://localhost:5200/update_order", method='PUT', json= {'order_id': 1,
				'driver_id': 1,
				'status': 'Delivering'})

# results = invoke_http('http://localhost:5200/display_order', method="GET")

print( type(results) )
print()
print( results )

