# Test payment_management complex microservice 
from invokes import invoke_http

# invoke payment_management complex microservice after user click complete order for a particular order.
results = invoke_http("http://localhost:5300/order_completed", method='POST', json= {'order_id': '1', 'status': 'completed'})

print( type(results) )
print()
print( results )