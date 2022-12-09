import React from 'react';
import Sidebar from 'containers/Owner/Sidebar/Loadable';

export default class Profile extends React.Component{

    constructor(props){
        super(props);
        this.state = {
                item : this.props.dataParentToChild,
                message : ""
        }
    }

    componentDidMount() {
        var id = sessionStorage.getItem("id");
        console.log(id)
        //globalEvents.trigger('getting data',)
      }

    render() {
        return (
          <div className = "sidebaralign">
              <div>
                <Sidebar />
              </div>
              <div>
                <h1>Profile </h1>
              </div>
          </div>
          
        )        
      }
  }