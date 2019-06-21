import React, {useState, useEffect} from 'react';

const url = "http://" + window.location.hostname;
const apiUrl = `${url}/api`;
const baseUrl = `${url}/base`;
const summaryUrl = `${baseUrl}/exchange/summary.json`;
const graphUrl = `${apiUrl}/grandExchange`;
const graphUrlAlt = `${baseUrl}/exchange/graphs`;

/**
 * @name GetAllItems
 * @brief Gets list of all items and their current prices from RSBuddy API
 * @return All item price data
 * Each item has the following fields:
 * buy_average: 161
 * buy_quantity: 401412
 * id: 2
 * members: true
 * name: "Cannonball"
 * overall_average: 160
 * overall_quantity: 1163980
 * sell_average: 160
 * sell_quantity: 762568
 * sp: 5
 */ 
async function GetAllItems() {
  const res = await fetch(summaryUrl);
  const items = await res.json();
  return items;
}

/**
 * @name GetGraphData
 * @brief Gets detailed price data over time for a specified item
 * @param id  Item id 
 * @param range Fetch data from this many minutes ago until current time
 * @param interval Interval between timestamps in minutes
 * @return List of price data for different times
 * Each object in the list is of the form:
 * buyingPrice: 160
 * buyingQuantity: 149416
 * overallPrice: 159
 * overallQuantity: 632501
 * sellingPrice: 159
 * sellingQuantity: 483085
 * ts: 1560011400000
 * TODO: Clean this up a bit. Fallback is getting pretty hairy
 */
async function GetGraphData(id, range, interval) {
  let res;

  async function fallback() {
    res = await fetch(`${graphUrlAlt}/${interval}/${id}.json`);
  }

  try {
    res = await fetch(`${graphUrl}/?a=graph&i=${id}&g=${range}`);
  } catch (e) {
    await fallback();
  }
  if (!res.ok) await fallback();
  const item = await res.json();
  return item;
}

const ItemsContext = React.createContext();

function ItemsProvider({children}) {
  const [items, setItems] = useState({});
  useEffect(() => {
    const loadItems = async () => {
      setItems(await GetAllItems());
    }
    loadItems();
  }, []);

  /**
   * @name getItemProperty
   * @brief Safely gets nested property of item
   * @param properties List of nested properties to evaluate
   */
  function getItemProperty(...properties) {
    return properties.reduce((obj, key) => 
      (obj && obj[key] !== 'undefined') ? obj[key] : undefined,
    items
    )
  }

  return (
    <ItemsContext.Provider value={{items, getItemProperty}}>
      {children}
    </ItemsContext.Provider>
  );
}

module.exports = {
  GetGraphData, GetAllItems, ItemsContext, ItemsProvider
}