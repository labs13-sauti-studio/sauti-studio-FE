import React, { Component } from 'react';
import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BE_API_URL,
    withCredentials: true,
})

class AccountForm extends Component {
    state = {
        country: '',
        company_name: this.props.company_name,
        email: '',
        display_name: '',
        phone_num: '',
        isUpdating: false
    }
    
   
    handleInput = (e) => {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value
        })
    }
    editSelected = (e) => {
        e.preventDefault();
        const id = this.props.user.id
        const user =  this.state
        delete user.isUpdating
        toString(user.phone_num)
        axiosInstance
            .put(`users/${id}`, user)
            .then(res => {
                window.location.href = `/account/user_id=${id}`
            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <form  className="accountForm" >
                <input name="display_name" value={this.state.display_name} placeholder="Name" onChange={(e) => this.handleInput(e)}/>                
                <input name="company_name" value={this.state.company_name} placeholder="Company Name" onChange={(e) => this.handleInput(e)}/>
                <input name="email" value={this.state.email} placeholder="Email" onChange={(e) => this.handleInput(e)}/>
                <input name="country" value={this.state.country} placeholder="Country" onChange={(e) => this.handleInput(e)}/>
                <input name="phone_num" value={this.state.country} placeholder="Phone Number" onChange={(e) => this.handleInput(e)}/>              
                <button  onClick={(e) => this.editSelected(e)} >update</button>

            </form>
        )
    }
}

export default AccountForm;