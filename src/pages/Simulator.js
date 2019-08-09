import React, { Component } from 'react';
import SimulatorScreen from '../components/SimulatorScreen';
import cellphone from '../images/cellphone.png';

class Simulator extends Component {


    render() {
        return (
            <div className="simulatorContainer">
                <div className="leftContainer">

                </div>
                <div className="rightContainer">
                    <img src={cellphone}/>
                    <SimulatorScreen />

                </div>
            </div>
        )
    }
}

export default Simulator;