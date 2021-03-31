var delivery_management_URL = "http://localhost:5200/";
var order_management_URL = "http://localhost:5100/";
var driver_url="http://localhost:5001/driver"
var order_URL = "http://localhost:5004/order";
var order_management_URL = "http://localhost:5100/";

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
                console.log("hello")
                alert(`${uid}`)
                create_account(uid,user_name,pid)
            })

            //
        }
        else{
            mainVue(uid)
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
async function create_account(uid,user_name,pid){
    try{
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

function mainVue(uid){
    var app = new Vue({
        el: "#app",
        computed: {

        },
        data: {
            "orders": [],
            message: "There is a problem retrieving books data, please try again later.",
            driver_id: "1",
            no_order:"",
            driver_name:"",
        },
        methods: {
            //auto populate table 
            find_by_driver_id: function () {
                const response =
                    // fetch(order_URL)
                    fetch(delivery_management_URL + "display_order")
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
                            this.orders = data.data.order_result.data.customers;
                            this.message = "You have " + this.orders.length + " food orders"
                        }
                    })
                    .catch(error => {
                        // Errors when calling the service; such as network error, 
                        // service offline, etc
                        console.log(this.message + error);

                    });
 

            },


            
            Accept:function(){
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
                    } else {
                        console.log(data)
                        this.orderUpdated = true;
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

            
        },
        created: function () {
           
            if (this.driver_name != ""){
                userName = document.getElementById('userName')
                userName.innerHTML = 'Welcome back ' + this.driver_name + "!"
        
            }
            this.find_by_driver_id();
        
        }
    });

}