import React, {useRef, useEffect} from 'react';
import Dygraph from 'dygraphs';

class ItemGraph extends React.Component {
  graphStyle = {
    width: '100%'
  };
  graph = null;

  /**
   * @name  createGraph
   * @brief Creates graph if data exists
   * TODO: Calling this in two places is kind of hacky
   */
  createGraph() {
    if(this.props.graphData.values) {
      this.graph = new Dygraph(
        this.refs.graphEl,
        this.props.graphData.values,
        {
          labels: this.props.graphData.labels,
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
  }

  componentDidMount() {
    this.createGraph();
  }

  render() {
    this.createGraph();
    return(
      <div ref="graphEl" style={this.graphStyle}></div>
    );
  }
}

export default ItemGraph;
