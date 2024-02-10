import React, { useState } from "react";
import "./LoginSignup.css";

// Assests import
import user_icon from "../Assets/user_icon.png";
import email_icon from "../Assets/email_icon.png";
import password_icon from "../Assets/password_icon.png";
import calender_icon from "../Assets/calender_icon.png";

const LoginSignup = () => {
  const [action, setAction] = useState("Signup");

  return (
    <div>
      <div className="container">
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
            { action === 'Login' 
                ? <div></div> 
                : <>
                        <div className="input">
                            <img src={user_icon} alt="" />
                            <input type="text" name="" id="" placeholder="fullname" />
                        </div>
                        <div className="input">
                            <img src="" alt="" />
                            <input type="date" name="" id="" placeholder="" />
                        </div>
                    </>
            }
          <div className="input">
            <img src={email_icon} alt="" />
            <input type="email" name="" id="" placeholder="email" />
          </div>
          <div className="input">
            <img src={password_icon} alt="" />
            <input type="password" name="" id="" placeholder="password" />
          </div>
          
        </div>
        {action == 'Signup'? <div></div> : <div className="forgot-password"><div>Lost Password? <span>Click here</span></div></div>}
        
        <div className="submit-container">
          <div className={action === "Login" ? "submit gray" : "submit"} onClick={()=>setAction('Signup')}>
            Signup
          </div>
          <div className={action === "Signup" ? "submit gray" : "submit"} onClick={()=>setAction('Login')}>
            Login
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
