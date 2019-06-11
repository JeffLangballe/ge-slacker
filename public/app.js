const apiUrl = `${window.location.origin}/api`;
const baseUrl = `${window.location.origin}/base`;
const summaryUrl = `${baseUrl}/exchange/summary.json`;
const graphUrl = `${apiUrl}/grandExchange`;
const graphUrlAlt = `${baseUrl}/exchange/graphs`;
let graphRange = {
  range: 60 * 24, // 1 day of data points
  interval: 30    // 30 minutes between each data point
}
let items = null;
let selectedItemId = null;
let table = null;
let graph = null;

/**
 * @name getAllItems
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
async function getAllItems() {
  const res = await fetch(summaryUrl);
  const items = await res.json();
  return items;
}

/**
 * @name getGraphData
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
 */
async function getGraphData(id, range, interval) {
  let res = await fetch(`${graphUrl}/?a=graph&i=${id}&g=${range}`);

  // Fallback API
  if (!res.ok) res = await fetch(`${graphUrlAlt}/${interval}/${id}.json`);

  const item = await res.json();
  return item;
}

/**
 * @name margin
 * @return Price margin of item
 */
function margin(item) {
  return item.buy_average - item.sell_average;
}

/**
 * @name ROI
 * @return ROI (Return on investment) of item
 */
function ROI(item) {
  if (item.buy_average == 0) return 0;
  roi = margin(item) / item.buy_average * 100;
  if (Number.isNaN(roi)) roi = 0;
  return roi;
}

/**
 * @name template
 * @brief Generates html string for displaying items in table
 * @return Table html string
 */
function template() {
  if (!items) return '';
  let itemToEntry = item => `
  <tr onclick="selectItem(${item.id});">
    <td>${item.id}</td>
    <td>${item.name}</td>
    <td>${item.overall_average}</td>
    <td>${item.buy_average}</td>
    <td>${item.sell_average}</td>
    <td>${margin(item)}</td>
    <td>${ROI(item).toFixed(1)}</td>
    <td>${item.buy_quantity}</td>
    <td>${item.sell_quantity}</td>
    <td>${item.overall_quantity}</td>
  </tr>`;

  return Object.values(items).map(itemToEntry).join('');
}

/**
 * @name render
 * @brief Populates table with item price data
 * 
 * TODO: Use DataTable methods to update the table instead of recreating it
 *       from scratch every time
 */
function render() {
	let list = document.querySelector('#items-table-content');
	if (!list) return;
  list.innerHTML = template();

  // Use DataTable to handle row sorting and searching
  table = $('#items-table').DataTable();
}

/**
 * @name getFilterMinMaxFunction
 * @brief Generates a function to filter table using a min/max value
 * @param dataColumn Column index (in table) of data to filter
 * @param idMin HTML id of input for minimum value
 * @param idMax HTML id of input for maximum value
 * @return Function which reads min/max from specified HTML elements and filters
 *         table accordingly
 * 
 * TODO: Make this more robust! Having to know the column index isn't very clean
 */
function getFilterMinMaxFunction (dataColumn, idMin, idMax) {
  return function filterFunction (settings, data, dataIndex) {
    var min = parseInt($(idMin).val(), 10);
    var max = parseInt($(idMax).val(), 10);
    var val = parseFloat( data[dataColumn] ) || 0;
    if ((isNaN(min) && isNaN(max)) ||
        (isNaN(min) && val <= max) ||
        (min <= val && isNaN(max)) ||
        (min <= val && val <= max))
    {
      return true;
    }
    return false;
  }
}

/**
 * @name parseApiGraphData
 * @brief Formats data from RSBuddy API for use in Dygraphs
 * @param itemData RSBuddy API detailed time series data
 * @return Object of the form {labels, values}
 * TODO: Also include quantity data
 */
function parseApiGraphData(itemData) {
  const zeroToNull = x =>  x ? x : null;
  const labels = ['Time', 'Buy Price', 'Sell Price'];
  const values = itemData.map(x => [new Date(x.ts), zeroToNull(x.buyingPrice), zeroToNull(x.sellingPrice)]);
  return {labels, values};
}

/**
 * @name selectItem
 * @brief Opens detailed view of item with id
 * @param id ID of item
 * 30 180 1440 4320 17280
 */
async function selectItem(id) {
  if (!items || !id) return;
  selectedItemId = id;
  document.querySelector('#detail-title').textContent = items[id].name;

  // Get time data for the last day and graph it
  const itemData = await getGraphData(id, graphRange.range, graphRange.interval);
  const graphData = parseApiGraphData(itemData);
  graph = new Dygraph(
    document.querySelector('#detail-graph'),
    graphData.values,
    {
      labels: graphData.labels,
      strokeWidth: 1.5,
      drawPoints: true,
      pointSize: 2.5,
      highlightCircleSize: 3.5
    });
}

/**
 * @name setGraphRange
 * @param range Fetch data from this many minutes ago until current time
 * @param interval Interval between timestamps in minutes
 * TODO: Have visual feedback for what range is selected and if we're loading
 */
function setGraphRange(range, interval) {
  if (!range || !interval) return;
  graphRange.range = range;
  graphRange.interval = interval;
  if (selectedItemId) {
    selectItem(selectedItemId);
  }
}

window.onload = async function(){
  // DataTable initialization
  // TODO: Abstract this out elsewhere
  $.fn.dataTable.ext.search.push(getFilterMinMaxFunction(2, '#price-min', '#price-max'));
  $.fn.dataTable.ext.search.push(getFilterMinMaxFunction(5, '#margin-min', '#margin-max'));
  $.fn.dataTable.ext.search.push(getFilterMinMaxFunction(9, '#quantity-min', '#quantity-max'));
  // Event listener for range filtering inputs to redraw on input
  $('#price-min, #price-max, #margin-min, #margin-max, #quantity-min, #quantity-max').keyup(function() {
    if (table) table.draw();
  });

  // Get items and populate tables
  items = await getAllItems();
  render();
};
