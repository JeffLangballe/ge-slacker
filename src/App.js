import React, {useState, useEffect} from 'react';
import 'react-table/react-table.css'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ItemsTable from './ItemsTable';
import Item from './Item';
import NotFound from './NotFound';
import {GetAllItems} from './api';

function App() {
  return (
    <Router>
      <Header />
      <div className="container">

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
  const [items, setItems] = useState({});
  useEffect(() => {
    const loadItems = async () => {
      setItems(await GetAllItems());
    }
    loadItems();
  }, []);

  return (
    <div>
      <h2>GE Slacker</h2>
      <ItemsTable items={items}></ItemsTable>
    </div>
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
