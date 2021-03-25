var order_URL = "http://localhost:5004/order";
var order_management_URL = "http://localhost:5100/create_order";
var pricing_URL = "http://localhost:5003/pricing";

    

var app = new Vue({
    el: "#app",
    computed: {
        hasOrders: function () {
            return this.orders.length > 0;
        }
    },
    data: {
        isbn13: "",
        "orders": [],
        message: "There is a problem retrieving books data, please try again later.",
        newTitle: "",
        newISBN13: "",
        newPrice: "",
        newAvailability: "",
        bookAdded: false,
        addBookError: "",
        orderedBook: "",
        orderPlaced: false,
        orderSuccessful: false,
        displayPrice: false,
        customer_id: "1",
        customer_name: "John",
        //I think should be outside of this vue
        //assuming customer login 
        // need to change customer_id and customer name dynamically see which customer login
        pickup_location: "",
        destination: "",
        order_result: ""
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
                            this.order_result = result.order_result.data;
                            // orderMessage =
                            //     `Order placed
                            //             Order Result:
                            //             ${result.order_result.code}:${result.order_result.data.status}

                            //             Shipping Result:
                            //             ${result.shipping_result.code}:${result.shipping_result.message}`;
                            break;

                        case 400:
                            // 400 
                            this.orderSuccessful = true;
                            // orderMessage =
                            //     `Order placed
                            //             Order Result:
                            //             ${result.order_result.code}:${result.order_result.data.status}

                            //             Shipping Result:
                            //             ${result.shipping_result.code}:${result.shipping_result.message}

                            //             Error handling:
                            //             ${data.message}`;
                            break;
                        case 500:
                            // 500 
                            // orderMessage =
                            //     `Order placed with error:
                            //             Order Result:
                            //             ${result.order_result.code}:${result.order_result.message}

                            //             Error handling:
                            //             ${data.message}`;
                            break;
                        default:
                            orderMessage = `Unexpected error: ${data.code}`;
                            console.log(`Unknown error code : ${data.code}`);
                            break;

                    } // switch
                    // console.log(orderMessage);
                    this.orderPlaced = true;
                })
                .catch(error => {
                    console.log("Problem in placing an order. " + error);
                })
        }
    },
    created: function () {
        // on Vue instance created, load the book list
        if (this.customer_name != ""){
            userName = document.getElementById('userName')
            userName.innerHTML = 'Welcome back ' + this.customer_name + "!"
        }
        this.find_by_customer_id();
    }
});