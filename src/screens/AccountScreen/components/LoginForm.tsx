import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components/macro';
import { loginV1 } from '../../../api/login';
import { CharacterColors } from '../../../common/constants';
import Button from '../../../components/Button';
import { Heading1 } from '../../../components/Heading';
import Input from '../../../components/Input';
import { Paper, PaperRow } from '../../../components/Paper';

interface LoginFormProps {
  username: string;
  password: string;
}

interface LocationState {
  from: {
    pathname: string;
  };
}

function LoginForm() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState };
  const { register, handleSubmit } = useForm<LoginFormProps>();
  const [errorMessage, setErrorMessage] = useState<string>();

  function onSubmit(formData: LoginFormProps) {
    if (errorMessage) {
      setErrorMessage(undefined);
    }

    loginV1(formData.username, formData.password)
      .then(() => {
        const from = state?.from ?? '/';
        navigate(from, { replace: true });
      })
      .catch((err) => {
        setErrorMessage(err);
      });
  }

  return (
    <Paper style={{ width: '30em' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <PaperRow>
          <Heading1>Log in</Heading1>
        </PaperRow>
        <PaperRow>
          <Input label={'Username'} type={'text'} {...register('username')} />
        </PaperRow>
        <PaperRow>
          <Input label={'Password'} type={'password'} {...register('password')} />
        </PaperRow>
        <PaperRow>
          <Button type={'submit'} width="100%">
            Log in
          </Button>
        </PaperRow>
      </form>
      {errorMessage && (
        <PaperRow>
          <Error>{errorMessage}</Error>
        </PaperRow>
      )}
    </Paper>
  );
}

export default LoginForm;

const Error = styled.span`
  color: ${CharacterColors.Red};
`;
