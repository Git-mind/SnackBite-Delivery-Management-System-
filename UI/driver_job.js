var delivery_management_URL = "http://localhost:5200/";

var app = new Vue({
    el: "#app",
    computed: {

    },
    data: {
        "customers": [],
        message: "There is a problem retrieving books data, please try again later.",
        customer_id: "1",
        customer_name: "John",
        no_customer:"",
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
                        this.no_customer = false;
                    } else {
                        console.log(data)
                        this.no_customer = true;
                        this.customers = data.data.order_result.data.customers;
                        this.message = "You have " + this.customers.length + " food orders"
                    }
                })
                .catch(error => {
                    // Errors when calling the service; such as network error, 
                    // service offline, etc
                    console.log(this.message + error);

                });

        },

        Accept:function(){
            //Update driver UI status


            //Update customer UI status 


        },
        
    },
    created: function () {
        if (this.customer_name != ""){
            userName = document.getElementById('userName')
            userName.innerHTML = 'Welcome back ' + this.customer_name + "!"

            this.find_by_driver_id();
        }
     
    }
});