import React from 'react';
import { startStream, stopStream, setup } from '../Misc/api';
// import { startStream, stopStream } from '../Misc/mqttClient';
import BarChart from '../Graphs/BarChart';
import LineChart from '../Graphs/LineChart';
import Config from '../Misc/config'
import Tile from '../Misc/Tile'
import ControlTile from '../Components/ControlTile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdjust, faHome, faPlay, faWaveSquare, faBatteryThreeQuarters, faStopwatch, faPhoneAlt, faVideo } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

// Chart.defaults.global.defaultFontFamily = "Roboto, sans-serif";
// https://github.com/chartjs/Chart.js/issues/2437#issuecomment-216530491

class App extends React.Component {
  constructor(props) {
    super(props);
    this.colours = Config.sensorColours;
    this.state = {
      sensorData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      darkmode: true,
      connected: false,
      batteryLevel:'-',
      elapsedTime:'00:21'
    };
    this.handleCheck = this.handleCheck.bind(this);
  }

  componentDidMount() {
    startStream((err, datapoints) =>
      this.setState({
        sensorData: datapoints
      })
    );

    setup((err, conn, batt) =>
      this.setState({
        connected:conn,
        batteryLevel:batt
      })
    )
  }

  handleCheck() {
    this.setState({ simulate: !this.state.simulate });
    if (this.state.simulate) {
      startStream((err, datapoints) => this.setState({
        sensorData: datapoints
      }));
    } else {
      stopStream();
    }
  }

  render() {
    return (
      <div className="flex bg-dark-main w-screen h-screen flex-wrap p-3">
        <div className="flex flex-wrap bg-dark-main h-full lg:w-1/5 w-2/5 p-4">
          {/* <div className="bg-dark-main h-1/5 w-full flex flex-wrap">
            <Tile>
            <p className="text-base font-mono text-gray-300 w-full">We are a passionate team from Hills Road Sixth Form College - press help for more info.</p>
            
            </Tile>
          </div> */}
          <div className="bg-dark-main h-4/5 w-full">
            <div className="w-full h-full bg-dark-tile flex flex-wrap rounded-lg ">
            <div className="w-full">
                <div className={this.state.connected ? "m-auto flex flex-wrap flex justify-center mt-12 connText" : "m-auto flex flex-wrap flex justify-center mt-12 disText"}>
                <div className={this.state.connected ? "pulseAnim w-2 h-2 connected":"pulseAnim w-2 h-2 disconnected" }></div>
                <p className="text-base font-mono pl-5 ">{this.state.connected ? "Connected":"Disconnected"}</p>
              </div>
                <div className="">
                <div className="w-full flex flex-wrap justify-center mt-4">
                  <FontAwesomeIcon icon={faBatteryThreeQuarters} size='1x' color='#dde1ee' />
                  <p className="text-base font-mono text-gray-300 inline ml-6 -mt-1" >{this.state.batteryLevel}</p>
                </div>
                <div className="w-full flex flex-wrap justify-center mt-4">
                  <FontAwesomeIcon icon={faStopwatch} size='1x' color='#dde1ee' />
                  <p className="text-base font-mono text-gray-300 inline ml-5 -mt-1" >{this.state.elapsedTime}</p>
                </div>
                </div>                
              </div>
              <div className="controlButton w-1/2 h-1/3 bg-dark-tile block-inline content-center flex rounded-bl-lg">
                <div className="m-auto">
                  <FontAwesomeIcon icon={faPlay} size='2x' color='#dde1ee' />
                </div>
              </div>
              <div className="controlButton w-1/2 h-1/3 bg-dark-tile block-inline content-center flex rounded-br-lg">
                <div className="m-auto">
                  <FontAwesomeIcon icon={faWaveSquare} size='2x' color='#dde1ee' />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-dark-main h-4/5 w-full pt-8">
            <div className="w-full h-full bg-dark-tile flex flex-wrap rounded-lg ">
              
              <div className="controlButton w-1/2 h-1/3 bg-dark-tile block-inline content-center flex rounded-tl-lg">
                <div className="m-auto">
                  <FontAwesomeIcon icon={faPhoneAlt} size='2x' color='#dde1ee' />
                </div>
              </div>
              <div className="controlButton w-1/2 h-1/3 bg-dark-tile block-inline content-center flex rounded-tr-lg">
                <div className="m-auto">
                  <FontAwesomeIcon icon={faVideo} size='2x' color='#dde1ee' />
                </div>
              </div>
              <div className="controlButton w-1/2 h-1/3 bg-dark-tile block-inline content-center flex rounded-bl-lg">
                <div className="m-auto">
                  <FontAwesomeIcon icon={faAdjust} size='2x' color='#dde1ee' />
                </div>
              </div>
              <div className="controlButton w-1/2 h-1/3 bg-dark-tile block-inline content-center flex rounded-br-lg">
                <div className="m-auto">
                  <FontAwesomeIcon icon={faGithub} size='2x' color='#dde1ee' />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-dark-main flex flex-wrap h-full lg:w-2/5 w-3/5">
          <div className="bg-dark-main w-full h-2/5 block p-4  ">
            <Tile>
              <LineChart
                sensorData={this.state.sensorData}
                colors={this.colours}
                sim={this.state.simulate}
              />
            </Tile>
          </div>
          <div className="bg-dark-main w-full h-2/5 block p-4 ">
            <Tile>
              <BarChart
                sensorData={this.state.sensorData}
                colors={this.colours}
              />
            </Tile>
          </div>
        </div>
        <div className="bg-dark-main h-full lg:w-2/5 w-full p-4">
          <Tile></Tile>
        </div>
      </div>
    );
  }
}

export default App;
