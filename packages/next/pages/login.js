import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useCookie from '../hooks/useCookie';
import { UserService } from '../services/user.service';
import { PORT } from '../constants';

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
    const { hostname } = window.location;
    UserService.getUser(
      { login: login.value, password: password.value },
      `http://${hostname}:${PORT}`,
    )
      .then((data) => {
        const { accessToken } = data;
        if (accessToken) {
          setUserToken(accessToken, {
            days: 365,
            SameSite: 'Strict',
          });
          router.push({
            pathname: decodeURIComponent(router.query?.returnUrl.toString()) || '/',
          });
        }
      })
      .catch((err) => {
        setError(err?.message);
      });
  };

  return (
    <div>
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
                  <a
                    className="btn btn--radius-2 btn--red"
                    style={{ border: '1px solid #ccc' }}
                    href="/register"
                  >
                    Sign up
                  </a>
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
    </div>
  );
}

export default LoginPage;
