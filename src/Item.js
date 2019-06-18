import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import ItemGraph from './ItemGraph';

function Item({ match }) {
  // TODO: Need to get the item summary data using id only
  return (
    <div>
      <h2>Item Detail for id: {match.params.id}</h2>
      <ItemGraph itemId={match.params.id}></ItemGraph>
    </div>
  )
}

export default Item;
