import React, { useRef, useState } from 'react';
import Router from 'next/router';
import Header from '../components/head/header';
import { UserService } from '../services/user.service';

function RegisterPage() {
  const registerFormRef = useRef();
  const [error, setError] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(registerFormRef.current);
    const body = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of formData) {
      body[key] = value;
    }
    UserService.createUser(body)
      .then(() => {
        Router.push({
          pathname: '/login',
          query: { userCreated: true },
        });
      })
      .catch((e) => {
        setError(e.message || 'Unknown error');
      });
  };

  return (
    <div className="page-wrapper bg-gra-03 p-t-45 p-b-50">
      <div className="wrapper wrapper--w790">
        <div className="card card-5">
          <div className="card-body">
            <form ref={registerFormRef} onSubmit={onSubmit}>
              <div className="form-row">
                <div className="name">Login</div>
                <div className="value">
                  <div className="input-group">
                    <input required className="input--style-5" type="text" name="login" />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="name">Password</div>
                <div className="value">
                  <div className="input-group">
                    <input required className="input--style-5" type="password" name="password" />
                  </div>
                </div>
              </div>
              <div className="form-row m-b-55">
                <div className="name">Name</div>
                <div className="value">
                  <div className="row row-space">
                    <div className="col-2">
                      <div className="input-group-desc">
                          <input required className="input--style-5" type="text" name="name" />
                          <label className="label--desc">first name</label>
                        </div>
                    </div>
                    <div className="col-2">
                      <div className="input-group-desc">
                          <input required className="input--style-5" type="text" name="surname" />
                          <label className="label--desc">last name</label>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="name">Email</div>
                <div className="value">
                  <div className="input-group">
                    <input required className="input--style-5" type="email" name="email" />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="name">Phone</div>
                <div className="value">
                  <div className="input-group">
                    <input required className="input--style-5" type="type" name="phone" />
                  </div>
                </div>
              </div>
              {!!error && <p style={{ color: 'red' }}>{error}</p>}
              <div style={{ display: 'flex' }}>
                <input style={{ marginLeft: 'auto' }} className="btn btn--radius-2 btn--blue" type="submit" value="Sign up" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
