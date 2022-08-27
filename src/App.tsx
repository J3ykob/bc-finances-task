import React, { useState, useEffect } from 'react';
import './App.css';
import styled from 'styled-components';

import ProviderContext from './context/ProviderContext'
import {Login} from './utils/login'

import UserView from './views/user'
import AdminView from './views/admin'

const Main = styled.div`
  width: 100wh;
  height: 100vh;
`

function App() {

  const [provider, setProvider] = useState<any>();
  const adminAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

  useEffect(()=>{

    if(provider != null) return;
    async function f(){
        const signerAddress :any = await (await Login()).getSigner().getAddress()
        setProvider(signerAddress);
    }
    f();
},[provider]);

  return (
    <Main>
      {
        provider === adminAddress ? <AdminView /> : <UserView />
      }
    </Main>
  );
}

export default App;
