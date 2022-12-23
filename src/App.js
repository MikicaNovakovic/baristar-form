import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "./clients.js";

function App() {
  const location = window.location.href;
  const [userForRegister, setUserForRegister] = useState({
    email: "",
    password: "",
  });
  const [isLogged, setIsLogged] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLogin, setisLogin] = useState(true);
  const [userForLogin, setUserForLogin] = useState({ email: "", password: "" });
  const [rerender, setRerender] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState();
  const [loggedInUser, setLoggedInUser] = useState({});

  const additionalFields = {
    type: "EMPLOYEE",
    full_name: "Mikica Novakovic",
    latitude: "33.33",
    longitude: "33.33",
    phone_area_code: "+381",
    phone_number: "655444608",
    id_type: "PASSPORT",
    legal_rights: "true",
    id_number: "22039997",
    acn: "1",
    abn: "1",
  };

  const register = async () => {
    const a = await axios["post"]("http://localhost:3000/v1/auth/register", {
      ...userForRegister,
      additionalFields,
    });
    console.log(a, "register");
  };

  const login = async () => {
    const a = await axios["post"]("http://localhost:3000/v1/auth/login", {
      email: userForLogin.email,
      password: userForLogin.password,
    });

    console.log(a, "a");

    if (a?.data?.user) {
      setLoggedInUser(a.data);
      alert("Successfully logged in");
    } else {
      alert(a?.data?.message);
    }
    setRerender(!rerender);
  };

  const forgotPassword = async () => {
    if (resetEmail !== "") {
      const a = await axios["post"](
        "http://localhost:3000/v1/auth/forgot-password",
        {
          email: resetEmail,
        }
      );
      console.log(a, "forgot password");
    }
  };

  const resetPassword = async () => {
    console.log(token, "token");
    const a = await axios["post"](
      "http://localhost:3000/v1/auth/reset-password",
      {
        newPassword: newPassword,
        resetPasswordToken: token,
      }
    );
    console.log(a.data, "resetPassword");

    // const { error } = await supabase.auth.updateUser({
    //   token,
    //   password: newPassword,
    // });
  };

  const logOut = async () => {
    if (loggedInUser?.tokens?.refreshToken) {
      const a = await axios["post"]("http://localhost:3000/v1/auth/logout", {
        refreshToken: loggedInUser.tokens.refreshToken,
      });

      alert(a.data.message);
      localStorage.clear();
      setLoggedInUser({});
    }
  };

  useEffect(() => {
    setIsLogged(
      loggedInUser &&
        loggedInUser.user &&
        Object.keys(loggedInUser.user).length > 0
    );
  }, [loggedInUser]);

  useEffect(() => {
    const token = new URLSearchParams(location.split("#")[1]).get(
      "access_token"
    );

    if (token) {
      setIsUpdate(true);
      setToken(token);
    }
  }, [location]);

  return (
    <div className="App">
      {isLogged ? (
        <>
          <h2>Logged in</h2>
          <button onClick={logOut}>Logout</button>
        </>
      ) : (
        <>
          {isLogin ? (
            <>
              <h2>Log in</h2>
              <input
                placeholder="Enter email"
                value={userForLogin.email}
                type={"email"}
                onChange={(e) =>
                  setUserForLogin({ ...userForLogin, email: e.target.value })
                }
              />
              <input
                placeholder="Enter password"
                value={userForLogin.password}
                type={"text"}
                onChange={(e) =>
                  setUserForLogin({ ...userForLogin, password: e.target.value })
                }
              />

              <button onClick={login}>Login</button>
              <p>
                Don't have account ?{" "}
                <span onClick={() => setisLogin(false)}>Sign up</span>
              </p>

              <p>
                Want to reset password ?
                <span onClick={() => setIsReset(true)}>Click here</span>
              </p>
            </>
          ) : (
            <>
              <h2>Register</h2>
              <input
                placeholder="Enter email"
                value={userForRegister.email}
                type={"email"}
                onChange={(e) =>
                  setUserForRegister({
                    ...userForRegister,
                    email: e.target.value,
                  })
                }
              />
              <input
                placeholder="Enter password"
                value={userForRegister.password}
                type={"text"}
                onChange={(e) =>
                  setUserForRegister({
                    ...userForRegister,
                    password: e.target.value,
                  })
                }
              />

              <button onClick={register}>Register</button>
              <p>
                Already have account ?
                <span onClick={() => setisLogin(true)}>Sign in</span>
              </p>
              <p>
                Want to reset password ?
                <span onClick={() => setIsReset(true)}>Click here</span>
              </p>
            </>
          )}
        </>
      )}

      {isReset && (
        <>
          <input
            placeholder="Enter email"
            value={resetEmail}
            type={"email"}
            onChange={(e) => setResetEmail(e.target.value)}
          />

          <button onClick={forgotPassword}>Send reset password email</button>
        </>
      )}

      {isUpdate && (
        <p>
          <input
            placeholder="Enter new password"
            value={newPassword}
            type={"text"}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button onClick={resetPassword}>Reset password</button>
        </p>
      )}
    </div>
  );
}

export default App;
