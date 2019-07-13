import React from 'react';

import logo from './logo.svg';
import RandomJSON from './random.json';
import './App.css';

const arrayFromJSON = (json) => {
  const keys = Object.keys(json);
  return keys.map(key => {
    let value = json[key];
    let type = typeof json[key];
    if (type === 'object')
      ({ type, value } = handleObject(value));
    return { key, value, type };
  });
}

const handleObject = valueArg => {
  let value = valueArg;
  let type = 'object';
  if (Array.isArray(value)) {
    let obj = {};
    value.forEach((v, i) => { obj[i] = v });
    value = arrayFromJSON(obj);
    type = 'array';
  }
  else value = arrayFromJSON(value);
  return { type, value };
}

class App extends React.Component {
  state = { parsingJSON: true };

  componentDidMount() {
    this.setState({ parsingJSON: false, parsedJSONArray: arrayFromJSON(RandomJSON) });
  }

  captureKeypress = stopEdits => (e) => {
    if ([13, 27].includes(e.charCode)) stopEdits();
  }

  handleValueDoubleClick = (key, value, rowGetter, rowSetter) => () => {
    const { parsedJSONArray } = this.state;
    const { currentRowIndex, currentRow } = rowGetter({ currentRow: parsedJSONArray });
    currentRow.isEditing = !currentRow.isEditing;
    parsedJSONArray[currentRowIndex] = currentRow;
    rowSetter(parsedJSONArray);
  }

  handleValueChange = (key, value, rowGetter, rowSetter) => (e) => {
    const newValue = e.target.value;
    const { parsedJSONArray } = this.state;
    const { currentRowIndex, currentRow } = rowGetter({ currentRow: parsedJSONArray });
    currentRow.value = newValue;
    parsedJSONArray[currentRowIndex] = currentRow;
    rowSetter(parsedJSONArray);
  }

  handleNodeClick = (key, value, rowGetter, rowSetter) => () => {
    const { parsedJSONArray } = this.state;
    const { currentRowIndex, currentRow } = rowGetter({ currentRow: parsedJSONArray });
    if (currentRow.type === 'object' || currentRow.type === 'array')
      currentRow.isExpanded = !currentRow.isExpanded;
    parsedJSONArray[currentRowIndex] = currentRow;
    rowSetter(parsedJSONArray);
  }

  globalStopEdits = () => {

  }

  generateRowGetter = (key) => {
    return ({ currentRow: maybeParsedJSONArray }) => {
      const parsedJSONArray = Array.isArray(maybeParsedJSONArray)
        ? maybeParsedJSONArray
        : maybeParsedJSONArray.value;
      const currentRowIndex = parsedJSONArray.findIndex(r => r.key === key);
      const currentRow = parsedJSONArray[currentRowIndex];
      return { currentRowIndex, currentRow };
    }
  }

  renderRow = ({ key, value, type, isExpanded, isEditing }, rowGetter, rowSetter) => (
    <div className="row" key={key}>
      <div className="column">{type}</div>
      <div className="column">{key}</div>
      {this.renderValue(key, value, type, isExpanded, isEditing, rowGetter, rowSetter)}
    </div>
  );

  renderValue = (key, value, type, isExpanded, isEditing, rowGetter, rowSetter) => isEditing ? (
     <input
      type="text"
      value={value}
      onChange={this.handleValueChange(key, value, rowGetter, rowSetter)}
      onKeyPress={this.captureKeypress(this.handleValueDoubleClick(key, value, rowGetter, rowSetter))}
     />
  ) : (
    <div
      className="column"
      onDoubleClick={this.handleValueDoubleClick(key, value, rowGetter, rowSetter)}
    >
      {
        (() => {
          if (!value) return '';
          if (type === 'object' || type === 'array')
            return isExpanded
              ? value.map((v) => this.renderRow(
                v,
                parsedJSONArray => this.generateRowGetter(v.key)(rowGetter(parsedJSONArray)),
                parsedJSONArray => { rowSetter(parsedJSONArray); })
              )
              : this.renderNode(key, value, rowGetter, rowSetter);

          return value.toString();
        })()
      }
    </div>
  )

  renderNode = (key, value, rowGetter, rowSetter) => (
    <div onClick={this.handleNodeClick(key, value, rowGetter, rowSetter)}>
      Node
    </div>
  )

  render() {
    const { parsingJSON, parsedJSONArray } = this.state;
    if (parsingJSON) return <img src={logo} className="App-logo" alt="logo" />;

    return (
      <div className="App-header">
        {parsedJSONArray.map((v) => this.renderRow(
          v,
          this.generateRowGetter(v.key),
          parsedJSONArray => { this.setState({ parsedJSONArray }); })
        )}
      </div>
    );
  }
}

export default App;
