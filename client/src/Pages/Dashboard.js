import React from 'react';
import { startStream, stopStream, setup } from '../Misc/api';
// import { startStream, stopStream } from '../Misc/mqttClient';
import BarChart from '../Graphs/BarChart';
import LineChart from '../Graphs/LineChart';
import Config from '../Misc/config'
import ControlTile from '../Components/ControlTile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdjust, faHome, faPlay, faWaveSquare, faBatteryThreeQuarters, faStopwatch, faPhoneAlt, faVideo } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

// Chart.defaults.global.defaultFontFamily = "Roboto, sans-serif";
// https://github.com/chartjs/Chart.js/issues/2437#issuecomment-216530491

const BaseComponent = (props) => {
  let classList = [props.baseClass];
  classList.push(props.darkmode ? props.dark : props.light);
  classList.push(props.className)
  return (
    <div className={classList.join(' ')}>
      {props.children}
    </div>
  );
}

const Container = (props) => {
  return (
    <BaseComponent
      baseClass="flex flex-wrap"
      dark="bg-dark-main"
      light="bg-main"
      {...props}
    />
  );
}

const Tile = (props) => {
  return (
    <BaseComponent
      baseClass="flex flex-wrap w-full h-full rounded-lg"
      dark="bg-dark-tile"
      light="bg-tile"
      {...props}
    />
  );
}

const Indicator = (props) => {
  let animClasses = ["pulseAnim w-2 h-2"];
  let textClasses = ["text-base font-mono pl-5"];
  if (props.connected) {
    textClasses.push("connText");
    animClasses.push("connected");
  } else {
    textClasses.push("disText");
    animClasses.push("disconnected");
  }
  return (
    <div className="m-auto flex flex-wrap flex justify-center mt-12">
      <div className={animClasses.join(' ')}></div>
      <p className={textClasses.join(' ')}>
        {props.connected ? "Connected" : "Disconnected"}
      </p>
    </div>
  );
}

const GloveState = (props) => {
  return(
    <div className="w-full flex flex-wrap justify-center mt-4">
      <FontAwesomeIcon icon={props.icon} size='1x' color='#dde1ee' />
      <p className="text-base font-mono text-gray-300 inline ml-6 -mt-1" >{props.stateValue}</p>
    </div>
  );
}

const Button = (props) => {
  return(
    <BaseComponent baseClass="controlButton w-1/2 bg-transparent block-inline content-center flex" {...props} >
       <div className="m-auto">
       <FontAwesomeIcon icon={props.icon} size='2x' color='#dde1ee' />
       </div>
    </BaseComponent>
  );
}

const StatusContainer = (props) => {
  return (
    <Tile className="" darkmode={props.darkmode}>
      <div className="w-full">
        <Indicator connected={props.connected} />
          <GloveState icon = {faBatteryThreeQuarters} stateValue = {props.batteryLevel}/>
          <GloveState icon = {faStopwatch} stateValue = {props.elapsedTime}/>
      </div>
      <Button icon={faPlay} className="rounded-bl-lg"/>
      <Button icon={faWaveSquare} className="rounded-br-lg"/>
    </Tile>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sensorData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      darkmode: true,
      connected: false,
      batteryLevel: '-',
      elapsedTime: '-'
    };
    this.handleCheck = this.handleCheck.bind(this);
  }

  componentDidMount() {
    startStream((err, datapoints) =>
      this.setState({
        sensorData: datapoints
      })
    );

    setup((err, conn, batt) => {
      this.setState({
        connected: conn,
        batteryLevel: batt
      })
    }
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
      <Container className='w-screen h-screen p-3' darkmode={this.state.darkmode}>
        <Container className="h-full lg:w-1/5 w-2/5 p-4" darkmode={this.state.darkmode}>
          <Container className="h-4/5 w-full" darkmode={this.state.darkmode}>
            <StatusContainer connected={this.state.connected} darkmode={this.state.darkmode} />
          </Container>
          <Container className="h-4/5 w-full pt-8" darkmode={this.state.darkmode}>
            <Tile className="" darkmode={this.state.darkmode}>
              <Button icon={faPhoneAlt} className="rounded-tl-lg"/>
              <Button icon={faVideo} className="rounded-tr-lg"/>
              <Button icon={faAdjust} className="rounded-bl-lg"/>
              <Button icon={faGithub} className="rounded-br-lg"/>
            </Tile>
          </Container>
        </Container>
        <Container className="h-full lg:w-2/5 w-3/5" darkmode={this.state.darkmode}>
          <Container className="w-full h-2/5 block p-4" darkmode={this.state.darkmode}>
            <Tile className="p-4" darkmode={this.state.darkmode}>
              <LineChart sensorData={this.state.sensorData} />
            </Tile>
          </Container>
          <Container className="w-full h-2/5 block p-4 " darkmode={this.state.darkmode}>
            <Tile className="p-4" darkmode={this.state.darkmode}>
              <BarChart sensorData={this.state.sensorData} />
            </Tile>
            </Container>
        </Container>
        <Container className="h-full lg:w-2/5 w-full p-4" darkmode={this.state.darkmode}>
          <Tile className="p-4" darkmode={this.state.darkmode}></Tile>
        </Container>
      </Container>
    );
  }
}

export default App;
