import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from 'containers/Owner/Sidebar/Loadable';

export default class Edit extends React.Component{

    constructor(props){
        super(props);
        console.log(this.props)
        this.state = {
                item : this.props.dataParentToChild,
                message : ""
                //Console.log(this.state.namel)
        }
        //debugger;
        //this.name = this.props.list
        //console.log(this.state.namel)
    }

    componentDidMount() {
        var id = sessionStorage.getItem("id");
        console.log(id)
        //globalEvents.trigger('getting data',)
      }

    render() {

        return (
          <form method = 'POST' style = {{margintop : 1400}}>
            <div className="App-wrapper-here">
              <div className="auth-inner">
                <div className = "App"></div>
                <div className="mb-3">
                  <label>Start date</label>
                  <input
                      type="date"
                      name = "start_date"
                      className="form-control"
                      placeholder="Enter start date"
                      value={this.state.startDate} 
                      onChange={this.handleStartDateChange}
                  />
                </div>

                <div className="mb-3">
                  <label>End date</label>
                  <input
                      type="date"
                      name = "end_date"
                      className="form-control"
                      placeholder="Enter end date"
                      value={this.state.endDate} 
                      onChange={this.handleEndDateChange}
                  />
                </div>

                <div className="mb-3">
                  <label>Price</label>
                  <input
                      type="number"
                      name = "price"
                      className="form-control"
                      placeholder="Enter price"
                      value={this.state.price} 
                      onChange={this.handlePriceChange}
                  />
                </div>

                <div className="mb-3">
                  <label>Location</label>
                  <input
                      type="text"
                      name = "address"
                      className="form-control"
                      placeholder="Enter address"
                      value={this.state.location} 
                      onChange={this.handleLocationChange}
                  />
                </div>

                <div className="mb-3">
                  <label>Image</label>
                  <div>
                      <input type="file" multiple accept="image/*"
                              name="images"
                              className="form-control"
                             onChange={this.handleImageChange} />
                      
                  </div>
                </div>

                <div className="d-grid">
                  <button type="update" className="btn btn-primary" onClick={this.handlePost}>
                      update
                  </button>
                </div>

                  

                </div>
              </div>
          </form>
        )
        
      }
  }