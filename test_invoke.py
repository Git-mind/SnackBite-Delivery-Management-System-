# test_invoke_http.py
from invokes import invoke_http

# invoke driver microservice to get all drivers
results = invoke_http("http://localhost:5001/driver", method='GET')

# invoke driver microservice to get all driver id 1 
results2 = invoke_http("http://localhost:5001/driver/1", method='GET')

# invoke driver microservice to add new driver
details = {"driver_name": "Testing driver 2", "phone_number": 99990000} 
results3 = invoke_http("http://localhost:5001/driver", method='POST', json=details)

print( type(results3) )
print()
print( results3 )
