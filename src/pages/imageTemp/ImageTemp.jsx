import React from "react";
import { useState, useEffect } from "react";
import "../imageTemp/imagetemp.scss";
import red from '../../assets/images/alert-red.png'
import green from '../../assets/images/alert-green.png'

const ImageTemp = () => {
  const [data, setData] = useState(null);
  const [data2, setData2] = useState(null);
  const [imageSrc, setimageSrc] = useState('xyma.png');
  const [imageSrc2, setimageSrc2] = useState('xyma.png');
  const [temperature, setTemperature] = useState();
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      var url;
      try {
        url = "http://localhost:4000/sensor/getImage";
        const response = await fetch(url);
        const datafetchVal = await response.json();
        setData(datafetchVal);
      } catch (error) {
        console.log("error", error);
      }
    };
    const fetchDataimage2 = async () => {
      var url;
      try {
        url = "http://localhost:4000/sensor/getImage2";
        const response = await fetch(url);
        const datafetchVal = await response.json();
        setData2(datafetchVal);
      } catch (error) {
        console.log("error", error);
      }
    };
    const interval = setInterval(() => {
      fetchData();
      fetchDataimage2();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (data !== null && data.length > 0 && data[0].image) {
      const binaryData = new Uint8Array(data[0].image.data.data);
      const stringValue = new TextDecoder("utf-8").decode(binaryData);
      setimageSrc(stringValue);
      if (data[0].temperature) {
        setTemperature(data[0].temperature);
      } else {
        setTemperature(null);
      }
    } else {
      setimageSrc('xyma.png');
      setTemperature(null);
    }
    //image 2
    if (data2 !== null && data2.length > 0 && data2[0].image) {
      const binaryData = new Uint8Array(data2[0].image.data.data);
      const stringValue = new TextDecoder("utf-8").decode(binaryData);
      setimageSrc2(stringValue);
      if (data2[0].alert) {
        setAlert(data2[0].alert);
      } else {
        setTemperature(null);
        setAlert(false);
      }
    } else {
      setimageSrc2('xyma.png');
      setTemperature(null);
    }
  }, [data2]);
  console.log(alert)

  return (
    <div className="imageTemp">
      <div className="temperature">
        <h1>Temperature: {temperature}°C</h1>
        <h1 className="flex gap-3.5 justify-center items-center">Alert: 
          <img src={alert ? red : green} alt="alert" style={{width:'40px'}} />
        </h1>
      </div>
      <div className="image">
        <div className="tempcam">
        <img src={require(`../../upload/${imageSrc}`)} alt="temp_cam" style={{ width: "95%" }} />
        </div>
        <div className="normalcam">
          <img src={require(`../../upload2/${imageSrc2}`)} alt="normal_cam" style={{ width: "95%" }} />
        </div>
      </div>
    </div>
  );
};

export default ImageTemp;
