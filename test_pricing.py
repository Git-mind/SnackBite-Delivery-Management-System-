# Test pricing microservice 
from invokes import invoke_http

# invoke driver microservice to get all drivers
results = invoke_http("http://localhost:5003/pricing", method='POST', json= {'pickup_location': 'Jurong East',
				'destination': 'Chinatown Singapore',
				'customer_id': '1011'})

print( type(results) )
print()
print( results )