import React, { useRef } from 'react';
import Header from '../components/head/header';

const getUser = ({ login, password }) => fetch(`/rest/api/user?login=${login}&password=${password}`);

function LoginPage() {
  /**
     * @type {MutableRefObject<HTMLFormElement>}
     * */
  const formRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    const { login, password } = formRef.current;
    getUser({ login: login.value, password: password.value }).then(console.log);
  };

  return (
    <>
      <Header />
      <div>Login!</div>
      <form onSubmit={onSubmit} ref={formRef}>
        <label htmlFor="login">Login:</label>
        <input type="text" placeholder="Login" name="login" id="login" />

        <label htmlFor="login">Password:</label>
        <input type="password" placeholder="Password" name="password" id="password" />

        <input type="submit" name="submit" />
      </form>
    </>
  );
}

export default LoginPage;
