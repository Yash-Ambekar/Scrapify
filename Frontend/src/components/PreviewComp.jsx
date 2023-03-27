/*global chrome*/

import React, { useState } from "react";
// import puppeteer from "puppeteer";
//CSS import
import "./PreviewComp.css";

const PreviewComp = () => {
  const [input, setInput] = useState("");
  const [postresponse, setPostResponse] = useState("");
  const [getresponse, setGetResponse] = useState("");
  const [HTML, setHTML] = useState("");
  
  //Function to show preview
  async function preview(e) {
    e.preventDefault(); 
    const response = await fetch(`http://localhost:5000/connect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: input }),
    });
    if (!response.ok) {
      const message = `An error has occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }

    // const record = await response.json();
    const text = await response.body.getReader().read()
    // const blob = new Blob(text.value);
    // const url = URL.createObjectURL(blob);
    const decoder = new TextDecoder("utf-8")
    const html = decoder.decode(text.value);
    setHTML(html);
    
  }

  //Submit Function when clicked 'Send'
  async function onSubmit(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/sendLink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ link: input }),
    });
    if (!response.ok) {
      const message = `An error has occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }

    const record = await response.json();
    setPostResponse(record);
  }

  async function getData(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/getData");
    if (!response.ok) {
      const message = `An error has occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }

    const record = await response.json();
    setGetResponse(record);
  }

  return (
    <>
      <h1>Scrapify</h1>
      <div className="inputButton">
        <input
          type="text"
          name="link"
          id="Link"
          placeholder="Enter Link"
          onChange={(e) => {
            e.preventDefault();
            setInput(e.target.value);
          }}
        />
        <button id="send" onClick={onSubmit}>
          Send
        </button>
        {postresponse && (
          <button id="getData" onClick={getData}>
            Get the Data
          </button>
        )}
        <div className="preview">
        <button onClick={preview}>Preview</button>
      </div>
      </div>
      
      <div>
        <h1>
          {getresponse && getresponse.default.security
            ? getresponse.default.security
            : postresponse}
        </h1>
        <h1>
          {getresponse && getresponse.default.price
            ? getresponse.default.price
            : postresponse}
        </h1>
      </div>
      {HTML && <iframe srcDoc={HTML} width = "1024px" height="638px"></iframe>}
    </>
  );
};

export default PreviewComp;
