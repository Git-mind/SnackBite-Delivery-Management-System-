from flask import Flask
app = Flask(__name__)

bot_token = '1731806363:AAG34XaGQug59EElQ8wDDU6SfQyQfSychWI'


def GetDriverList():
    return ''

#accepts delivery
def AcceptDelivery(driverid,orderid):
    return True

#rejects delivery
def RejectDelivery(driverid,orderid):
    return True

#allow the driver set whether receive his delivery notifcations
def SetOnCall(driverid):
    return True

#allow the driver to confirm delivery of items
def ConfirmDelivery(driverid):
    return True





# TODO:
# return json responses instead of string for the routes



#route for webhook for telegram server updates
@app.route('/WebHook')
def hello_world():
    return 'Hello, World!'


#route for accepting delivery orders
@app.route('/AcceptDelivery')
def hello_world():
    return 'You have accepted the delivery!'

#route for rejecting delivery orders
@app.route('/RejectDelivery')
def hello_world():
    return 'You have rejected the delivery!'

#route for setting on call
@app.route('/SetOnCall')
def hello_world():
    return 'On Call!'

#route for driver to confirm delivery of items
@app.route('/ConfirmDelivery')
def hello_world():
    return 'You have confirmed the delivery!'


# @app.route('/')
# def hello_world():
#     return 'Hello, World!'

# @app.route('/')
# def hello_world():
#     return 'Hello, World!'