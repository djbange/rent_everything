import React from 'react';
import Sidebar from 'containers/Owner/Sidebar/Loadable';

export default class Owner extends React.Component{

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
      }

    render() {
        return (
              <div style = {{paddingTop : '0px'}}>
                  <Sidebar />
              </div>
        )
        
      }
  }