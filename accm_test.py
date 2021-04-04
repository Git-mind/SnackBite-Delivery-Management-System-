# Test pm composite microservice 
from invokes import invoke_http

# Run customer, order, and account_management on flask first

results = invoke_http("http://localhost:5500/delete_customer", method='POST', json={'customer_id':'2'})


print( type(results) )
print()
print( results )