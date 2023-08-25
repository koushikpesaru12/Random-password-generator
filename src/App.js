import React, { useState, useEffect } from "react";

import "./App.css";

function App() {
  const [password, setPassword] = useState("");
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [isUppercase, setIsUppercase] = useState(true);
  const [isLowercase, setIsLowercase] = useState(true);
  const [isNumber, setIsNumber] = useState(true);
  const [isSymbol, setIsSymbol] = useState(true);
  const [passwordLength, setPasswordLength] = useState(12);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const storedPasswords = JSON.parse(localStorage.getItem('passwordHistory')) || [];
    setPasswordHistory(storedPasswords);
  }, []);

  const generatePassword = () => {
    if (!isUppercase && !isLowercase && !isNumber && !isSymbol) {
      setPopupMessage("Error: Select above option");
      setPopupVisible(false);
      return;
    }

    if (passwordLength <= 4) {
      setPopupMessage("Invalid password length");
      setPopupVisible(false);
      return;
    }

    const characters = [
      { enabled: isUppercase, value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
      { enabled: isLowercase, value: "abcdefghijklmnopqrstuvwxyz" },
      { enabled: isNumber, value: "0123456789" },
      { enabled: isSymbol, value: "!@#$%^&*()_+[]{}|;:,.<>?" }
    ];

    let newPassword = "";

    for (let i = 0; i < passwordLength; i++) {
      const randomCharType = characters.filter(charType => charType.enabled);
      if (randomCharType.length === 0) {
        break;
      }
      const randomIndex = Math.floor(Math.random() * randomCharType.length);
      const selectedCharType = randomCharType[randomIndex];
      const randomCharIndex = Math.floor(Math.random() * selectedCharType.value.length);
      newPassword += selectedCharType.value[randomCharIndex];
    }

    if (newPassword === "") {
      setPopupMessage("Nothing selected");
      setPopupVisible(false);
      return;
    }

    setPassword(newPassword);
    setPopupVisible(false); 
    storePasswordInLocalStorage(newPassword);
  };

  const storePasswordInLocalStorage = (newPassword) => {
    const storedPasswords = JSON.parse(localStorage.getItem('passwordHistory')) || [];
    if (storedPasswords.length >= 5) {
      storedPasswords.shift(); 
    }
    storedPasswords.push(newPassword);
    localStorage.setItem('passwordHistory', JSON.stringify(storedPasswords));
    setPasswordHistory(storedPasswords);
  };

  const clearHistory = () => {
    localStorage.removeItem('passwordHistory');
    setPasswordHistory([]);
  };

  const copyPassword = () => {
    if (password.trim().length === 0) {
      setPopupMessage("Error: Nothing to copy");
    } else {
      setPopupMessage("Success: Password copied to clipboard");
      const textAreaEl = document.createElement("textarea");
      textAreaEl.value = password;
      document.body.appendChild(textAreaEl);
      textAreaEl.select();
      document.execCommand("copy");
      textAreaEl.remove();
    }
    setPopupVisible(false);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  return (
    <div className="App">
      <div className="generator">
        <h2 className="generator__title">Random Password Generator</h2>
        <div className="checkboxes">

        <h4 className="password">{password}</h4>

        <div className="password-length">
          <label>Password Length:</label>
          <input
            type="number"
            value={passwordLength}
            onChange={(e) => setPasswordLength(Math.max(0, parseInt(e.target.value)))}
          />
         </div>
          <div className="uppercase">
          <label>
            <input
              type="checkbox"
              checked={isUppercase}
              onChange={() => setIsUppercase(!isUppercase)}
            />
            Uppercase
          </label></div>
          <div className="lowercase">
          <label>
            <input
              type="checkbox"
              checked={isLowercase}
              onChange={() => setIsLowercase(!isLowercase)}
            />
            Lowercase
          </label></div>
          <div className="number">
          <label>
            <input
              type="checkbox"
              checked={isNumber}
              onChange={() => setIsNumber(!isNumber)}
            />
            Numbers
          </label></div>
          <div className="symbol">
          <label>
            <input
              type="checkbox"
              checked={isSymbol}
              onChange={() => setIsSymbol(!isSymbol)}
            />
            Symbols
          </label>
        </div>

         
        </div>
       <div className="generator__form-actions">
        <button onClick={generatePassword} className="btn generate-btn">
          Generate Password
        </button>
        <button onClick={copyPassword} className="btn copy-btn">
          Copy Password
        </button>
        </div>

       <div className="popup"><center>
        <div className={`popup ${popupVisible ? "visible" : ""}`}>
          <span>{popupMessage}</span>
          <button onClick={closePopup}>close</button>
        </div>
        </center></div>

        <div className="history-form">
          <center className="history"><button onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? "Hide History" : "Show History"}
          </button></center>
          {showHistory && (
            <div className="password-history">
              <h4>Previous Generated Passwords</h4>
              <button onClick={clearHistory} className="btn clear-history-btn">
                Clear History
              </button>
             
              <ul>
                {passwordHistory.map((password, index) => (
                  <li key={index}>{password}</li>
                ))}
              </ul>
            </div>
            
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
