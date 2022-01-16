import React,{useState,useCallback,useEffect} from "react";
import markerIconPng from "leaflet/dist/images/marker-icon.png"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {Icon} from 'leaflet'


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


const center = [51.505, -0.09];
const axios = require('axios');


let marker_cord;
let lat_cord;
let lng_cord; 

function MapComp (){
 
  const [map, setMap] = useState(null)
  const [markers,setMarkers]= useState([])
  const [current_mark,setcurrentmarker]=useState(-1)
   
  
  
  


  useEffect(()=>{

    async function fetchmyapi(){
    const res=await axios.get('http://127.0.0.1:5000/getall');
    setMarkers(Object.values(res.data));
   
    
   
    
    }
    fetchmyapi()
    
  
  
  },[])


  const downloadFile = ({  fileName, fileType }) => {
    // Create a blob with the data we want to download as a file
    const data=JSON.stringify(markers);
  
    const blob = new Blob([data], { type: fileType })
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }
  
  const exportToJson = e => {
    e.preventDefault()
    downloadFile({
      
      fileName: 'users.json',
      fileType: 'text/json',
    })
  }
  

  


 

const getcoord=async()=>{
  const cords=map.getCenter();
   await axios({
    method: 'post',
    url: 'http://127.0.0.1:5000/add',
    params: {
      lat: cords.lat,
      lng: cords.lng,
    }
  });
  getalldata();

}

const deletecoord=async(cur_id,lat,lng)=>{

  let temp_lng=parseFloat(lng["lng"]);
  let temp_lat=parseFloat(lat["lat"]);

  if(current_mark==1 &&temp_lat==lat_cord&&temp_lng==lng_cord){
    
    map.removeLayer(marker_cord);

  }
 
  await axios({
    method: 'DELETE',
    url: 'http://127.0.0.1:5000/delete',
    params: {
      current_id:cur_id
    }
  });
  getalldata();
  

}






const getalldata=async()=>{
  
  const res=await axios.get('http://127.0.0.1:5000/getall');
  setMarkers(Object.values(res.data));
 
}


function move_map(curlat,curlng){
 
  if(current_mark==1){

    map.removeLayer(marker_cord);

  }

  lat_cord=parseFloat(curlat["lat"]);
  lng_cord=parseFloat(curlng["lng"]);
  marker_cord=new L.marker([curlat["lat"], curlng["lng"]]);
  
  setcurrentmarker(1);
  map.addLayer(marker_cord);
  map.panTo(new L.LatLng(lat_cord,lng_cord),13);
}

function Item(props) {
  const { date, lat, lng, } = props.message;
  


  return(
    
    
               <tbody>
        <tr>   
              <td onClick={() => { move_map({lat},{lng});}} >GO</td>
                    <td width="150px">{lat}</td>
                    <td width="150px">{lng}</td>
                    <td onClick={() => { deletecoord({date},{lat},{lng});}}>Delete
                    </td>
                    </tr>
              </tbody>



    
    

  
 
 


   );}
  return (
  <div class="flex-container" >
        <div>
     
     <button onClick={getcoord}> Save the middle </button> 
     <button onClick={exportToJson}>Download all data</button>
     <table class="table table-bordered">
       <thead>
     <tr>   
                 <th wscope="col">GO</th>
                 <th scope="col" width="150px">LAT</th>
                 <th scope="col"  width="150px">LNG</th>
                 <th scope="col">DELETE</th>
                 </tr>
           </thead>
     { markers.map((msg) => <Item key={msg} message={msg} />)}

     </table>

     

    </div>
    <div class="container">

    <MapContainer style={{ width: "100%", height: "100vh" }} center={center} zoom={15} whenCreated={setMap}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
    </div>

  </div>

  );
};

export default MapComp;
