import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Link } from './components/Link/Link';
import { Tabs } from './components/Tabs/Tabs';

function App() {
  const [tab, setTab] = useState('test' as string | number);
  return (
    <div className="App">
      <Tabs value={tab} onChange={v => setTab(v)}>
        <Link><span>testing</span></Link>
        <Link>Second</Link>
        <Link>Third</Link>
        <Link value="test">Fourth</Link>
        <Link>Fifth</Link>
        <Link>Sixth</Link>
        <Link>Seventh</Link>
      </Tabs>

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
