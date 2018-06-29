import React from 'react';
import ReactDOM from 'react-dom';

import { helloWorld } from '@shared/util';

ReactDOM.render(
  (
    <div>
      <h1>It is easy: Just <b>app-it</b>!</h1>
      <p>{helloWorld('React App')}</p>
    </div>
  ), document.getElementById('app'),
);
