import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import ItemGraph from './ItemGraph';
import {ItemsContext, GetGraphData} from './api';

class Item extends React.Component {
  constructor(){
    super();
    this.state = {
      range: 60*24,
      interval: 30,
      graphData: {},
      itemData: {},
      showGraph: false
    }
  }

  componentDidMount() {
    this.loadItemData();
  }

  /**
   * @name loadItemData
   * @brief Get item graph data from RSBuddy api
   */
  async loadItemData() {
    let itemData = await GetGraphData(this.props.match.params.id, this.state.range, this.state.interval);
    this.setState({
      graphData: this.parseApiGraphData(itemData),
      itemData: itemData,
      showGraph: true
    });
  }

  /**
   * @name setGraphRange
   * @brief Sets display range for graph
   * @param range Fetch data from this many minutes ago until current time
   * @param interval Interval between timestamps in minutes
   */
  setGraphRange(range, interval) {
    console.log('setgraphrange', range, interval)
    this.setState({
      showGraph: false,
      range: range,
      interval: interval
    });
    this.loadItemData();
  }

  /**
   * @name parseApiGraphData
   * @brief Formats data from RSBuddy API for use in Dygraphs
   * @param itemData RSBuddy API detailed time series data
   * @return Object of the form {labels, values}
   * TODO: Also include quantity data
   */
  parseApiGraphData(itemData) {
    const zeroToNull = x =>  x ? x : null;
    const labels = ['Time', 'Buy Price', 'Sell Price'];
    const values = itemData.map(x => [new Date(x.ts), zeroToNull(x.buyingPrice), zeroToNull(x.sellingPrice)]);
    return {labels, values};
  }

  render() {
    return (
      <ItemsContext.Consumer>
        {({getItemProperty}) => (
          <div className="container">
            <h1><img src={`https://www.osrsbox.com/osrsbox-db/items-icons/${this.props.match.params.id}.png`} alt={this.props.match.params.id}/>{getItemProperty(this.props.match.params.id, 'name')}</h1>
            <div className="row">
              <div className="col">
                <div className="card">
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <div>Average Price</div>
                        <div>right text</div>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <div>Buy Price</div>
                        <div>right text</div>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <div>Sell Price</div>
                        <div>right text</div>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <div>Margin & ROI</div>
                        <div>right text</div>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <div>High Alchemy Price</div>
                        <div>right text</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card">
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between">
                        <div>Buy Quantity</div>
                        <div>right text</div>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <div>Sell Quantiy</div>
                        <div>right text</div>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <div>Buy Limit</div>
                        <div>right text</div>
                      </li>
                      <li className="list-group-item">
                        Wiki link here
                      </li>
                      <li className="list-group-item">
                        RSBuddy link here
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="btn-group mb-1 mt-1" role="group">
                  <button type="button" className="btn btn-secondary" onClick={x => this.setGraphRange(60*24*365, 17280)}>Year</button>
                  <button type="button" className="btn btn-secondary" onClick={x => this.setGraphRange(60*24*92, 4320)}>Quarter</button>
                  <button type="button" className="btn btn-secondary" onClick={x => this.setGraphRange(60*24*31, 1440)}>Month</button>
                  <button type="button" className="btn btn-secondary" onClick={x => this.setGraphRange(60*24*7, 180)}>Week</button>
                  <button type="button" className="btn btn-secondary" onClick={x => this.setGraphRange(60*24, 30)}>Day</button>
                </div>
                <ItemGraph graphData={this.state.graphData}/>
              </div>
            </div>
          </div>
        )}
      </ItemsContext.Consumer>
    );
  }
}

export default Item;
