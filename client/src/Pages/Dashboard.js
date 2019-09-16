import React from 'react';
import { startStream, stopStream } from '../Misc/api';
import BarChart from '../Graphs/BarChart';
import LineChart from '../Graphs/LineChart';
import Config from '../Misc/config'
import Tile from '../Misc/Tile'

// Chart.defaults.global.defaultFontFamily = "Roboto, sans-serif";
// https://github.com/chartjs/Chart.js/issues/2437#issuecomment-216530491

class App extends React.Component {
  constructor(props) {
    super(props);
    this.colours = Config.sensorColours;
    this.state = {
      sensorData: [1,2,3,4,5,6,7,8,9,10],
      simulate: false
    };
    this.handleCheck = this.handleCheck.bind(this);
  }

  componentDidMount() {
    startStream((err, datapoints) => this.setState({ 
      sensorData: datapoints 
    }));
  }

  handleCheck(){
    this.setState({simulate: !this.state.simulate});
    if(this.state.simulate){
      startStream((err, datapoints) => this.setState({ 
        sensorData: datapoints 
      }));
    }else{
      stopStream();
    }
  }

  render() {
    return (
      <div className="">
        <Tile>
          <LineChart
            sensorData={this.state.sensorData}
            colors={this.colours}
            sim={this.state.simulate}
          />
        </Tile>
        <Tile>
          <BarChart
            sensorData={this.state.sensorData}
            colors={this.colours}
          />
        </Tile>
        {/* <label>Raw:</label>
        <input 
            type="checkbox"
            onChange={this.handleCheck}
          /> */}
      </div>
    );
  }
}

export default App;
