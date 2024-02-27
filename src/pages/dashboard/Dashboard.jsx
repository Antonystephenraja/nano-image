import "../dashboard/dashboard.scss";
import density from '../../assets/images/density copy.png';
import { useEffect, useState } from "react";
import temperature from '../../assets/images/thermometer copy.png';
import visco from '../../assets/images/water copy.png';
import dtn from '../../assets/images/lab.png';
import { RadioButton, RadioGroup } from "react-radio-buttons";
import ReactApexChart from 'react-apexcharts';
// import temp from '../../assets/images/frame_800.png'
import Temp from '../../assets/images/frame_800.png'

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [alldata, setAllData] = useState([]);
  const [sendData, setSendData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      var url;
      try {
        url = 'http://localhost:4000/sensor/getsensor';
        const response = await fetch(url);
        const datafetchVal = await response.json();
        setData(datafetchVal);
      } catch (error) {
        console.log("error", error)
      }
    };
    const interval = setInterval(() => {
      fetchData();
      fetchAllData();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [])

  const fetchAllData = async () => {
    var url;
    try {
      url = 'http://localhost:4000/sensor/getallSensor';
      console.log('url', url);
      const response = await fetch(url);
      const dataVal = await response.json();
      setAllData(dataVal);
    } catch (error) {
      console.log("error",error);
    }
  };

  console.log("data", alldata);

  let temp = [];
  let den = [];
  let vis = [];
  let dt = [];
  let time = [];

  for (let i = 0; i < alldata.length; i++) {
    temp[i] = alldata[i]?.temperature;
    den[i] = alldata[i]?.density;
    vis[i] = alldata[i]?.viscosity;
    dt[i] = alldata[i]?.dtn;
    time[i] = alldata[i]?.updatedAt;
  }

  console.log("sensorData",sendData);

  const chartOptions = {
    grid: {
      show: false,
    },
    series: [
      {
        name: 'temp',
        data: sendData,
        stroke: {
          curve: 'smooth',
          dashArray: [5, 5], // Set the dash pattern
        },
      },
    ],
    chart: {
      height: 500,
      type: 'line',
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: time,
      labels: {
        style: {
          colors: '#ffffff',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#ffffff',
        },
      },
    },
    tooltip: {
      theme: "dark", // Set the theme to dark
      style: {
        background: "#000000", // Set the background color to black
        color: "#ffffff", // Set the text color to white
      },
      y: {
        title: {
          formatter: function(seriesName) {
            return 'Value: ';
          },
        },
        formatter: function(value) {
          return value;
        },
      },
      marker: {
        show: true,
      },
    },
  };

  console.log('data', data)

  const handleOptionChange = (value) => {
    console.log("val",value);
    switch (value) {
      case 'Density':
        setSendData(den);
        break;
      case 'Viscosity':
        setSendData(vis);
        break;
      case 'Temperature':
        setSendData(temp);
        break;
      case 'Dtn':
        setSendData(dt);
        break;
      default:
        setSendData(temp);
        break;
    }
  };

  return (
    <div className="">
      <div className="grid grid-rows-1 lg:grid-rows-2">
        <div className="grid gap-3 grid-cols-1  lg:grid-cols-2">
          <div className="bg-[#fffdfdec] rounded-lg h-[42vh]">
          <h4 className="font-bold text-xl ml-3 mt-2">Ports:</h4> 
            <div className="grid mt-4 grid-rows-2">
              <div className="grid gap-2 grid-cols-2">
              <div className="bg-[#f8ae9b] grid grid-cols-2 rounded-lg ml-2 h-[15vh] justify-center items-center">
                <img src={density} alt="" className="ml-4" style={{ width: '80px' }} />
                <div>
                  <h1 className="font-bold">Density</h1>
                  <span className="font-bold text-xl">56 kg/m³</span>
                </div>
              </div>

                <div className="bg-[#f8ae9b] grid grid-cols-2   rounded-lg  mr-2 h-[15vh] justify-center items-center">
                <img src={visco} alt="" className="ml-4" style={{ width: '80px' }} />
                <div>
                  <h1 className="font-bold">Viscosity</h1>
                  <span className="font-bold text-xl">78 cSt</span>
                </div>
                </div>
              </div>
              <div className="grid gap-2 mt-2 grid-cols-2">
                <div className="bg-[#f8ae9b] rounded-lg grid grid-cols-2  ml-2 h-[15vh] justify-center items-center">
                    <img src={temperature} className="ml-4" alt="" style={{ width: '80px' }} />
                    <div className="right">
                      <h1 className="font-bold">Temperature</h1>
                      <span className="font-bold text-xl">201.48°C</span>
                    </div>
                  </div>
                  <div className="bg-[#f8ae9b] rounded-lg  mr-2 grid grid-cols-2  h-[15vh] justify-center items-center">
                    <img src={dtn} alt="" className="ml-4" style={{ width: '80px' }} />
                    <div className="right">
                      <h1 className="font-bold">TDN</h1>
                      <span className="font-bold text-xl">56.9</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
          <div className="bg-[#fffdfdec] rounded-lg h-[42vh]">
          <h4 className="font-bold text-xl ml-3 mt-2">Camera Feed:</h4> 
            <div className="grid grid-cols-2">
              <div>
                Temperature
              </div>
              <div className="mr-4 rounded-lg">
                <img src={Temp} alt="img" />
              </div>
            </div>
          </div>

        </div>
        <div className="grid gap-3 mt-3 grid-cols-1 lg:grid-cols-2">
          <div className="bg-[#fffdfdec] rounded-lg h-[42vh]">
            <div className="list ml-4 mr-4">
            <h4 className="font-bold text-xl ml-2 mt-2 ">Analytics:</h4> 
              <RadioGroup onChange={handleOptionChange} horizontal>
                <RadioButton value="Density" rootColor="#2196F3" pointColor="#2196F3">
                  Density
                </RadioButton>
                <RadioButton value="Viscosity" rootColor="#2196F3" pointColor="#2196F3">
                  Viscosity
                </RadioButton>
                <RadioButton value="Temperature" rootColor="#2196F3" pointColor="#2196F3">
                  Temperature
                </RadioButton>
                <RadioButton value="Dtn" rootColor="#2196F3" pointColor="#2196F3">
                  TDN
                </RadioButton>
              </RadioGroup>
            </div>
            <ReactApexChart className="bg-[#979797cb] rounded-lg ml-4 mr-4 mt-4" options={chartOptions} series={chartOptions.series} type='line' height="65%" />
          </div>
          <div className="bg-[#fffdfdec] rounded-lg h-[42vh]">
            cols2
          </div>
        </div>
      </div>
      {/* <div className="boxes">
        <div className="density box">
          <div className="left">
            <img src={density} alt="" style={{ width: '80px' }} />
          </div>
          <div className="right">
            <h1>Density</h1>
            <span>{data[0]?.density} kg/m³</span>
          </div>
        </div>

        <div className="viscosity box">
          <div className="left">
            <img src={visco} alt="" style={{ width: '80px' }} />
          </div>
          <div className="right">
            <h1>Viscosity</h1>
            <span>{data[0]?.viscosity} cSt</span>
          </div>
        </div>
        <div className="temperature box">
          <div className="left">
            <img src={temperature} alt="" style={{ width: '80px' }} />
          </div>
          <div className="right">
            <h1>Temperature</h1>
            <span>{data[0]?.temperature} °C</span>
          </div>
        </div>
        <div className="dtn box">
          <div className="left">
            <img src={dtn} alt="" style={{ width: '80px' }} />
          </div>
          <div className="right">
            <h1>TDN</h1>
            <span>{data[0]?.dtn}</span>
          </div>
        </div>
      </div>

      <div className="graph_boxes">
        <div className="list">
          <RadioGroup onChange={handleOptionChange} horizontal>
            <RadioButton value="Density" rootColor="#2196F3" pointColor="#2196F3">
              Density
            </RadioButton>
            <RadioButton value="Viscosity" rootColor="#2196F3" pointColor="#2196F3">
              Viscosity
            </RadioButton>
            <RadioButton value="Temperature" rootColor="#2196F3" pointColor="#2196F3">
              Temperature
            </RadioButton>
            <RadioButton value="Dtn" rootColor="#2196F3" pointColor="#2196F3">
              TDN
            </RadioButton>
          </RadioGroup>
        </div>
        <ReactApexChart options={chartOptions} series={chartOptions.series} type='line' height={550} />
      </div>
       */}

    </div>
  );
};

export default Dashboard;