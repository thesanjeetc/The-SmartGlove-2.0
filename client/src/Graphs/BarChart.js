import React from 'react';
import Chart from 'chart.js';
import Config from '../Misc/config.js'

class BarChart extends React.Component {
    constructor(props) {
      super(props);
      this.canvasRef = React.createRef();
      this.labels = [];
      for(let i = 0; i<Config.numSensors;i++){
        this.labels.push(i);
      }
    }
  
    componentDidUpdate() {
      this.myChart.data.labels = this.labels;
      this.myChart.data.datasets[0].data = this.props.sensorData;
      this.myChart.update();
    }
  
    componentDidMount() {
      this.myChart = new Chart(this.canvasRef.current, {
        type: 'bar',
        options: {
          animation: false,
          maintainAspectRatio: false,
          tooltips: {
            enabled: false
          },
          legend: {
            display: false,
         },
          scales: {
            yAxes: [
              {
                ticks: {
                  min: 0,
                  max: 100,
                  stepSize:10
                },
                gridLines: {
                  display:false
              }
              }
            ],
            xAxes: [
              {
                gridLines: {
                  display:false
              }
              }
            ]
          }
        },
        data: {
          labels: this.labels,
          datasets: [{
            label: this.props.title,
            data: this.props.sensorData,
            backgroundColor: Config.sensorColours,
            hoverBackgroundColor: Config.sensorColours
          }]
        }
      });
    }
  
    render() {
      return (
          <canvas ref={this.canvasRef} />
      );
    }
  }

  export default BarChart;