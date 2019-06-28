import React from 'react';
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

class ItemsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: ''
    }
  }

  /**
   * @name updateSearchString
   * @param event Event object from React
   * @brief Event handler for search string update
   */
  updateSearchString(event) {
    this.setState({
      searchString: event.target.value
    });
  }

  /**
   * @name filterName
   * @param item Item to check
   * @brief Filters items based on search string
   * @return true if item name contains search string
   */
  filterName(item) {
    if (!item || !item.name) return true;
    return item.name.toLowerCase().includes(this.state.searchString.toLowerCase());
  }

  /**
   * @name getItems
   * @return Filtered items to display in table
   */
  getItems() {
    return Object.values(this.props.items).filter(x => this.filterName(x));
  }

  render() {
    const columns = [
      {
        Header: 'id',
        accessor: 'id',
        Cell: props => <Link to={"/item/"+ props.value}><img src={`https://www.osrsbox.com/osrsbox-db/items-icons/${props.value}.png`} alt={props.value}/></Link>
      },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: props => <Link to={"/item/"+ props.row.id}>{props.value}</Link>
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
      <React.Fragment>
        <div className="input-group mb-2 w-25">
          <input
            value={this.state.searchString}
            onChange={event => this.updateSearchString(event)}
            type="text"
            className={"form-control"}
            placeholder="Search"
          />
        </div>
        <ReactTable
          data={this.getItems()}
          columns={columns}
        />
      </React.Fragment>
    )
  }
}

export default ItemsTable;
