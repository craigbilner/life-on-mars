import React, { Component } from 'react';
import { missionControl } from '../../lib/robots';
import { createSurface } from '../../lib/mars';
import { moveMap, rotationMap, compassRotationMap, rotationCompassMap } from '../../lib/robotConfig';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      robots: [],
      result: [],
    }
  }

  getCompStyle() {
    return {
      color: 'green'
    };
  }

  getTextAreaStyle() {
    return {
      color: 'green',
      border: '1px solid green',
      resize: 'none',
      backgroundColor: 'black',
      width: '100%',
      height: 300,
      fontSize: '2rem',
      outline: 'none',
    }
  }

  getButtonStyle() {
    return {
      float: 'right',
      fontSize: '2rem',
      color: 'green',
      backgroundColor: 'black',
      border: '1px solid green',
      marginRight: -5,
      outline: 'none',
      cursor: 'pointer',
    }
  }

  getListStyle() {
    return {
      padding: 0,
      margin: 0,
      fontSize: '2rem'
    };
  }

  getLabelStyle() {
    return {
      fontSize: '2rem',
      marginBottom: '1rem'
    };
  }

  handleChange(evt) {
    const [surfaceDimensions, ...robots] = evt.currentTarget.value.split('\n');

    this.setState({
      surfaceDimensions,
      robots: robots.filter(line => line)
    });
  }

  handleClick() {
    const [x, y] = this.state.surfaceDimensions.split(' ');
    const surface = createSurface({
      x: parseInt(x, 10),
      y: parseInt(y, 10)
    });

    const control = missionControl({
      moveMap,
      rotationMap,
      compassRotationMap,
      rotationCompassMap,
      surface,
    });

    const mappedRobots = this.state.robots.reduce((robotList, line, indx) => {
      const newList = robotList.slice(0);
      const isPosition = indx % 2 == 0;

      if (isPosition) {
        const [origX, origY, origOrient] = line.split(' ');
        newList.push({
          id: robotList.length + 1,
          origX: parseInt(origX, 10),
          origY: parseInt(origY, 10),
          origOrient,
        });
      } else {
        robotList[robotList.length - 1].instructions = line;
      }

      return newList;
    }, []);

    const processedRobots = control(mappedRobots);
    const result = Object.keys(processedRobots).map(key => {
      if (key !== 'scent') {
        return processedRobots[key]
      }
    }).filter(robot => robot);

    console.log(result);

    this.setState({
      result
    });
  }

  render() {
    return (
      <div style={this.getCompStyle()}>
        <div style={this.getLabelStyle()}>INPUT:</div>
        <textarea
          style={this.getTextAreaStyle()}
          onChange={this.handleChange.bind(this)}
          placeholder="Enter input here"
        ></textarea>
        <button
          style={this.getButtonStyle()}
          onClick={this.handleClick.bind(this)}>RUN
        </button>
        <div style={this.getLabelStyle()}>OUTPUT:</div>
        <ul style={this.getListStyle()}>
          {
            this.state.result.map(({
              id,
              curX,
              curY,
              curOrient,
              isLost
              }) => {
              const lostText = isLost ? 'LOST' : '';
              const content = `${curX} ${curY} ${curOrient} ${lostText}`;
              return (
                <div key={id}>
                  {content}
                </div>
              );
            })
          }
        </ul>
      </div>
    );
  }
};
