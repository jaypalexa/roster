import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import browserHistory from '../../browserHistory';
import { useAppContext } from '../../contexts/AppContext';
import AuthenticationService from '../../services/AuthenticationService';
import LoginModel from '../../types/LoginModel';
import './Login.sass';

const Login: React.FC = () => {
  const [appContext, setAppContext] = useAppContext();
  const [currentLogin, setCurrentLogin] = useState({} as LoginModel);
  const { errors, formState, handleSubmit, register, reset, watch } = useForm<LoginModel>({ mode: 'onChange' });
  const userNameRef = useRef<HTMLInputElement>()

  useEffect(() => {
    userNameRef?.current?.focus();
  }, [])

  const getPath = (): string => {
    if (!appContext.redirectPathOnAuthentication || appContext.redirectPathOnAuthentication === '/login') {
      return '/';
    } else {
      return appContext.redirectPathOnAuthentication;
    }
  }

  const onSubmit = handleSubmit((modifiedLogin: LoginModel) => {
    // .log('in handleSubmit(): modifiedLogin', modifiedLogin);
    const patchedLogin = { ...currentLogin, ...modifiedLogin };
    // console.log('in handleSubmit(): patchedLogin', patchedLogin);
    // LoginService.saveLogin(patchedLogin);
    reset(patchedLogin);
    setCurrentLogin(patchedLogin);

    AuthenticationService.authenticate(modifiedLogin.userName, () => {
      setAppContext({ ...appContext, redirectPathOnAuthentication: '' });
      setAppContext({ ...appContext, organizationId: '22222222-2222-2222-2222-222222222222' }); //TODO: REMOVE FAKE ORGANIZATION ID
      browserHistory.push(getPath());
    })
  });

  // const onCancel = () => {
  //   // console.log('in onCancel()...');
  //   reset(currentLogin);
  // };

  //console.log(JSON.stringify(formState));
  //console.log(JSON.stringify(errors.userName.message));

  return (
    <div id='login'>
      <div className='columns is-centered'>
        <div className='column is-two-fifths'>
          <h1 className='title has-text-centered'>Log In</h1>
          <form onSubmit={onSubmit}>

            <div className='field'>
              <label className='label'>User Name</label>
              <div className='control'>
                <input name='userName'
                  className={`input ${!watch('userName') ? 'is-danger' : ''}`}
                  type='text'
                  placeholder='User Name'
                  ref={(e: HTMLInputElement) => {
                    register(e, { required: 'User Name is required' })
                    userNameRef.current = e
                  }}
                />
              </div>
              <p className='help has-text-danger'>{errors.userName && errors.userName.message}</p>
            </div>
            <div className='field'>
              <label className='label'>Password</label>
              <div className='control is-expanded'>
                <input name='password' className='input' type='password' placeholder='Password' ref={register({})} />
              </div>
            </div>

            <div className='field is-grouped action-button-grouping'>
              {/* <p className='control'>
                <input 
                  type='button' 
                  className='button is-danger is-fixed-width-medium' 
                  value='Cancel'
                  onClick={() => onCancel()}
                  disabled={!formState.isValid}
                />
              </p> */}

              <p className='control'>
                <input
                  type='submit'
                  className='button is-success is-fixed-width-medium'
                  value='Log In'
                  disabled={!(formState.isValid && formState.dirty)}
                />
              </p>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
};

export default Login;
