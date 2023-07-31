import React, { useEffect, useContext, useRef, useState } from 'react';
import AuthContext from '../../context/AuthContext';

const PopupRegisterForm = ({ isOpen, onClose, openLogin }) => {
  const name = useRef("");
  const email = useRef("");
  const password = useRef("");
  const { register } = useContext(AuthContext);
  const [warning, setWarning] = useState();

 
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

  const registerSubmit = async (event) => {
    event.preventDefault();
    try{
      let payload = {
        name: name.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      await register(payload, onClose);
      name.current.value = "";
      email.current.value = "";
      password.current.value = "";
    } catch (err){
      if(err.response?.status === 400 || err.response?.status === 422){
        setWarning(err.response.data);
        setTimeout(() => setWarning(""), 3000);
      } else {
        console.log(err)
      }
    }
  };

  return (
    <div className={`popup-overlay ${isOpen ? 'open' : ''}`}>
    <div className="popup-content center-content">
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      <form onSubmit={registerSubmit}>
        <div className='center-content' style={{lineHeight: 0.5}}>
          <>
            <label htmlFor="name">Name</label>
            <input type="text" id="register-name" name="name" required ref={name} />
            <label htmlFor="email">Email</label>
            <input type="email" id="register-email" name="email" required ref={email} />
            <label htmlFor="password">Password</label>
            <input type="password" id="register-password" name="password" required ref={password} />
          </>
          <div className="btn-container">
            <div className="warning" style={{marginTop: -8, marginBottom: 5, textAlign: "center"}}>{warning && `${warning}`}</div>
            <button className='auth-button' type="submit" style={{marginBottom: -17}}>Create Account</button>
          </div>
        </div>
      </form>
      <div className="btn-container">
        <button className='auth-button' onClick={() => {
          onClose();
          openLogin();
        }}>Already Have an Account? Sign In</button>
      </div>
    </div>
  </div>
  );
};

export default PopupRegisterForm;
