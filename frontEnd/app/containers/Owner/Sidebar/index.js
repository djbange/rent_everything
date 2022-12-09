import React, { useState } from 'react';
import {AiFillHome} from "react-icons/ai";
import {BsListUl}from "react-icons/bs";
import {GrAddCircle}from "react-icons/gr";
import {CgProfile}from "react-icons/cg";
import {FaBars}from "react-icons/fa";
import './Sidebar.css';

import { NavLink } from 'react-router-dom';
//import Routes_p from '../myroutes';

const Sidebar = ({children}) => {

    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);
    const menuItem=[
        {
            path: "/owner/bookings",
            name:"Bookings",
            icon:<AiFillHome/>,
            //func: handleHome
        },
        {
            path:"/owner/list-items",
            name:"ViewMyItems",
            icon:<BsListUl/>,
            //func: handleViewMyItems()
        },
        {
            path:"/owner/post-item",
            name:"PostItem",
            icon:<GrAddCircle/>,
            //func: handlePostItem()
        }
    ]
    //{this.getItemInfo.call(this, item)}
    return (
        <div className="container">
           <div style={{width: isOpen ? "200px" : "50px", position: "fixed"}} className="sidebar" >
               <div className="top_section" style = {{position: "relative"}}>
                   
                   <div style={{marginLeft: isOpen ? "5px" : "0px", height:"100"}} className="bars">
                       <FaBars onClick={toggle}/>
                   </div>
               </div>
               

               <div>
                    {
                        menuItem.map((item, index)=>(
                            <NavLink to={item.path} key={index} className="link" activeclassName="active">

                                <div className="icon" >{item.icon}</div>
                                <div style={{display: isOpen ? "block" : "none"}} className="link_text">
                                    {item.name}
                                </div>

                            </NavLink>
                        ))
                    }
                </div>
            </div>  
           <main style = {{marginLeft: isOpen ? "200px": "55px",  overflow: "auto"}}>{children}</main>
        
    </div>
    );
};
export default Sidebar