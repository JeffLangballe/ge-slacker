import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ItemsTable from './ItemsTable';
import Item from './Item';
import NotFound from './NotFound';

function App() {
  return (
    <Router>
      <div>
        <Header />

        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/item/:id" component={Item} />
          <Route component={NotFound}/>
        </Switch>

      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>GE Slacker</h2>
      <ItemsTable></ItemsTable>
    </div>
  );
}

function Header() {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/item/123">Item #123</Link>
      </li>
    </ul>
  );
}

export default App;
