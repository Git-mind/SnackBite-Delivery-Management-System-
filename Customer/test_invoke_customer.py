from invokes import invoke_http

url="http://localhost:5002/customers"

#get all customers 
def get_all_customers():
    new_url =f"{url}/get_all_customers"
    results=invoke_http(new_url, method='GET')
    return results

#get customer details
def find_by_customer_id(customer_id):
    new_url=f"{url}/{customer_id}"
    results=invoke_http(new_url,method='GET')
    return results

#check if user id is present on the database 
def is_customer_exists():
    new_url=f"{url}/1"
    results=invoke_http(new_url,method='GET')
    return results


#get credit card 
def get_credit_card():
    new_url=f"{url}/get_credit_card/1"
    results=invoke_http(new_url,method='GET')
    return results


#add customer 
def add_customer():
    new_url=url
    j={"customer_id": 2, "customer_name": 'Cortana', "phone_number": 343, "credit_card": '4242 4242 4242 4242'}
    results=invoke_http(new_url,method="POST",json=j)
    return results

#delete customer
def delete_customer():
    new_url=f"{url}/2"
    print(new_url)
    results=invoke_http(new_url,method='DELETE')
    return results

#get_customer_tele_id
def get_cust_tele_id():
    new_url=f"{url}/get_tele_id/1"
    print(new_url)
    results=invoke_http(new_url,method='GET')
    return results

print(is_customer_exists())