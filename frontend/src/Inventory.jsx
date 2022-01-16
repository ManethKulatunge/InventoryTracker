import React, {useState} from "react";
import axios from "axios";
function CSVgenerator() {
  const [text, setText] = useState("");
  const [data, setData] = useState("");

  function productCSV() {
    axios.get("http://localhost:5000/api/inventory/csv",  { crossdomain: true }).then(response => {
      setText("Check your project folder for the CSV file with exported data");
      setData(JSON.stringify(response.data));
      console.log(response)
    });
  }return (
    <div>
      <button class="big-button" onClick={productCSV}>
        Generate CSV
      </button>
      <h2>{text}</h2>
      <p class='small'>{data}</p>
    </div>
  )
}

export default CSVgenerator;