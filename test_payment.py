# Test payment microservice 
from invokes import invoke_http

results = invoke_http("http://localhost:5006/payment", method='POST', json= {'customer_id': '2',
				'price': 10,
				'credit_card': 4242424242424242})

print( type(results) )
print()
print( results )