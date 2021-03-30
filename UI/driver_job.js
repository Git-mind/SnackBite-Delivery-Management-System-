var delivery_management_URL = "http://localhost:5200/";

var app = new Vue({
    el: "#app",
    computed: {
        hasOrders: function () {
            return this.orders.length > 0;
        }
    },
    data: {
        "customers": [],
        message: "There is a problem retrieving books data, please try again later.",
        customer_id: "1",
        customer_name: "John",
    },
    methods: {

        
    },
    created: function () {
        if (this.customer_name != ""){
            userName = document.getElementById('userName')
            userName.innerHTML = 'Welcome back ' + this.customer_name + "!"
        }
        this.drivercustomer_id();
    }
});