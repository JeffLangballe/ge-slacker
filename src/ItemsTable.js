import React, {useState, useEffect} from 'react';
import ReactTable from 'react-table'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';


// TODO: Move these functions somewhere else maybe
/**
 * @name margin
 * @return Price margin of item
 */
function margin(item) {
  if (!item || !item.buy_average || !item.sell_average) return 0;
  return item.buy_average - item.sell_average;
}

/**
 * @name ROI
 * @return ROI (Return on investment) of item
 */
function ROI(item) {
  if (item.sell_average == 0) return 0;
  let roi = margin(item) / item.sell_average * 100;
  if (Number.isNaN(roi)) roi = 0;
  return roi;
}


function ItemsTable({ items }) {
  if (!items) items = {};

  const columns = [
    {
      Header: 'id',
      accessor: 'id',
      Cell: props => <Link to={"/item/"+ props.value}>{props.value}</Link>
    },
    {
      Header: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Average Price',
      accessor: 'overall_average'
    },
    {
      Header: 'Buy Price',
      accessor: 'buy_average'
    },
    {
      Header: 'Sell Price',
      accessor: 'sell_average'
    },
    {
      Header: 'Margin',
      id: 'margin',
      accessor: item => margin(item)
    },
    {
      Header: 'ROI',
      id: 'roi',
      accessor: item => ROI(item)
    },
    {
      Header: 'Buy Quantity',
      accessor: 'buy_quantity'
    },
    {
      Header: 'Sell Quantity',
      accessor: 'sell_quantity'
    },
  ];

  return (
    <div>
      <h2>TABLE</h2>
      <ReactTable
        data={Object.values(items)}
        columns={columns}
      />
    </div>
  )
}

export default ItemsTable;
