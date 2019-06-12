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
  if (!item || !item.buy_average || !item.sell_average) return 0;
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
 * @name createDataTable
 * @brief Creates DataTable using summary data from RSBuddy API
 */
async function createDataTable() {
  let tableElement = $('#items-table');
  if (!tableElement) return;

  // Ensure we have data to use
  if (!items) items = await getAllItems();

  // Format items for table
  const columns = [
    { title: "", render: { _: 'image', data: 'id' }, searchable: false, orderable: false },
    { title: "Name" },
    { title: "Average Price" },
    { title: "Buy Price" },
    { title: "Sell Price" },
    { title: "Margin" },
    { title: "ROI", render: { _: 'display', data: 'value' } },
    { title: "Buy Quantity" },
    { title: "Sell Quantity" },
    { title: "Overall Quantity" }
  ];

  let tableData = Object.values(items).map(item => [
    { id: item.id, image: `<img src="https://www.osrsbox.com/osrsbox-db/items-icons/${item.id}.png" alt="$item.id">` },
    item.name,
    item.overall_average.toLocaleString(),
    item.buy_average.toLocaleString(),
    item.sell_average.toLocaleString(),
    margin(item).toLocaleString(),
    { value: ROI(item), display: ROI(item).toFixed(1) },
    item.buy_quantity.toLocaleString(),
    item.sell_quantity.toLocaleString(),
    item.overall_quantity.toLocaleString()
  ]);

  // Create table
  table = tableElement.DataTable({
    data: tableData,
    columns: columns,
    pageLength: 25
  });

  // Register click handlers
  // TODO: This depends on the format of the data in the row which is not
  // a very robust implementation
  tableElement.on('click', 'tbody tr', function () {
    let data = table.row(this).data();
    selectItem(data[0].id);
} );
}

/**
 * @name selectItem
 * @brief Opens detailed view of item with id
 * @param id ID of item
 * 30 180 1440 4320 17280
 */
async function selectItem(id) {
  if (!items || !id) return;
  let graphElement = document.querySelector('#detail-graph');
  graphElement.innerHTML = 'Loading...';  // TODO: This could be prettier
  selectedItemId = id;
  document.querySelector('#detail-title').textContent = items[id].name;

  // Get time data for the last day and graph it
  const itemData = await getGraphData(id, graphRange.range, graphRange.interval);
  const graphData = parseApiGraphData(itemData);
  graph = new Dygraph(
    graphElement,
    graphData.values,
    {
      labels: graphData.labels,
      strokeWidth: 1.5,
      drawPoints: true,
      pointSize: 2.5,
      highlightCircleSize: 3.5,
      logscale: true
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
  createDataTable();
};
