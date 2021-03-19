# importing required libraries 
import requests, json, math 

# enter your api key here 
api_key ='AIzaSyB8audUPR7PuCkyzggFrOCAS1m7fZ_ENyY'

# Take source as input (lat,long)
source ="55.930385, -3.118425"

# Take destination as input  (lat,long)
dest = "50.087692, 14.421150"

# url variable store url 
url ='https://maps.googleapis.com/maps/api/distancematrix/json?'
# Get method of requests module 
# return response object 
r = requests.get(url + 'origins=' + source +
				'&destinations=' + dest +
				'&key=' + api_key) 
					
# json method of response object 
# return python dict from json object 
x = r.json() 



# by default driving mode considered 
# print the value of distance
new_list= x["rows"]
distance= math.ceil(new_list[0]["elements"][0]["distance"]["value"]/1000)
flat_rate= 3
total_price = 3.50+ distance * 0.50

print(format(total_price,'.2f'))



