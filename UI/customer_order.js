var order_URL = "http://localhost:5004/order";
var order_management_URL = "http://localhost:5100/create_order";



//LOGIN BUTTON 
log_in=document.getElementById("log_in")

//LOGOUT BUTTON
log_out=document.getElementById("log_out")

//ADD EVENTLISTENER TO LOG_IN BUTTON
log_in.addEventListener('click',sign_in)

//ADD EVENTLISTENER TO LOG_OUT BUTTON
log_out.addEventListener('click',sign_out)


//VUE STUFF
vue_stuff=document.getElementById("vue_stuff")
vue_stuff.style.display='none'


//LOADING
loading=document.getElementById('loading')

//WELCOME MESSAGE
welcome=document.getElementById('welcome_msg')


//LOG_IN FUNCTION 
function sign_in(){
    provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider).then(function (result) {
        alert("Sign_in has been successful")
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        alert(`User email ${email} could not be authenticated by ${credential} due to error : ${errorMessage}`)
    });
}


//LOG_OUT FUNCTION 
function sign_out(){
    firebase.auth().signOut().then(() => {
        alert("Sign_out has been successful")
    }).catch((error) => {
        alert("Sign out is unsuccessful, please try again!")
    });
    location.reload();
}


//DO NOT TOUCH THIS (CODE TO HANDLE AUTHENTICATION)
//THIS FUNCTION CHECKS THE SESSION AND SEE IF A USER HAS LOGGED IN OR NOT 
firebase.auth().onAuthStateChanged(function(user) {
if (user) {
    // alert(user.uid)
    //START VUE & INSERT UID OF CUSTOMER 
    mainVue(user.uid)
    //DISPLAY THE WRAPPER OF THE DIV WHICH THE VUE IS ATTACHED TO 
    vue_stuff.style.display=''

    //HIDE THE LOADING GIF
    loading.style.display='none'

    //BUTTON DISABLING & ENABLING
    log_in.className='btn btn-success disabled'
    log_in.style='pointer-events: none'
    
    log_out.className='btn btn-danger'
    log_out.style='pointer-events: auto'

    //ADD WELCOME MSG
    welcome.innerHTML=`Welcome ${user.displayName}`
} else {
    loading.style.display='none'

    //BUTTON DISABLING & ENABLING
    log_out.className='btn btn-danger disabled'
    log_out.style='pointer-events: none'

    log_in.className='btn btn-success'
    log_in.style='pointer-events: auto'

    //ADD WELCOME MSG
    welcome.innerHTML=`Please log in`
}
});
//DO NOT TOUCH THIS (CODE TO HANDLE AUTHENTICATION)





function mainVue(uid){
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
            customer_id: uid,
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
