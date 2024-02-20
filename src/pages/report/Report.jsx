import React, { useEffect, useState } from "react";
import "../report/report.scss";
import report_logo from "../../assets/images/7079771_3324619.svg";
import report_logo_nano from "../../assets/images/1311213_313.svg";
import * as XLSX from "xlsx";

const Report = () => {
  const [data, setData] = useState([]);
  const [nanoData, setNanoData] = useState([]);
  const [select, setSelect] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData();
      fetchNanoData();
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchAllData = async () => {
    var url;
    try {
      url = "http://localhost:4000/sensor/getallSensor";
      console.log("url", url);
      const response = await fetch(url);
      const dataVal = await response.json();
      setData(dataVal);
    } catch (error) {
      console.log("error", error);
    }
  };
  const fetchNanoData = async () => {
    var url;
    try {
      // if (select == null) {
        // url = 'http://localhost:4000/sensor/getNanoGraph?graphName=temperature'; 
      // }else {
        url = `http://localhost:4000/sensor/getNanoGraph?graphName=${select}`;
      // }
      console.log("url", url);
      const response = await fetch(url);
      const dataVal = await response.json();
      setNanoData(dataVal)
    } catch (error) {
      console.log("error", error);
    }
  };
  // console.log(nanoData);

  var density = [];
  var temperature = [];
  var viscosity = [];
  var dtn = [];

  for (let index = 0; index < data.length; index++) {
    density[index] = data[index].density;
    temperature[index] = data[index].temperature;
    viscosity[index] = data[index].viscosity;
    dtn[index] = data[index].dtn;
  }
  console.log("selected: ",select);
  console.log(nanoData);

    // const handleDownload = () => {
    //     const values = [density, viscosity, temperature, dtn];
    //     const head = ["density", "viscosity", "temperature", "dtn"];
      
    //     // Combine headers with data
    //     const sheetData = values.reduce((acc, col, index) => {
    //       col.unshift(head[index]); // Add the header to the beginning of each column
    //       return acc.concat(col.map((value) => [value])); // Combine each column with data
    //     }, []);
      
    //     const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
    //     XLSX.writeFile(workbook, "3lions.xlsx");
    //   };

    const handleDownload = () => {
      const data = [['density'], ...density.map(value => [value])];
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
      XLSX.writeFile(workbook, "excel_data.xlsx");
    };  
    
    const handleDownloadNano = () => {
      const val = nanoData[0]?.data;
      const time = nanoData[0]?.timestamp;
      const data = [['temperature','timestamp'], ...val.map(value => [value, time])];
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
      XLSX.writeFile(workbook, "excel_data.xlsx");
    };

    const options = ["temperature", "battery", "sound-rms", "humidity", "flux-rms", "speed"];
    const handleOptionChange = (event) => {
      let value = event.target.value;
      setSelect(value);
    };

  return (
    <div className="report">
      <div className="header">
        <div className="title">
          <h1>Excel</h1>
        </div>
      </div>
      <div className="body">
        <div className="xyma">
          <div className="name">
            <h1>Xyma Sensors</h1>
          </div>
          <div className="bottom">
            <div className="logo">
              <img
                src={report_logo}
                alt="report_logo"
                style={{ width: "400px", height: "400px" }}
              />
            </div>
            <div className="input">
          <label htmlFor="dropdown">Select</label>
          <select className="value"
            id="dropdown"
            onChange={handleOptionChange}
            value={select || ""}
          >
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          </div>
            <div
              className="xl_btn"
              onClick={() => {
                handleDownload();
              }}
            >
              <span>Download</span>
            </div>
          </div>
        </div>
        <div className="nano">
          <div className="name">
            <h1>Nano Precise Sensors</h1>
          </div>
          <div className="bottom">
            <div className="logo">
              <img
                src={report_logo_nano}
                alt="report_logo"
                style={{ width: "400px", height: "400px" }}
              />
            </div>
            <div className="input">
          <label htmlFor="dropdown">Select</label>
          <select className="value"
            id="dropdown"
            onChange={handleOptionChange}
            value={select || ""}
          >
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          </div>
            <div className="xl_btn" 
            onClick={() => {
              handleDownloadNano();
            }}>
              <span>Download</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
