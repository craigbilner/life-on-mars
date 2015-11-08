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
      fontSize: '3rem',
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

  handleChange(evt) {
    const [surfaceDimensions, ...robots] = evt.currentTarget.value.split('\n');

    this.setState({
      surfaceDimensions,
      robots
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
      } else if (robotList[robotList.length - 1]) {
        robotList[robotList.length - 1].instructions = line;
      }

      return newList;
    }, []);

    const processedRobots = control(mappedRobots);
    const result = Object.keys(processedRobots).map(key => {
      return processedRobots[key];
    });

    this.setState({
      result
    });
  }

  render() {
    return (
      <div style={this.getCompStyle()}>
        <textarea style={this.getTextAreaStyle()} onChange={this.handleChange.bind(this)}></textarea>
        <button style={this.getButtonStyle()} onClick={this.handleClick.bind(this)}>RUN</button>
        <ul>
          {
            this.state.result.map(({ curX, curY, curOrient }) => {
              return (
                <div>{`${curX} ${curY} ${curOrient}`}</div>
              );
            })
          }
        </ul>
      </div>
    );
  }
};
