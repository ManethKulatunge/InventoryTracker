import React, {useState} from "react";
import axios from "axios";function Quotes() {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");function getQuote() {
    axios.get("http://localhost:5000/api/inventory/csv",  { crossdomain: true }).then(response => {
      setText(response.data.text);
      setAuthor(response.data[0].name);
      console.log(response.data[0].name)
    });
  }return (
    <div>
      <button onClick={getQuote}>
        Generate Quote
      </button>
      <h1>{text}</h1>
      <h3>{"-" + author}</h3>
    </div>
  )
}export default Quotes;