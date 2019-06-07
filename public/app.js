const baseUrl = 'https://api.rsbuddy.com/grandExchange';
const summaryUrl = `${window.location.origin}/api/exchange/summary.json`;
let items = [];

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
  const res = await fetch(summaryUrl, { mode: 'no-cors' });
  const items = await res.json();
  let ids = Object.keys(items);
  let pushItemWithId = (list, id) => {
    list.push(items[id]);
    return list;
  };
  let itemList = ids.reduce(pushItemWithId, []);
  return itemList;
}

/**
 * @name template
 * @brief Generates html string for displaying items in table
 * @return Table html string
 */
function template() {
  if (!items || items.length == 0) return '';
  let itemToEntry = item => `
  <tr>
    <td>${item.id}</td>
    <td>${item.name}</td>
    <td>${item.overall_average}</td>
    <td>${item.buy_average}</td>
    <td>${item.sell_average}</td>
    <td>${item.overall_quantity}</td>
    <td>${item.buy_quantity}</td>
    <td>${item.sell_quantity}</td>
    <td>${item.sp}</td>
    <td>${item.members}</td>
  </tr>`;

  return items.map(itemToEntry).join('');
}

/**
 * @name render
 * @brief Populates table with item price data
 */
function render() {
	let list = document.querySelector('#items-table');
	if (!list) return;
	list.innerHTML = template();
}

window.onload = async function(){
  items = await getAllItems();
  console.log(items);
  render();
};
