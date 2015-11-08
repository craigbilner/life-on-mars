import React, { Component } from 'react';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
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
    console.log(this.state);
  }

  render() {
    return (
      <div style={this.getCompStyle()}>
        <textarea style={this.getTextAreaStyle()} onChange={this.handleChange.bind(this)}></textarea>
        <button style={this.getButtonStyle()} onClick={this.handleClick.bind(this)}>RUN</button>
      </div>
    );
  }
};
