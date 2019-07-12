import React from 'react';

import logo from './logo.svg';
import RandomJSON from './random.json';
import './App.css';

const arrayFromJSON = (json) => {
  const keys = Object.keys(json);
  return keys.map(key => ({ key, value: json[key], type: typeof json[key]  }));
}

class App extends React.PureComponent {
  state = { parsingJSON: true };

  componentDidMount() {
    this.setState({ parsingJSON: false, parsedJSONArray: arrayFromJSON(RandomJSON) });
  }

  renderRow = ({ key, value, type }) => (
    <div className="row">
      <div className="column">{type}</div>
      <div className="column">{key}</div>
      <div className="column">{value.toString()}</div>
    </div>
  );

  render() {
    const { parsingJSON, parsedJSONArray } = this.state;
    if (parsingJSON) return <img src={logo} className="App-logo" alt="logo" />;

    return (
      <div className="App-header">
        {parsedJSONArray.map(this.renderRow)}
      </div>
    );
  }
}

export default App;
