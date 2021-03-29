var order_URL = "http://localhost:5004/order";
var order_management_URL = "http://localhost:5100/create_order";

// mainVue()



//DO NOT TOUCH THIS (CODE TO HANDLE AUTHENTICATION)


firebase.auth().onAuthStateChanged(function(user) {
if (user) {
    log_in=document.getElementById("Log_in")

    log_out=document.getElementById("Log_out")

    log_in.className='btn btn-success disabled'
    log_in.style='pointer-events: none'
    
    log_out.className='btn btn-danger'
    log_out.style='pointer-events: auto'

} else {
    log_in=document.getElementById("Log_in")
    alert(log_in)

    log_out=document.getElementById("Log_out")

    log_out.className='btn btn-danger disabled'
    log_out.style='pointer-events: none'

    log_in.className='btn btn-success'
    log_in.style='pointer-events: auto'
}
});
//DO NOT TOUCH THIS (CODE TO HANDLE AUTHENTICATION)
//yeah it is a horrible programming practice 

















function mainVue(){
    var app = new Vue({
        el: "#app",
        computed: {
            hasOrders: function () {
                return this.orders.length > 0;
            }
        },
        data: {
            "orders": [],
            message: "There is a problem retrieving books data, please try again later.",
            newPrice: "",
            orderCreated: false,
            orderedBook: "",
            orderPlaced: false,
            orderSuccessful: false,
            customer_id: "1",
            customer_name: "",
            //add status columns in customer.sql to see which customer has logged in. Maybe i dk if got any other methods to check which user logged in (workaround solution).
            //I think should be outside of this vue
            //assuming customer login 
            // need to change customer_id and customer name dynamically see which customer login
            pickup_location: "",
            destination: "",
            order_result: "",
            no_order: "",
        },
        methods: {
            find_by_customer_id: function () {
                // on Vue instance created, load the book list
                const response =
                    // fetch(order_URL)
                    fetch(order_URL + "/customer/" + this.customer_id)
                    .then(response => response.json())
                    .then(data => {
                        console.log(response);
                        if (data.code === 404) {
                            // no order in db
                            this.message = data.message;
                            this.no_order = false;
                        } else {
                            console.log(data)
                            this.no_order = true;
                            this.orders = data.data.orders;
                            this.message = "You have " + this.orders.length + " food orders"
                        }
                    })
                    .catch(error => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        console.log(this.message + error);
    
                    });
    
            },
            find_by_customer_id_status: function (status) {
                // on Vue instance created, load the book list
                const response =
                    // fetch(order_URL)
                    fetch(order_URL + "/customer/" + this.customer_id + "&" + status)
                    .then(response => response.json())
                    .then(data => {
                        console.log(response);
                        if (data.code === 404) {
                            // no order in db based on status
                            this.message = data.message;
                            this.no_order = false;
                        } else {
                            console.log(data)
                            this.no_order = true;
                            msg = "";
                            if (status == "Cancelled"){
                                msg = "cancelled";
                            }
                            this.orders = data.data.orders;
                            this.message = "You have " + this.orders.length + " "+ msg + " food orders"
                        }
                    })
                    .catch(error => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        console.log(this.message + error);
    
                    });
    
            },
            find_by_order_id: function (order_id) {
                // on Vue instance created, load the book list
                const response =
                    // fetch(order_URL)
                    fetch(order_URL + "/" + this.order_id)
                    .then(response => response.json())
                    .then(data => {
                        console.log(response);
                        if (data.code === 404) {
                            // no book in db
                            this.message = data.message;
                        } else {
                            console.log(data)
                            this.orders = data.data.orders;
                            this.message = "You have " + this.orders.length + " food orders"
                        }
                    })
                    .catch(error => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        console.log(this.message + error);
    
                    });
    
            },
            cancel_order: function (order_id) {
                // on Vue instance created, load the book list
                const response =
                    // fetch(order_URL)
                    fetch(order_URL + "/" + order_id, 
                    {
                        method: "PUT",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify(
                            {
                                "status": "Cancelled"
                            })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(response);
                        if (data.code === 404) {
                            // no book in db
                            this.message = data.message;
                        } else {
                            console.log(data)
                            this.message = "You have cancelled order id " + order_id;
                            // update UI after cancelling order
                            this.find_by_customer_id();
                        }
                    })
                    .catch(error => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        console.log(this.message + error);
    
                    });
    
            },
            create_order: function () {
    
                // use this to trigger an error
                // "customer_id": "ERROR",
                pickup_location = this.pickup_location
                destination = this.destination
                customer_id = this.customer_id
                price = this.newPrice
                fetch(order_management_URL, {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({
                            pickup_location: this.pickup_location,
                            destination: this.destination,
                            customer_id: this.customer_id
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        result = data.data;
                        console.log(result);
                        // 3 cases
                        console.log(data.code)
                        switch (data.code) {
                            case 201:
                                // 201
                                this.orderSuccessful = true;
                                this.orderCreated = true;
                                this.order_result = result.order_result.data;
                                //update UI after creating order
                                this.find_by_customer_id();
                                orderMessage =
                                    `Order placed
                                            Customer Result:
                                            ${result.customer_result.code}:${result.customer_result.data.customer_name}
    
                                            Order Result:
                                            ${result.order_result.code}:${result.order_result.data.status}
    
                                            Price Result:
                                            ${result.price_result.code}:${result.price_result.data.price}`;
                                break;
    
                            case 400:
                                // 400 
                                this.orderSuccessful = true;
                                orderMessage =
                                    `Order placed
                                        Order Result:
                                        ${result.order_result.code}:${result.order_result.data.status}
    
                                        Price Result:
                                        ${result.price_result.code}:${result.price_result.data.price}
    
                                            Error handling:
                                            ${data.message}`;
                                break;
                            case 500:
                                500 
                                orderMessage =
                                    `Order placed with error:
                                            Order Result:
                                            ${result.order_result.code}:${result.order_result.data.status}
    
                                            Price Result:
                                            ${result.price_result.code}:${result.price_result.data.price}
    
                                            Error handling:
                                            ${data.message}`;
                                break;
                            default:
                                orderMessage = `Unexpected error: ${data.code}`;
                                console.log(`Unknown error code : ${data.code}`);
                                break;
    
                        } // switch
                        console.log(orderMessage);
                        this.orderPlaced = true;
                    })
                    .catch(error => {
                        console.log("Problem in placing an order. " + error);
                    })
            }
            
        },
        created: function () {
            // on Vue instance created, load the book list
            this.find_by_customer_id();
        }
    });

}
