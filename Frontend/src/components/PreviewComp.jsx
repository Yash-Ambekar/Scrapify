import React, { useState } from "react";
import "./PreviewComp.css";

const PreviewComp = () => {
  const [input, setInput] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
  
    await fetch("http://localhost:5000/sendLink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({link: input}),
    })
    .catch(error => {
      window.alert(error);
      return;
    });
  
  }
  

  return (
    <>
      <h1>Monitoro Usecase</h1>
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
        <button
          id="preview"
          onClick={onSubmit}
        >
          Send
        </button>
      </div>
      
    </>
  );
};

export default PreviewComp;
