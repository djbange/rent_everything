import React from 'react';
import Sidebar from 'containers/Owner/Sidebar/Loadable';
import './Bookings.css';
import Cookies from 'universal-cookie';

export default class Bookings extends React.Component{

    constructor(props){
        super(props);
        this.state = {
          items: [],
			    DataisLoaded: false,
        }
    }
    componentDidMount() {
      //e.preventDefault()
      const cookies = new Cookies();
      let response = fetch(process.env.HOST_URL + '/api/renter/bookings',
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
              items: json.data,
              DataisLoaded: true
          });
      })
}

render() {
  const { DataisLoaded, items } = this.state;
  if (!DataisLoaded) return <div><h1> Loading.... </h1> </div> ;
  if( items.length == 0) return <div><h1>Please post your first item</h1></div>
  return (
          <div className = "sidebaralign">
              <div>
                  <Sidebar/>
              </div>
              <div className = "owner">
                  <h1> Customer bookings </h1> 
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
                                              <b>Product Specification</b> : { item.productspecification }
                                          </li>
                                          <li className = 'list'>
                                              <b>Customer</b> : { item.customer_name }
                                          </li>
                                          <li className = 'list'>
                                              <b>Mobile</b> : { item.phonenumber }
                                          </li>
                                          <li className = 'list'>
                                              <b>Booking period</b> : {item.startdate} to {item.enddate}
                                          </li>
                                          <li className = 'list'>
                                              <b>Cost</b> : { item.amountpaid }
                                          </li>
                                          <li className = 'list'>
                                              <b>Zip code</b> : { item.zipcode }
                                          </li>
                                      </ul>
                                  </div>
                                  <div style = {{marginRight: "0px"}}>
                                    <button type="submit" className="btn btn-primary">{item.status}</button>
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