import { useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";
 
const Login = () => {
  const email = useRef("");
  const password = useRef("");
  const name = useRef("");
  const { login } = useContext(AuthContext);
 
  const loginSubmit = async () => {
    let payload = {
      email: email.current.value,
      password: password.current.value,
      //name: name.current.value,
    };
    await login(payload);
  };
  return (
    <>
      <div className="center-content">
        <div className="card">
          <div className="card-body">
            <form>
              <div className="mb-3">
                <label htmlFor="formName" className="form-label">
                  Name
                </label>
                <input type="text" className="form-control" id="formName" ref={name} />
              </div>
              <div className="mb-3">
                <label htmlFor="formBasicEmail" className="form-label">
                  Email address
                </label>
                <input type="email" className="form-control" id="formBasicEmail" ref={email} />
              </div>
              <div className="mb-3">
                <label htmlFor="formPassword" className="form-label">
                  Password
                </label>
                <input type="password" className="form-control" id="formPassword" ref={password} />
              </div>
              <button type="button" className="btn btn-primary" onClick={loginSubmit}>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;