var delivery_management_URL = "http://localhost:5200/";
var driver_url="http://localhost:5001/driver";
var payment_management_URL = "http://localhost:5300/";
var review_URL = "http://localhost:5005/review";
var customer_url='http://localhost:5002/customers'

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


//P_NUM INPUT BY DRIVER
p_num=document.getElementById("p_num")

//t_id INPUT BY DRIVER
t_id=document.getElementById('t_id')



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

    check_cus(driver_url,user.uid,user.displayName)
    //console.log(driver_url)
    //console.log(user.id)
    //console.log(user.displayName)
  
} else {
    loading.style.display='none'

    //BUTTON DISABLING & ENABLING
    inEoutD()

    //ADD WELCOME MSG
    welcome.innerHTML=`Please log in`
    
}
});


//CHECK IF DRIVER IS PRESENT IN THE DATABASE (IF LOGGED IN WITHOUT SIGNING UP)
async function check_cus(driver_url,uid,user_name){
    try{
        console.log(uid)
        response=await fetch(`${driver_url}/${uid}`)
        console.log(await fetch(`${driver_url}/${uid}`))
        if (!response.ok){
            //SIGN OUT THE USER FROM FIREBASE 
            sign_out()
            error.innerHTML=`User is not found in our database, Please sign up for SnackBite`

            $('#signUpModal').modal('toggle')

            //ADD EVENT LISTENER TO SUBMIT BUTTON SO THAT I CAN CAPTURE UID (BAD PRACTICE , I KNOW)
            sign_up.addEventListener('click',function(){
                pid=p_num.value
                tid=t_id.value
                alert(`${uid}`)
                create_account(uid,user_name,pid,tid)
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
        //DRIVER MICROSERVICE IS NOT AVAILABLE 
        console.log(err)
        error.innerHTML=`Error in retrieving driver data due to ${err}`
        sign_out()
        inEoutD()
        loading.style.display=''
    }


}

//for testing 
// create_account(23423,'asdasd','adasdasd',2342342,'asfasdfsdf')

//CREATE ACCOUNT
async function create_account(uid,user_name,pid,tid){
    try{
        console.log(response)
        response=await fetch(`${driver_url}`,{
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(
                {
                    "driver_id": uid,
                    "driver_name": user_name,
                    "phone_number": pid,
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
        //DRIVER MICROSERVICE IS NOT AVAILABLE 
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
            hasReviews: function(){
                return this.reviews.length > 0;
            }
        },
        data: {
            'u_n':u_n,
            "orders": [],
            "on_delivery":[],
            "completed_delivery":[],
            "reviews" : [],
            message: "There is a problem retrieving books data, please try again later.",
            driver_id: uid,
            driver_name: u_n,
            no_order:"",
            no_on_delivery:"",
            no_completed_delivery:"",
            show_completed:"",
            show_new:true,
            new_button:true,
            completed_button:true,
            reload_button:"",
            error_new:"",
            error_completed:"",
            review_message: "",
            no_review: "",
            order_status:"",
            ORDERID:"",
        },
        methods: {

            reload: function(){
                window.location.reload()

            },

            //auto populate table/ polling new orders
            find_by_driver_id: function () {
         
                
                const response =
                    // fetch(order_URL)
                    fetch(delivery_management_URL + "display_order")
                    .then(response => response.json())
                    .then(data => {
                        console.log(data.code);
                        if (data.code === 404 || data.code === 500 ) {
                            // no order in db
                            this.message = data.message;
                            this.no_order = false;
                            this.error_new= true;
                            
                        } else {
                            console.log(data)
                            this.no_order = true;
                            this.orders = data.data.order_result.data.customers;
                            this.show_completed="";
                            this.show_new=true;
                            this.find_by_driver_id_on_delivery();
                           
                        }
                    })
                    .catch(error => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        console.log(this.message + error);

                    });
                    

            },


            //auto populate table/ polling on delivery orders
            find_by_driver_id_on_delivery: function () {
                const response =
                    // fetch(order_URL)
                    fetch(delivery_management_URL + "display_on_delivery")
                    .then(response => response.json())
                    .then(data => {
                        console.log(response);
                        if (data.code === 404) {
                            // no order in db
                            //console.log(data)
                            this.message = data.message;
                            this.no_on_delivery = false;
                            
                            //handle button 
                            this.new_button=false;
                            this.completed_button=true;
                            this.reload_button=false;

                        } else {
                            console.log(data)
                            this.no_on_delivery = true;
                            this.on_delivery = data.data.order_result.data.customers;
                        
                        }
                    })
                    .catch(error => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        console.log(this.message + error);

                    });
 

            },

            //auto populate table/ polling on completed delivery orders
            find_by_driver_id_completed: function () {
                const response =
                    // fetch(order_URL)
                    fetch(delivery_management_URL + "display_completed_delivery")
                    .then(response => response.json())
                    .then(data => {
                        console.log(response);
                        if (data.code === 404 || data.code === 500 ){
                            // no order in db
                            this.message = data.message;
                            this.no_completed_delivery = false;
                            this.error_completed= true;
                            this.error_new=false;
                        } else {
                            this.no_completed_delivery = true;
                            this.completed_delivery = data.data.order_result.data.customers;

                            this.show_completed=true;
                            this.show_new=false;

                            //handle button 
                            this.new_button=false;
                            this.completed_button=false;
                            this.reload_button=true;
                        }
                    })
                    .catch(error => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        console.log(this.message + error);

                    });
 

            },



            //driver accepts order
            accept_order:function(order_id,status){
                const response =
                
                    fetch(delivery_management_URL + "update_order", 
                    {
                        method: "PUT",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify(
                            {
                                'driver_id': this.driver_id,
                                'order_id': order_id,
                                "status": "On Delivery"
                            })
                    })
                    .then(response => response.json())
                    .then(data => {
                        //console.log(response);
                        if (data.code === 404) {
                            // no order in db
                            this.message = data.message;
                        
                        } else {
                    
                            this.message = "You have accepted order id " + order_id;
                           
                            // update current order table after accepting order
                            this.find_by_driver_id_on_delivery();
                            // update new order table after accepting order
                            this.find_by_driver_id();
                            //prevent driver from accepting another order
                            this.new_button=false;
                            this.error_new=false;

                
                            //callmebot
                            this.ORDERID = order_id;
                            this.order_status = "On Delivery";
                            this.alert_customers()
                        }
                    })
                    .catch(err => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        error.innerHTML=this.message + err
    
                    });

            },


            complete_delivery:function(order_id,status){
                const response =
                    // fetch(order_URL)
                    fetch(payment_management_URL + "order_completed", 
                    {
                        method: "PUT",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify(
                            {
                                'order_id': order_id,
                                "status": "completed"
                            })
                    })
                    .then(response => response.json())
                    .then(data => {
                        //console.log(response);
                        if (data.code === 404) {
                            // no order in db
                            this.message = data.message;
                        } else {
                    
                            this.message = "You have dropped off Order " + order_id;
                           
                            // update current order table after accepting order
                            this.find_by_driver_id_on_delivery();
                          
                            //update completed order table
                            this.find_by_driver_id_completed();

                            //reload the webpage and direct driver back to main
                            this.reload_button=true;
                            //hide completed button
                            this.completed_button=false;


                            //callmebot
                            this.ORDERID = order_id;
                            this.order_status = "Completed";
                            this.alert_customers()
                           
                        }
                    })
                    .catch(err => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        error.innerHTML=this.message + err
    
                    });

            },

            find_reviews_by_driver_id: function () {
                // on Vue instance created, load the book list
                const response =
                    // fetch(order_URL)
                    fetch(review_URL + "/driver/" + this.driver_id)
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
                            this.review_message = "You have " + this.reviews.length + " review(s)."
                        }
                    })
                    .catch(err => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        error.innerHTML=this.message + err
    
                    });
    
            },

            alert_customers:async function(){
                try{
                    const response = 
                        await fetch(
                            customer_url+'/get_all_tele_id',{method:'GET'});
                    //responded but there is an error
                    if (!response.ok){
                        err=await response.json()['message']
                        error.innerHTML+=`<br/>${err}`

                    }
                    else{
                        const customer_tele_ids=await response.json() 
                        console.log(customer_tele_ids)
                        this.alert_call_me(customer_tele_ids)
                        // return  customer_tele_ids
                    }
                }
                //no response , weird error that caused the service to crash etc.
                catch (err){
                    error.innerHTML+=`<br/>${err}`
                }


            },

            alert_call_me:async function(customer_tele_ids){
                customer_tele_ids=customer_tele_ids.data
                users=''
                // Need to delimit tele ids by '|'
                if (customer_tele_ids.length>0){
                    for (i=0;i<customer_tele_ids.length;i++){
                        if (i==customer_tele_ids.length-1){
                            users+=`${customer_tele_ids[i]}`
                            break
                        }
                        users+=`${customer_tele_ids[i]}|`

                    }
                }

                // Get data for delivery msg 
                orderID = this.ORDERID;
                driverName = this.driver_name; 
                orderStatus = this.order_status;             
                var current = new Date();
                current_time = current.toLocaleTimeString();

                msg=`ORDER ID \: ${orderID} \n Driver \: ${driverName} \n Status \: ${orderStatus} \n Time: ${current_time}`             
                console.log(msg)
                msg=encodeURIComponent(msg)

                response = await fetch(`https://green-shadow-bc6f.gowthamaravindfaiz.workers.dev?https://api.callmebot.com/text.php?user=${users}&text=${msg}&html=yes`,{method:'GET'})
                
            }


            
        },
        created: function () {
           
            if (this.driver_name != ""){
                userName = document.getElementById('userName')
                userName.innerHTML = 'Welcome back ' + this.driver_name + "!"
        
            }
            this.find_by_driver_id();
            this.find_by_driver_id_on_delivery();
            this.find_reviews_by_driver_id();
        }
    });

}