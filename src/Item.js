import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import ItemGraph from './ItemGraph';
import {ItemsContext} from './api';

function Item({ match }) {
  return (
    <ItemsContext.Consumer>
      {({getItemProperty}) => (
        <React.Fragment>
          <h2>{getItemProperty(match.params.id, 'name')}</h2>
          <ItemGraph itemId={match.params.id}></ItemGraph>
        </React.Fragment>
      )}
    </ItemsContext.Consumer>
  )
}

export default Item;
