import React from 'react';
import 'react-table/react-table.css'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ItemsTable from './ItemsTable';
import Item from './Item';
import NotFound from './NotFound';
import {ItemsContext, ItemsProvider} from './api';

function App() {
  return (
    <Router>
      <ItemsProvider>
        <Header />
        <div className="container">

          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/item/:id" component={Item} />
            <Route component={NotFound}/>
          </Switch>

        </div> 
      </ItemsProvider>
    </Router>
  );
}

function Home() {
  return (
    <ItemsContext.Consumer>
      {({items}) => (
        <React.Fragment>
          <h2>GE Slacker</h2>
          <ItemsTable items={items}></ItemsTable>
        </React.Fragment>
      )}
    </ItemsContext.Consumer>
  );
}

function Header() {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
    </ul>
  );
}

export default App;
