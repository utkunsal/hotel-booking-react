import React, { useEffect, useContext, useRef, useState } from 'react';
import AuthContext from '../../context/AuthContext';

const PopupLoginForm = ({ isOpen, onClose, openRegister }) => {
  const email = useRef("");
  const password = useRef("");
  const { login } = useContext(AuthContext);
  const [showWarning, setShowWarning] = useState(false);

 
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.closest('.popup-content')) {
        return;
      }
      onClose();
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  const loginSubmit = async (event) => {
    event.preventDefault();
    try{
      let payload = {
        email: email.current.value,
        password: password.current.value,
      };
      const response = await login(payload, onClose);
      if(!response){
        setShowWarning(true)
        setTimeout(() => setShowWarning(false), 3000);
      } else {
        email.current.value = "";
      }
      password.current.value = "";
    } catch (err){
      console.log(err)
    }
  };

  return (
    <div className={`popup-overlay ${isOpen ? 'open' : ''}`}>
    <div className="popup-content center-content">
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      <form onSubmit={loginSubmit}>
        <div className='center-content'>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="login-email" name="email" required ref={email} />
            <label htmlFor="password">Password</label>
            <input type="password" id="login-password" name="password" required ref={password} />
          </div>
          <div className="btn-container">
            <div className="warning" style={{marginTop: -12, marginBottom: 5}}>{showWarning && "Invalid email or password!"}</div>
            <button className='auth-button' type="submit" style={{marginBottom: -17}}>Sign In</button>
          </div>
        </div>
      </form>
      <div className="btn-container">
        <button className='auth-button' onClick={() => {
          onClose();
          openRegister();
        }}>Create Account</button>
      </div>
    </div>
  </div>
  );
};

export default PopupLoginForm;
