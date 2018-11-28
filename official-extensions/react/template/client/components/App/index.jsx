import React from 'react';
import { hot } from 'react-hot-loader';

import logo from './logo.png';
import { logo as logoClass } from './index.css';

const App = () => (
  <div>
    <img src={logo} className={logoClass} alt="Crana - CReate A Node Application" />
    <h1>CReate A Node Application</h1>
    <h2>Have fun hacking!</h2>
  </div>
);

export default hot(module)(App);
