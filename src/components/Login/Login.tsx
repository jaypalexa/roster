import browserHistory from 'browserHistory';
import FormFieldRow from 'components/FormFields/FormFieldRow';
import TextFormField from 'components/FormFields/TextFormField';
import useMount from 'hooks/UseMount';
import React, { useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import AuthenticationService from 'services/AuthenticationService';
import LoginModel from 'types/LoginModel';
import './Login.sass';

interface LoginProps {
  setLoggedInUserName: React.Dispatch<React.SetStateAction<string>>;
  redirectPathOnAuthentication?: string;
}

const Login: React.FC<LoginProps> = ({ setLoggedInUserName, redirectPathOnAuthentication }) => {

  const [currentLogin, setCurrentLogin] = useState({} as LoginModel);
  const methods = useForm<LoginModel>({ mode: 'onChange' });
  const { formState, handleSubmit, reset } = methods;
  const firstEditControlRef = useRef<HTMLInputElement>()

  useMount(() => {
    window.scrollTo(0, 0)
  });

  useMount(() => {
    const lastUserName = localStorage.getItem('lastUserName') || '';
    const initialLogin = { userName: lastUserName, password: '' };
    setCurrentLogin(initialLogin);
    reset(initialLogin);
  })

  useMount(() => {
    firstEditControlRef?.current?.focus();
  })

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

    localStorage.setItem('lastUserName', modifiedLogin.userName);

    const isSuccess = await AuthenticationService.authenticateUser(modifiedLogin);
    if (isSuccess) {
      setLoggedInUserName(AuthenticationService.getTokenUserName());
      browserHistory.push(getPath());
    } else {
      setLoggedInUserName('');
      toast.error('Invalid login');
    }
  });

  return (
    <div id='login'>
      <div className='columns is-centered'>
        <div className='column is-two-fifths'>
          <h1 className='title has-text-centered'>Log In</h1>
          <FormContext {...methods}>
            <form onSubmit={onSubmit}>

              <FormFieldRow>
                <TextFormField fieldName='userName' labelText='User Name' validationOptions={{ required: 'User Name is required' }} refObject={firstEditControlRef} />
              </FormFieldRow>
              <FormFieldRow>
                <TextFormField fieldName='password' labelText='Password' type='password' validationOptions={{ required: 'Password is required' }} />
              </FormFieldRow>

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
          </FormContext>
        </div>
      </div>

    </div>
  );
};

export default Login;
