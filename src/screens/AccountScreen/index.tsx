import React, { useContext } from 'react';

import AccountContext from '../../common/contexts/AccountContext';
import { Paper } from '../../components/Paper';

import LoginForm from './components/LoginForm';
import LogoutForm from './components/LogoutForm';

export default function AccountScreen() {
  const accContext = useContext(AccountContext);

  return <Paper>{accContext.loggedIn ? <LogoutForm /> : <LoginForm />}</Paper>;
}
