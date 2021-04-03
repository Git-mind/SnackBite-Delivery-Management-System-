//PLEASE READ!!!!

//GOOGLE API ERRORS ARE SHOWN VIA ALERTS 
//CONNECTION TO CUSTOMER DATABASE ERRORS ARE SHOWN VIA INNER HTML TO THE PAGE IN RED 
//CONNECTION TO ORDER ERRORS ARE SHOWN VIA INNER HTML TO THE PAGE IN RED 


var order_URL = "http://localhost:5004/order";
var order_management_URL = "http://localhost:5100/";
var review_management_URL = "http://localhost:5400";
var review_URL = "http://localhost:5005/review";
var cus_url='http://localhost:5002/customers'
var driver_url='http://localhost:5001/driver'

//{
    
        //HTML ELEMENTS

//}


//LOGIN BUTTON 
log_in=document.getElementById("log_in")

//LOGOUT BUTTON
log_out=document.getElementById("log_out")


//VUE STUFF (WRAPPER THAT WRAPS VUE ELEMENT)
vue_stuff=document.getElementById("vue_stuff")
//INITIALLY HIDE WRAPPER WHEN LOADED
vue_stuff.style.display='none'


//LOADING FOR AUTHENTICATION
loading=document.getElementById('loading')



//WELCOME MESSAGE
welcome=document.getElementById('welcome_msg')

//ERROR DIV 
error=document.getElementById('error')

//SIGN UP OK DIV
sign_up_ok=document.getElementById('sign_up_ok')

//SIGN UP 
sign_up=document.getElementById("sign_up")

//T_ID INPUT BY CUSTOMER
t_id=document.getElementById('t_id')

//C_NUM INPUT BY CUSTOMER 
c_num=document.getElementById('c_num')

//P_NUM INPUT BY CUSTOMER 
p_num=document.getElementById("p_num")



//{
    
        //ADDING EVENT LISTENERS 

//}



//ADD EVENTLISTENER TO LOG_IN BUTTON
log_in.addEventListener('click',sign_in)

//ADD EVENTLISTENER TO LOG_OUT BUTTON
log_out.addEventListener('click',sign_out)





//{
    
        //FUNCTIONS

//}


//LOG_IN FUNCTION 
function sign_in(){
    provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider).then(function (result) {
        console.log("Sign_in has been successful")
    }).catch(function (err) {
        // Handle Errors here.
        var errorCode = err.code;
        var errorMessage = err.message;
        // The email of the user's account used.
        var email = err.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = err.credential;
        
        error.innerHTML=`User email ${email} could not be authenticated by ${credential} due to error : ${errorMessage}`

    });
}


//LOG_OUT FUNCTION 
function sign_out(){
    firebase.auth().signOut().then(() => {
        console.log("Sign_out has been successful")
        vue_stuff.style.display='none'
    }).catch((err) => {
        // alert(`Sign out is unsuccessful due to ${err}`)
        // console.log("Sign out is unsuccessful, please try again!")
        error.innerHTML=`Sign out is unsuccessful due to ${err}`
        vue_stuff.style.display='none'
    });
}


//LOG IN DISABLED LOG OUT ENABLED
function inDoutE(){
    log_in.className='btn btn-success disabled'
    log_in.style='pointer-events: none'
    
    log_out.className='btn btn-danger'
    log_out.style='pointer-events: auto;cursor: pointer'
}

//LOG IN ENABLED LOG OUT DISABLED 
function inEoutD(){
    log_out.className='btn btn-danger disabled'
    log_out.style='pointer-events: none'

    log_in.className='btn btn-success'
    log_in.style='pointer-events: auto;cursor: pointer'
}



//THIS FUNCTION CHECKS THE SESSION AND SEE IF A USER HAS LOGGED IN OR NOT 
firebase.auth().onAuthStateChanged(function(user) {
if (user) {

    check_cus(cus_url,user.uid,user.displayName)
} else {
    loading.style.display='none'

    //BUTTON DISABLING & ENABLING
    inEoutD()

    //ADD WELCOME MSG
    welcome.innerHTML=`Please log in`
    
}
});


//CHECK IF CUSTOMER IS PRESENT IN THE DATABASE (IF LOGGED IN WITHOUT SIGNING UP)
async function check_cus(cus_url,uid,user_name){
    try{
        response=await fetch(`${cus_url}/${uid}`)
        //console.log(await fetch(`${cus_url}/${uid}`))
        if (!response.ok){
            //SIGN OUT THE USER FROM FIREBASE 
            sign_out()
            error.innerHTML=`User is not found in our database, Please sign up for SnackBite`

            $('#signUpModal').modal('toggle')

            //ADD EVENT LISTENER TO SUBMIT BUTTON SO THAT I CAN CAPTURE UID (BAD PRACTICE , I KNOW)
            sign_up.addEventListener('click',function(){
                pid=p_num.value
                credit_num=c_num.value
                tid=t_id.value
                alert(`${uid}`)
                create_account(uid,user_name,pid,credit_num,tid)
            })

            //
        }
        else{
            console.log(user_name)
            mainVue(uid,user_name)
            //DISPLAY THE WRAPPER OF THE DIV WHICH THE VUE IS ATTACHED TO 
            vue_stuff.style.display=''
        
            //HIDE THE LOADING GIF
            loading.style.display='none'
        
            //BUTTON DISABLING & ENABLING
            inDoutE()
        
            //ADD WELCOME MSG
            welcome.innerHTML=`Welcome ${user_name}`
        }
    }
    catch(err){
        //CUSTOMER MICROSERVICE IS NOT AVAILABLE 
        console.log(err)
        error.innerHTML=`Error in retrieving customer data due to ${err}`
        sign_out()
        inEoutD()
        loading.style.display=''
    }


}

//for testing 
// create_account(23423,'asdasd','adasdasd',2342342,'asfasdfsdf')

//CREATE ACCOUNT
async function create_account(uid,user_name,pid,credit_num,tid){
    try{
        response=await fetch(`${cus_url}`,{
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(
                {
                    "customer_id": uid,
                    "customer_name": user_name,
                    "phone_number": pid,
                    "credit_card": credit_num,
                    'tele_id':tid
                })
        })
        
        if (!response.ok){
            //ADD STUFF
            $('#signUpModal').modal('hide')
            error.innerHTML='Sign-up is not successful, please try again'
            



        }
        else{
            $('#signUpModal').modal('hide')
            error.innerHTML=''
            sign_up_ok.innerHTML='Sign-up is successful, please sign-in using your google account again'
            
            //ADD STUFF

        }
    }
    catch(err){
        //CUSTOMER MICROSERVICE IS NOT AVAILABLE 
        $('#signUpModal').modal('hide')

        console.log(err)
        error.innerHTML=`Error in signing up due to ${err}, please try again`
        inEoutD()
        //ADD STUFF

    }

}




//{
    
        //VUE (WRAPPED INSIDE A FUNCTION)

//}

function mainVue(uid,u_n){
    console.log(u_n)
    var app = new Vue({
        el: "#app",
        computed: {
            hasOrders: function () {
                return this.orders.length > 0;
            },
            hasReviews: function(){
                return this.reviews.length > 0;
            }
        },
        data: {
            'u_n':u_n,
            "orders": [],
            "reviews" : [],
            message: "There is a problem retrieving orders data, please try again later.",
            newPrice: "",
            orderCreated: false,
            orderedBook: "",
            orderPlaced: false,
            orderSuccessful: false,
            customer_id: uid,
            customer_name: u_n,
            //add status columns in customer.sql to see which customer has logged in. Maybe i dk if got any other methods to check which user logged in (workaround solution).
            //I think should be outside of this vue
            //assuming customer login 
            // need to change customer_id and customer name dynamically see which customer login
            pickup_location: "",
            destination: "",
            order_result: "",
            no_order: "",
            update_order_id: "",
            update_pickup_location: "",
            update_destination: "",
            orderUpdated: false,
            feedback: "",
            review_successful: false,
            review_msg: "problem submitting review",
            review_message: "",
            no_review: ""
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
                    .catch(err =>{
                        // errors when calling the service; such as network error
                        error.innerHTML=this.message + err
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
                    .catch(err => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        error.innerHTML=this.message + err
    
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
                    .catch(err => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        error.innerHTML=this.message + err
    
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
                    .catch(err => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        error.innerHTML=this.message + err
    
                    });
    
            },
            submit_review: function (customer_id, driver_id, order_id) {
                // on Vue instance created, load the book list
        
                const response =
                    // fetch(order_URL)
                    fetch(review_management_URL + "/create_review", 
                    {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify(
                            {
                                "customer_id": customer_id,
                                "driver_id": driver_id,
                                "order_id": order_id,
                                "feedback": this.feedback
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
                            this.review_successful = true
                            this.review_msg = "Review submitted"
                            // update review list
                            
                            this.find_reviews_by_customer_id();
                        }
                    })
                    .catch(err => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        error.innerHTML=this.message + err
        
                    });
        
            },
        update_order: function () {
            // on Vue instance created, load the book list
            update_order_id = this.update_order_id
            pickup_location = this.update_pickup_location
            destination = this.update_destination
            customer_id = this.customer_id
            const response =
                // fetch(order_URL)
                fetch(order_management_URL + "/update_order", 
                {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(
                        {
                            "order_id": this.update_order_id,
                            "pickup_location": this.update_pickup_location,
                            "destination": this.update_destination,
                            "customer_id": this.customer_id
                        })
                }) 
                .then(response => response.json())
                .then(data => {
                    console.log(response);
                    if (data.code === 404) {
                        // no book in db
                        this.message = data.message;
                    } 
                    else if (data.code === 400) {
                        this.message = data.message;
                        error.innerHTML= this.message
                        this.orderUpdated = false;
                        
                    } else {
                        console.log(data)
                        this.orderUpdated = true;
                        error.innerHTML = ""
                        this.message = "You have updated order details of order id" + order_id;
                        // update UI after cancelling order
                        this.find_by_customer_id();
                    }
                })
                .catch(err => {
                    // Errors when calling the service; such as network error, 
                    // service offline, etc
                    error.innerHTML=this.message + err

                });

        },
            create_order: function () {
                //LOADING
                loading.style.display=''
                // use this to trigger an error
                // "customer_id": "ERROR",
                pickup_location = this.pickup_location
                destination = this.destination
                customer_id = this.customer_id
                price = this.newPrice
                fetch(order_management_URL + "/create_order", {
                       
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
                        //LOADING
                        loading.style.display='none'
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
                                error.innerHTML = "";
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
                                // alert(result.price_result.data.price)
                                
                                // GET THE PRICE 
                                // CALL THE CALLMEBOT FUNCTION  
                                this.newPrice=result.price_result.data.price
                                this.alert_drivers()
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
                                // 500 
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
                    .catch(err => {
                        // console.log("Problem in placing an order. " + error);
                        this.orderCreated = false
                        error.innerHTML="Problem in placing an order. " + err
                    })
            },
            find_reviews_by_customer_id: function () {
                // on Vue instance created, load the book list
                const response =
                    // fetch(order_URL)
                    fetch(review_URL + "/customer/" + this.customer_id)
                    .then(response => response.json())
                    .then(data => {
                        console.log(response);
                        if (data.code === 404) {
                            // no reviews in db
                            this.review_message = data.message;
                            this.no_review = false;
                        } else {
                            this.no_review = true;
    
                            console.log(data)
    
                            this.reviews = data.data.reviews;
                            this.review_message = "You have made " + this.reviews.length + " reviews"
                        }
                    })
                    .catch(err => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        error.innerHTML=this.message + err
    
                    });
    
            },
            alert_drivers:async function(){
                try{
                    const response = 
                        await fetch(
                            driver_url+'/get_all_tele_id',{method:'GET'});
                    //responded but there is an error
                    if (!response.ok){
                        err=await response.json()['message']
                        error.innerHTML+=`<br/>${err}`

                    }
                    else{
                        const driver_tele_ids=await response.json() 
                        console.log(driver_tele_ids)
                        this.alert_call_me(driver_tele_ids)
                        // return  driver_tele_ids
                    }
                }
                //no response , weird error that caused the service to crash etc.
                catch (err){
                    error.innerHTML+=`<br/>${err}`
                }


            },

            alert_call_me:async function(driver_tele_ids){
                driver_tele_ids=driver_tele_ids.data
                users=''
                // Need to delimit tele ids by '|'
                if (driver_tele_ids.length>0){
                    for (i=0;i<driver_tele_ids.length;i++){
                        if (i==driver_tele_ids.length-1){
                            users+=`${driver_tele_ids[i]}`
                            break
                        }
                        users+=`${driver_tele_ids[i]}|`

                    }
                }

                // Get data for delivery msg 
                pickup_location = this.pickup_location
                destination = this.destination
                customer_id = this.customer_id
                price = this.newPrice
                customer_name=this.customer_name


                msg=`NEW JOB \n Pick Up \:${pickup_location} \n Destination \:${destination} \n Customer Name \:${customer_name} \n Price \:${price}`
                console.log(msg)
                msg=encodeURIComponent(msg)

                response = await fetch(`https://green-shadow-bc6f.gowthamaravindfaiz.workers.dev?https://api.callmebot.com/text.php?user=${users}&text=${msg}&html=yes`,{method:'GET'})
                
            }
            
        },
        created: function () {
            // on Vue instance created, load the book list
            // if (this.customer_name != ""){
            //     userName = document.getElementById('userName')
            //     // userName.innerHTML = 'Welcome back ' + this.customer_name + "!"
                
            // }
            this.find_by_customer_id();
            this.find_reviews_by_customer_id();
        }
    });
}


