import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../components/head/header';
import useCookie from '../hooks/useCookie';
import { UserService } from '../services/user.service';

function LoginPage() {
  /**
     * @type {MutableRefObject<HTMLFormElement>}
     * */
  const formRef = useRef(null);
  const [_, setUserToken] = useCookie('accessToken', '');
  const router = useRouter();
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const { login, password } = formRef.current;
    UserService.getUser({ login: login.value, password: password.value })
      .then((data) => {
        const { accessToken } = data;
        if (accessToken) {
          setUserToken(accessToken, {
            days: 365,
            SameSite: 'Strict',
          });
          router.push({
            pathname: router.query?.returnUrl || '/',
          });
        }
      })
      .catch((err) => {
        setError(err?.message);
      });
  };

  return (
    <>
      <div className="page-wrapper bg-gra-03 p-t-45 p-b-50">
        <div className="wrapper wrapper--w790">
          <div className="card card-5">
            <div className="card-body">
              <form ref={formRef} onSubmit={onSubmit}>
                <div className="form-row">
                  <div className="name">Login</div>
                  <div className="value">
                    <div className="input-group">
                      <input className="input--style-5" type="text" name="login" />
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="name">Password</div>
                  <div className="value">
                    <div className="input-group">
                      <input className="input--style-5" type="password" name="password" />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <Link href="/register" as="/register">
                    <a
                      className="btn btn--radius-2 btn--red"
                      style={{ border: '1px solid #ccc' }}
                    >
                      Sign up
                    </a>
                  </Link>
                  <button
                    style={{ marginLeft: '12px', flex: 1 }}
                    className="btn btn--radius-2 btn--blue"
                    type="submit"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {!!error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  );
}

export default LoginPage;
