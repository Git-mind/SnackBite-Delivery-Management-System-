# Test review microservice 
from invokes import invoke_http

# invoke microservice to create new review
# results = invoke_http("http://localhost:5005/review", method='POST', json= {'customer_id': '2',
# 				'driver_id': 1,
# 				'order_id': 3,
#                 'feedback': 'bad service'})

# invoke microservcie to get all reviews for specific driver
#results = invoke_http("http://localhost:5005/review/driver/1", method='GET')

# invoke to get reviews for specific customer
results = invoke_http("http://localhost:5005/review/customer/1", method='GET')

print( type(results) )
print()
print( results )