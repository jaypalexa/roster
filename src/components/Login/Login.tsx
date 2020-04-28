import browserHistory from 'browserHistory';
import { useAppContext } from 'contexts/AppContext';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import AuthenticationService from 'services/AuthenticationService';
import LoginModel from 'types/LoginModel';
import './Login.sass';

interface LoginProps {
  redirectPathOnAuthentication?: string;
}

const Login: React.FC<LoginProps> = ({redirectPathOnAuthentication}) => {
  const [appContext, setAppContext] = useAppContext();
  const [currentLogin, setCurrentLogin] = useState({} as LoginModel);
  const { errors, formState, handleSubmit, register, reset, watch } = useForm<LoginModel>({ mode: 'onChange' });
  const userNameRef = useRef<HTMLInputElement>()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  useEffect(() => {
    userNameRef?.current?.focus();
  }, [])

  const getPath = (): string => {
    if (!redirectPathOnAuthentication || redirectPathOnAuthentication === '/login') {
      return '/';
    } else {
      return redirectPathOnAuthentication;
    }
  }

  const onSubmit = handleSubmit(async (modifiedLogin: LoginModel) => {
    const patchedLogin = { ...currentLogin, ...modifiedLogin };
    reset(patchedLogin);
    setCurrentLogin(patchedLogin);

    try {
      var result = await AuthenticationService.authenticate(modifiedLogin);
      console.log('result', result);
      AuthenticationService.isAuthenticated = true;
      AuthenticationService.idToken = result.idToken;
      const organizationId = result.idToken.payload['custom:organizationId'];
      setAppContext({ ...appContext, loggedInUserName: modifiedLogin.userName, organizationId: organizationId }); //TODO: REMOVE FAKE ORGANIZATION ID
    } catch(err) {
      console.log(err);
      AuthenticationService.isAuthenticated = false;
      setAppContext({ ...appContext, loggedInUserName: undefined, organizationId: undefined }); //TODO: REMOVE FAKE ORGANIZATION ID
      toast.error('Invalid login');
    }
    browserHistory.push(getPath());

    // AuthenticationService.authenticate(modifiedLogin, () => {
    //   if (!AuthenticationService.isAuthenticated) {
    //     toast.error('Invalid login');
    //     setAppContext({ ...appContext, organizationId: undefined }); //TODO: REMOVE FAKE ORGANIZATION ID
    //   } else {
    //     setAppContext({ ...appContext, organizationId: '22222222-2222-2222-2222-222222222222' }); //TODO: REMOVE FAKE ORGANIZATION ID
    //   }
    //   browserHistory.push(getPath());
    // })
  });

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

            <div className='field is-grouped form-action-buttons'>
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
