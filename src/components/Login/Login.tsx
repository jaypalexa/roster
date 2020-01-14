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
  const { errors, handleSubmit, register, reset, watch } = useForm<LoginModel>();
  const userNameRef = useRef<HTMLInputElement>()

  useEffect(() => {
    userNameRef?.current?.focus();
  }, [])

  const getPath = ():string  => {
    if (!appContext.redirectPathOnAuthentication || appContext.redirectPathOnAuthentication === '/login') {
      return '/';
    } else {
      return appContext.redirectPathOnAuthentication;
    }
  }

  const onSubmit = handleSubmit((modifiedLogin: LoginModel) => {
    console.log('in handleSubmit(): modifiedLogin', modifiedLogin);
    const patchedLogin = {...currentLogin, ...modifiedLogin};
    console.log('in handleSubmit(): patchedLogin', patchedLogin);
    // LoginService.saveLogin(patchedLogin);
    reset(patchedLogin);
    setCurrentLogin(patchedLogin);

    AuthenticationService.authenticate(() => {
      setAppContext({...appContext, isAuthenticated: true, redirectPathOnAuthentication: '', loggedInUserName: modifiedLogin.userName});
      browserHistory.push(getPath());
    })
  });

  const onCancel = () => {
    console.log('in onCancel()...');
    reset(currentLogin);
    // setAppContext({...appContext, organizationId: '22222222-2222-2222-2222-222222222222'});
  };

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
                    register(e, {required: 'User Name is required'})
                    userNameRef.current = e // you can still assign to your own ref
                  }}
                />
              </div>
              <p className='help has-text-danger'>{errors.userName && errors.userName.message}</p>
            </div>
            <div className='field'>
              <label className='label'>Password</label>
              <div className='control is-expanded'>
                <input name='password' className='input' type='password' placeholder='Password' ref={register} />
              </div>
            </div>

            <div className='field is-grouped is-grouped-right'>
              <p className='control'>
                <input 
                  type='button' 
                  className='button is-danger is-fixed-width-medium' 
                  value='Cancel'
                  onClick={() => onCancel()}
                />
              </p>

              <p className='control'>
                <input type='submit' className='button is-success is-fixed-width-medium' value='Save' />
              </p>
            </div>
            
          </form>

        </div>
      </div>

    </div>
  );
};

export default Login;
