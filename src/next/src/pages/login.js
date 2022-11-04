import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/head/header';
import useCookie from '../hooks/useCookie';

const getUser = async ({ login, password }) => {
  const response = await fetch(`/rest/api/user?login=${login}&password=${password}`);
  if (response.ok) {
    return response.json();
  }
  throw new Error(response.statusText);
};

function LoginPage() {
  /**
     * @type {MutableRefObject<HTMLFormElement>}
     * */
  const formRef = useRef(null);

  const [_, setUserToken] = useCookie('accessToken', '');
  const router = useRouter();

  const onSubmit = (e) => {
    e.preventDefault();
    const { login, password } = formRef.current;
    getUser({ login: login.value, password: password.value })
      .then((data) => {
        const { accessToken } = data;
        if (accessToken) {
          setUserToken(accessToken, {
            days: 365,
            SameSite: 'Strict',
          });
          router.push({
            pathname: router.query.returnUrl,
          });
        }
      })
      .catch((err) => console.log(err));
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
