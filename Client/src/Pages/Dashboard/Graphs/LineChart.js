import React from "react";
import Chart from "chart.js";
import { StateHandler } from "../Other/api";
import Config from "../../ConfigFile";

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();

    this.state = {
      newData: new Array(10).fill(1)
    };

    this.sensorData = new Array(Config.numSensors);
    for (var i = 0; i < this.sensorData.length; i++) {
      this.sensorData[i] = new Array(Config.xLineTicks).fill(-1);
    }

    this.labels = [];
    for (let i = 0; i < Config.xLineTicks; i++) {
      this.labels.push(i);
    }
  }

  updateSensorData() {
    this.state.newData.map((value, i) => {
      this.sensorData[i].push(value);
      this.sensorData[i].shift();
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.newData != nextState.newData || this.state.newData;
  }

  componentDidUpdate() {
    this.updateSensorData();
    this.sensorData.map((sensor, i) => {
      this.myChart.data.datasets[i].data = sensor;
    });
    this.myChart.data.labels = this.labels;
    this.myChart.update();
  }

  getDatasets() {
    let datasets = [];
    this.sensorData.map((sensor, i) => {
      //this.myChart.data.datasets[i].data = sensor.data.map(d => d.value);
      datasets.push({
        label: i,
        data: sensor,
        fill: "none",
        backgroundColor: Config.sensorColours[i],
        pointRadius: 0,
        borderColor: Config.sensorColours[i],
        borderWidth: 1.3,
        lineTension: 0.2
      });
    });
    console.log(datasets);
    return datasets;
  }

  componentDidMount() {
    StateHandler.subscribe("sensorData", dataPoints => {
      if (dataPoints !== null) {
        this.setState({
          newData: dataPoints
        });
      }
    });

    this.myChart = new Chart(this.canvasRef.current, {
      type: "line",
      options: {
        animation: false,
        maintainAspectRatio: false,
        tooltips: {
          enabled: false
        },
        legend: {
          display: false,
          position: "top",
          usePointStyle: true
        },
        scales: {
          xAxes: [
            {
              display: false,
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                min: 0,
                max: 100
              },
              gridLines: {
                display: false
              }
            }
          ]
        }
      },
      data: {
        //labels: this.props.data.map(d => d.time),
        datasets: this.getDatasets()
      }
    });
  }

  render() {
    return <canvas ref={this.canvasRef} />;
  }
}

export default LineChart;
