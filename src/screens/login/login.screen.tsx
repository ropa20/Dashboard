import auth from 'models/auth.model';
import React from 'react';
import { useSetState } from 'utils/functions.utils';
function Login() {

  const [state, setState] = useSetState({ email: "", password: "" });

  const Login = async () => {
    const user: any = await auth.login(state);
    localStorage.setItem("user", user.data._id);
    localStorage.setItem("token", user.token);
    window.location.href = "/conversation";
  }

  return (
    <div className="login_screen">
      <div className="login_container">
        <div className="form">
          <input value={state.email} type="text" placeholder="email" onChange={(e) => setState({ email: e.target.value })} />
          <input value={state.password} type="password" placeholder="password" onChange={(e) => setState({ password: e.target.value })} />
          <div className="login_btn" onClick={() => Login()}>Login</div>
        </div>
      </div>
    </div>
  )
}

export default Login;