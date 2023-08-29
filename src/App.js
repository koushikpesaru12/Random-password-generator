import React, { useState, useEffect } from "react";
import "./App.css";
import Modal from "./Modal";

function App() {
  const [password, setPassword] = useState("");
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [isUppercase, setIsUppercase] = useState(true);
  const [isLowercase, setIsLowercase] = useState(true);
  const [isNumber, setIsNumber] = useState(true);
  const [isSymbol, setIsSymbol] = useState(true);
  const [passwordLength, setPasswordLength] = useState(12);
  const [showHistory, setShowHistory] = useState(false);
  const [modal, setModal] = useState({
    title: "",
    show: false,
    message: "",
  });

  useEffect(() => {
    const storedPasswords = JSON.parse(localStorage.getItem('passwordHistory')) || [];
    setPasswordHistory(storedPasswords);
  }, []);

  const generatePassword = () => {
    if (!isUppercase && !isLowercase && !isNumber && !isSymbol) {
      
      setModal({
        title: "Error",
        message: "Select at least one character type",
        show: true,
      });
      return;
    }

    if (passwordLength <= 4) {
      setModal({
        title: "Error",
        message: "Invalid password length",
        show: true,
      });
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
      alert("Nothing selected");
      return;
    }

    setPassword(newPassword);
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
      setModal({
        title: "Error",
        message: "There is nothing to copy",
        show: true,
      });
    } else {
      setModal({
        title: "Success",
        message: "Password copied to clipboard",
        show: true,
      });
      const textAreaEl = document.createElement("textarea");
      textAreaEl.value = password;
      document.body.appendChild(textAreaEl);
      textAreaEl.select();
      document.execCommand("copy");
      textAreaEl.remove();
    }  };

    const closeModalHandler = () => {
      setModal({ ...modal, show: false });
    };


  return (
    <div className="App">
      {modal.show && (
        <Modal
          onClose={closeModalHandler}
          title={modal.title}
          message={modal.message}
        />
      )}
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

       <center>
        <div className="Password_history">
          <button onClick={() => setShowHistory(!showHistory)} className="show-password">
            {showHistory ? "Hide History" : "Show History"}
            </button>
    
          {showHistory && (
            <div className="password-history">
              <div className="title"><h4>Previous Generated Passwords</h4></div>
             <div className="passwords">
              <ul>
                {passwordHistory.map((password, index) => (
                  <li key={index}>{password}</li>
                ))}
              </ul>
             </div>
             <button onClick={clearHistory} className="clear-history-btn">Clear History</button>
            </div>
          )}
       </div>
      </center>
      </div>
    </div>
  );
}

export default App;