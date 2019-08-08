import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarker } from '@fortawesome/free-solid-svg-icons'
import querystring from 'querystring';
import  AccountForm from  '../components/AccountForm';
import { throwStatement } from '@babel/types';

const BE_API = `${process.env.REACT_APP_BE_API_URL}/users/2`;
const parsed = querystring.parse(window.location.pathname);

export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BE_API_URL,
    withCredentials: true,
})

class Account extends Component {
    state  =  {
        user: {},
        editing: false
    }

    componentDidMount() {
        const userID = parsed[Object.keys(parsed)[0]];
        localStorage.setItem('userID', userID)
        axiosInstance
            .get(`/users/${userID}`)
            .then(res => {
                this.setState({
                    user: res.data
                })
            })
            .catch(err => console.log(err))
    }

    handleClick = (e) => {
      this.setState({
        ...this.state,
        editing: !this.state.editing
      })
    }
    render() {
        const user = this.state.user;
        if(user.id) {
          
        }
        const userInfo = 
        <div className="userAccount">
          <p>{user.company_name ? user.company_name : "Update Company Name"}</p>
          <p>{user.country ? user.country : "Update Country"}</p>
          <p>{user.email ? user.email : "Update Email"}</p>
          <p>{user.phone_number ? user.phone_number : "Update Phone Number"}</p>
        </div>
        return (
            <div className="accountPageContainer">
                <h1  className="accountHeaderMain">My Account</h1>
                <div className="accountPageLft">
                    <div className="accountPic" style={{backgroundImage: Object.keys(this.state.user).length > 0 ? `url(${this.state.user.pic})` : `url("https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80")`}}></div>
                    

                </div>
                <div className="accountPageRgt">
                    <div className="userInfo">
                      <div style={{width: "100%", display: "flex"}}>
                        <h1>{user.display_name}</h1>
                        <div className="location">
                            <FontAwesomeIcon className="location-icon" icon={faMapMarker} />
                            <p>{user.country}</p>
                        </div>
                        <button className="editBtn" onClick={(e) => this.handleClick(e)}>Edit Account</button>
                      </div>
                        {this.state.editing ? <AccountForm user={user}/> : userInfo }
                    </div>
                    
                </div>
            </div>
        )
    }
}


export default Account;