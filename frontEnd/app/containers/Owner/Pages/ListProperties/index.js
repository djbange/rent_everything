//npm i react-paginate

import React from "react";
import './ListProperties.css';
import Sidebar from 'containers/Owner/Sidebar/Loadable';
import Cookies from 'universal-cookie';

export default class ViewMyItems extends React.Component {
    
	// Constructor
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			DataisLoaded: false,
            //temp : "In review",
            //status : "clicked",
            //edit_option:false,
            //username : "" ,
            //id : "",
            //email : "",
            //name : "",
            //data : {},
        };
        //this.handleEdit = this.handleEdit.bind(this);
        //this.handleCustomerInfo = this.handleCustomerInfo.bind(this);
	}
    /*
    handleEdit = (e, id) => {
        e.preventDefault();
        //console.log(this.state.items[id-1])
        //console.log(this.state.items[id-1].username);
        
        sessionStorage.setItem("id", this.state.items[id-1].id);
        var data_dict = {
            username : this.state.items[id-1].username,
            id : this.state.items[id-1].id,
            email : this.state.items[id-1].email,
            name : this.state.items[id-1].name,
        };
        //console.log(data_dict)
        this.setState({
            data : data_dict,
            edit_option:true,
        },
        ()=>{
            console.log(this.state.data);
        })
    }
    
    handleCustomerInfo = e =>
    {
        this.state.show = true
        e.preventDefault();
        console.log("clicked")
    }
    */
	componentDidMount() {
        //e.preventDefault()
        const cookies = new Cookies();
        let response = fetch(process.env.HOST_URL + '/api/renter/items',
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer '+ cookies.get("login"),
                'Content-type': 'application/json',
            },
          },
        ).then((res) => res.json())
        .then((json) => {
            this.setState({
                items: json.results,
                DataisLoaded: true
            });
        })

        /*
		fetch(process.env.HOST_URL + '/api/renter/items',
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer '+ cookies.get("login"),
                'Content-type': 'application/json',
            }
        }
        ).then((res) => res.json())
			.then((json) => {
				this.setState({
					items: json.results,
					DataisLoaded: true
				});
			})
        */
        /*
        body: JSON.stringify({
          email: this.state.email,
        
			.then((res) => res.json())
			.then((json) => {
				this.setState({
					items: json,
					DataisLoaded: true
				});
			})
            //globalEvents.on('getting data',()=>{
                //debugger;
            //})
            */
	}

	render() {
		const { DataisLoaded, items } = this.state;
		if (!DataisLoaded) return <div><h1> Loading.... </h1> </div> ;
        if( items.length == 0) return <div><h1>you don't have any active bookings</h1></div>
		return (
            <div className = "sidebaralign">
                <div>
                    <Sidebar/>
                </div>
                <div className = "owner">
                    <h1> List of items </h1> 
                    {
                        items.map( 
                            (item) => 
                            (
                                <div class = 'item'>
                                    <div class = 'itemlist2'> 
                                        <ul class = 'ullist' key = { item.orderid } >

                                            <li className = 'list'>
                                                <b>Product type</b> : { item.producttype }
                                            </li>
                                            <li className = 'list'>
                                                <b>Product specification</b> : { item.productspecification }
                                            </li>
                                            <li className = 'list'>
                                                <b>Price</b> : { item.amount }
                                            </li>
                                            <li className = 'list'>
                                                <b>Address</b> : { item.address }
                                            </li>
                                            <li className = 'list'>
                                                <b>Zipcode</b> : { item.zipcode }
                                            </li>
                                            <li className = 'list'>
                                                <b>Latitude, Longitude</b> : { item.latitude }, { item.longitude }
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                
                            )
                        )
                    }
                </div>
            </div>
	    );
    }
}