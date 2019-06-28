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
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2 d-none d-md-block bg-light sidebar vh-100">
              <SideBar/>
            </div>
            <main className="col-md-9 mt-3">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/item/:id" component={Item} />
                <Route component={NotFound}/>
              </Switch>
            </main>
          </div>
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
          <ItemsTable items={items}></ItemsTable>
        </React.Fragment>
      )}
    </ItemsContext.Consumer>
  );
}

function SideBar() {
  return (
    <nav>
      <div className="sidebar-sticky">
        <h2>GE Slacker</h2>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link"  to="/">Home</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default App;
