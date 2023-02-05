import "./styles.css";

import React, { useState } from "react";
import Quagga from "quagga";

const SearchRecyclables = () => {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [result, setResult] = useState("");
  const inputRef = React.useRef();

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const apiUrl = `https://world.openfoodfacts.org/api/v0/product/${query}.json`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.product && data.product.packaging) {
      setSearchResult({
        name: data.product.product_name,
        material: data.product.packaging
      });
    } else {
      setSearchResult({ name: data.product.product_name, material: null });
    }
  };
  const handleScan = () => {
    Quagga.decodeSingle(
      {
        decoder: {
          readers: ["code_128_reader"]
        },
        locate: true,
        src: inputRef.current.files[0]
      },
      function (result) {
        if (result && result.codeResult) {
          setResult(result.codeResult.code);
        } else {
          setResult("No code found");
        }
      }
    );
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  return (
    <div>
            
      <form onSubmit={handleSubmit}>
                
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter a barcode"
        />
                <button type="submit">Search</button>
              
      </form>
            
      <input type="file" ref={inputRef} accept="image/*" />
            <button onClick={handleScan}>Scan</button>
            
      {searchResult ? (
        <p>
                    {console.log(searchResult)}
                    The product with name "{searchResult.name}" is made out of "
          {searchResult.material}"           
          {searchResult.material ? "" : "not"} recyclable.         
        </p>
      ) : (
        ""
      )}
            <p>{result}</p>
          
    </div>
  );
};

export default SearchRecyclables;
