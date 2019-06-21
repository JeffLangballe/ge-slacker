import React, {useRef, useEffect} from 'react';
import Dygraph from 'dygraphs';
import {GetGraphData} from './api';

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

// TODO: This component shouldn't be getting the data itself but should
// instead be provided with the data in the right format
function ItemGraph({itemId}) {
  const graphEl = useRef(null);
  const graphStyle = {
    width: '100%'
  };
  let graphData = null;
  let graph = null;

  useEffect(() => {
    const loadItemData = async () => {
      let itemData = await GetGraphData(itemId, 60*24, 30); //  TODO: Don't hard-code these
      graphData = parseApiGraphData(itemData);
      graph = new Dygraph(
        graphEl.current,
        graphData.values,
        {
          labels: graphData.labels,
          strokeWidth: 1.5,
          drawPoints: true,
          pointSize: 2.5,
          highlightCircleSize: 3.5,
          logscale: true,
          labelsKMB: true,
          axes: {
            y: {
              valueFormatter: x => x.toLocaleString()
            }
          }
        });
    }
    loadItemData();
  }, []);

  return(
    <div ref={graphEl} style={graphStyle}></div>
  );
}

export default ItemGraph;
