import React from 'react';
import Header from '../components/head/header';

function RegisterPage() {
  const onSubmit = (e) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <>
      <Header />
      <div className="page-wrapper bg-gra-03 p-t-45 p-b-50">
        <div className="wrapper wrapper--w790">
          <div className="card card-5">
            <div className="card-body">
              <form onSubmit={onSubmit}>
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
                <div className="form-row m-b-55">
                  <div className="name">Name</div>
                  <div className="value">
                    <div className="row row-space">
                      <div className="col-2">
                        <div className="input-group-desc">
                          <input className="input--style-5" type="text" name="first_name" />
                          <label className="label--desc">first name</label>
                        </div>
                      </div>
                      <div className="col-2">
                        <div className="input-group-desc">
                          <input className="input--style-5" type="text" name="last_name" />
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
                      <input className="input--style-5" type="email" name="email" />
                    </div>
                  </div>
                </div>
                <div className="form-row m-b-55">
                  <div className="name">Phone</div>
                  <div className="value">
                    <div className="row row-refine">
                      <div className="col-3">
                        <div className="input-group-desc">
                          <input className="input--style-5" type="text" name="area_code" />
                          <label className="label--desc">Area Code</label>
                        </div>
                      </div>
                      <div className="col-9">
                        <div className="input-group-desc">
                          <input className="input--style-5" type="text" name="phone" />
                          <label className="label--desc">Phone Number</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <button style={{ marginLeft: 'auto' }} className="btn btn--radius-2 btn--blue" type="submit">Register</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
