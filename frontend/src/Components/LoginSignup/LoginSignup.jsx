import React, { useState } from "react";

import { useFormik } from "formik";

import "./LoginSignup.css";
import { basicSchema } from "../Validation/Schema";

// Assests import
import user_icon from "../Assets/user_icon.png";
import email_icon from "../Assets/email_icon.png";
import password_icon from "../Assets/password_icon.png";
import calender_icon from "../Assets/calender_icon.png";

const baseURL = 'http://localhost:5000';

const LoginSignup = () => {
  const [action, setAction] = useState("Signup");

  const onSubmit = async (values, actions) => {
    let payload = {}
    if (action == "Signup"){
      let nameArray = values['fullname'].split(" ");
      const lastname = nameArray.pop();
      const firstname = nameArray.join(" ");
      payload = {
        ...values,
        firstname,
        lastname
      }
      console.log(payload);
    }
    else if(action == "Login"){
      payload = values;
    }
    else{
      console.log("Not a valid action");
    }
    console.log(payload);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    actions.resetForm();  
  };
  const { values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit} = useFormik({
    initialValues: {
      email: "",
      fullname: "",
      password: "",
      dob: "",
    },
    validationSchema: basicSchema,
    onSubmit,
  });

  return (
    <div>
      <div className="container">
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="inputs">
              { action === 'Login' 
                  ? <div></div> 
                  : <>
                          <div className="input">
                              <img src={user_icon} alt="" />
                              <input 
                                type="text" 
                                name="" 
                                id="fullname" 
                                placeholder="fullname" 
                                value={values.fullname}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className={errors.email && touched.email ? "input-error" : ""}
                              />
                          </div>
                          <div className="input">
                              <img src="" alt="" />
                              <input 
                                type="date" 
                                name="" 
                                id="dob" 
                                placeholder="dob"
                                value={values.dob}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className={errors.dob && touched.dob ? "input-error" : ""}
                              />
                          </div>
                      </>
              }
            <div className="input">
              <img src={email_icon} alt="" />
              <input 
                type="email" 
                name="" 
                id="email" 
                placeholder="email" 
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.email && touched.email ? <div className="input-error">{errors.email}</div> : <></>}
            </div>
            <div className="input">
              <img src={password_icon} alt="" />
              <input 
                type="password" 
                name="" 
                id="password" 
                placeholder="password"
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.password && touched.password ? <div className="input-error">{errors.password}</div> : <></>}
            </div>
            
          </div>
            {action == 'Signup'? <div></div> : <div className="forgot-password"><div>Lost Password? <span>Click here</span></div></div>}
            
            <div className="submit-container">
              <button className={action === "Login" ? "submit gray" : "submit"} type="submit" onClick={() => setAction('Signup')}>
                Signup
              </button>
              <button className={action === "Signup" ? "submit gray" : "submit"} type="submit" onClick={() => setAction('Login')}>
                Login
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default LoginSignup;
