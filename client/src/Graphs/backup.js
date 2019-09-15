import React from 'react';
import Chart from 'chart.js';
import Config from '../config.js'

class LineChart extends React.Component {
    constructor(props) {
      super(props);
      this.canvasRef = React.createRef();
      this.sensorData = new Array(Config.numSensors);
      for (var i = 0; i < this.sensorData.length; i++) {
        this.sensorData[i] = new Array(Config.xLineTicks).fill(0);
      }

      this.labels = [];
      for(let i = 0; i<Config.numSensors;i++){
        this.labels.push(i);
      }

    }
  
    componentDidUpdate() {
      this.sensorData.map((sensor, i) => {
        this.myChart.data.datasets[i].data = sensor;
      });   
      this.myChart.data.labels = this.labels;
      this.myChart.update();
    }
  
    updateSensorData(){
        this.props.sensorData.map((value, i) => {
            this.sensorData[i].push(value);
            this.sensorData[i].shift();
        });
    }

    getDatasets(){
      let datasets = [];  
      this.updateSensorData();
      this.sensorData.map((sensor, i) => {
        //this.myChart.data.datasets[i].data = sensor.data.map(d => d.value);
        datasets.push(
          {
            label: i,
            data: sensor,
            fill: 'none',
            backgroundColor: this.props.colors[i],
            pointRadius: 0,
            borderColor: this.props.colors[i],
            borderWidth: 1.3,
            lineTension: 0.5
          }
        )
      });
      return datasets;
    }
  
    componentDidMount() {
      this.myChart = new Chart(this.canvasRef.current, {
        type: 'line',
        options: {
          maintainAspectRatio: false,
          tooltips: {
            enabled: false
          },
          legend: {
            position: "left",
            usePointStyle: true
        },
          scales: {
            xAxes: [
              {
                type: 'time',
                time: {
                  unit: 'week'
                },
                gridLines: {
                  display:false
              }
              }
            ],
            yAxes: [
              {
                ticks: {
                  min: 0
                },
                gridLines: {
                  display:false
              }
              }
            ]
          }
        },
        data: 
          { 
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