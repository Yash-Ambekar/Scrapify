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
  const [loader, setLoader] = useState("");
  const [select, setSelect] = useState("");


  //Function to show preview
  async function preview(e) {
    e.preventDefault();
    const response = await fetch(`http://localhost:8080/connect`, {
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
    const text = await response.body.getReader().read();
    // const blob = new Blob(text.value);
    // const url = URL.createObjectURL(blob);
    const decoder = new TextDecoder("utf-8");
    const html = decoder.decode(text.value);
    setHTML(html);
    setLoader(false);
  }

  //Submit Function when clicked 'Send'
  async function onSubmit(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/sendLink", {
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

    const response = await fetch("http://localhost:8080/getData");
    if (!response.ok) {
      const message = `An error has occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }

    const record = await response.json();
    setGetResponse(record);
  }

  async function docker(e) {
    e.preventDefault();
    setLoader("Loading....");
    const response = await fetch("http://localhost:8080/docker", {
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

    const blob = await response.blob();
    const linkOfPage = URL.createObjectURL(blob);
    console.log(linkOfPage);
    setHTML(linkOfPage);
    setLoader("");
  }

  async function apify(e) {
    e.preventDefault();
    
    const response = await fetch("http://localhost:8080/apify", {
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
    // console.log(response)
    
    // setHTML(linkOfPage);
  }
  async function getHTML(e){
    e.preventDefault();
    setLoader("Loading....");
    const response = await fetch("http://localhost:8080/getdata",  {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ link: input }),
    })

    if (!response.ok) {
      const message = `An error has occurred: ${response.statusText}`;
      window.alert(message);
      return;
    } 

    const blob = await response.blob();
    const linkOfPage = URL.createObjectURL(blob);
    console.log(linkOfPage);
    setHTML(linkOfPage);

    setLoader("");

  }

  function frameHandler(){
    if(window.frames[0]){
      window.frames[0].window.addEventListener('click', (e)=>{
        console.log(e.target.className)
        setSelect(e.target.className)
      })
    }
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
          <button onClick={getHTML}>Preview</button>
        </div>
        <button onClick={docker}>Browserless</button>
        <button onClick={apify}>Apify</button>
      </div>

      {loader && <div>
        <h1>{loader}</h1>
      </div>}

      <div className="previewDiv">
        {HTML && (
          <iframe
            id="previewFrame"
            src={HTML}
            onLoad={frameHandler}
          />
        )}
        {HTML && <div className="elementSelection">
          <div className="attribute">
            <h2>Attribute name</h2>
            {select && <h2>{select}</h2>}
          </div>

        </div>}
      </div>
    </>
  );
};

export default PreviewComp;
