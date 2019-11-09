import React from "react";
import Chart from "chart.js";
import { readStream } from "../Other/api";
import Config from "../ConfigFile";

class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newData: new Array(10).fill(0)
    };

    this.canvasRef = React.createRef();
    this.labels = [];
    for (let i = 1; i < Config.numSensors + 1; i++) {
      this.labels.push(i);
    }
  }

  componentDidUpdate() {
    this.myChart.data.labels = this.labels;
    this.myChart.data.datasets[0].data = this.state.newData;
    this.myChart.update(); // OI, should we copy this code into a new file, sorry yeh haven't we set up a file for THREE
}
// yeah. We can use the rest (i.e newData and shouldComponentUpdate and shit) no it's not yeah but we have to write a couple of functions
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.newData != nextState.newData;
  }

  componentDidMount() {
    readStream((err, datapoints) =>
      this.setState({
        newData: datapoints
      })
    );

    this.myChart = new Chart(this.canvasRef.current, {
      type: "bar",
      options: {
        animation: false,
        maintainAspectRatio: false,
        tooltips: {
          enabled: false
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                max: 100,
                stepSize: 10
              },
              gridLines: {
                display: false
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        }
      },
      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.props.title,
            data: this.props.sensorData,
            backgroundColor: Config.sensorColours,
            hoverBackgroundColor: Config.sensorColours
          }
        ]
      }
    });
  }

  render() {
    return <canvas ref={this.canvasRef} />;
  }
}

export default BarChart;
