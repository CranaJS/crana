import React from 'react';
import ReactDOM from 'react-dom';

import { helloWorld } from '@shared/util';

import logo from './logo.png';

import { logo as logoClass } from './index.css';

ReactDOM.render(
  (
    <div>
      <img src={logo} className={logoClass} alt="Crana - CReate A Node Application" />
      <h1>CReate A Node Application</h1>
      <h2>Have fun hacking!</h2>
      <p>{helloWorld('React App')}</p>
    </div>
  ), document.getElementById('app'),
);
