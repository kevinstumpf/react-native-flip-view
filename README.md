# react-native-flip-view
JavaScript implementation of a view container that can flip between its front and back

## Demo

![flipviewdemo](https://cloud.githubusercontent.com/assets/7293984/11916918/14b36880-a6a3-11e5-84a3-dd88eca78b4d.gif)

## Installation

```sh
npm install react-native-flip-view
```

## Example

```js
var React = require('react-native');

var {
  View,
  Easing,
  TouchableOpacity,
  Text,
  Component,
  } = React;

var FlipView = require('react-native-flip-view');

export default class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = { isFlipped: false };
  }

  render = () => {
    return (
      <FlipView style={{flex: 1}}
                front={this._renderFront()}
                back={this._renderBack()}
                isFlipped={this.state.isFlipped}
                onFlipped={(val) => {console.log('Flipped: ' + val);}}
                flipAxis="y"
                flipEasing={Easing.out(Easing.ease)}
                flipDuration={500}
                perspective={1000}/>
    );
  };

  _renderFront = () => {
    return (
      <View style={{flex: 1, backgroundColor: '#81D4FA', justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity style={{backgroundColor: 'black', padding: 20}} onPress={this._flip}>
          <Text style={{fontSize: 32, color: 'white'}}>Flip to Back!</Text>
        </TouchableOpacity>
      </View>
    );
  };

  _renderBack = () => {
    return (
      <View style={{flex: 1, backgroundColor: '#1565C0', justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity style={{backgroundColor: 'black', padding: 20}} onPress={this._flip}>
          <Text style={{fontSize: 32, color: 'white'}}>Flip to Front!</Text>
        </TouchableOpacity>
      </View>
    );
  };

  _flip = () => {
    this.setState({isFlipped: !this.state.isFlipped});
  };
}
```

.babelrc:
```js
{
  "retainLines": true,
  "whitelist": [
    "es6.arrowFunctions",
    "es6.blockScoping",
    "es6.classes",
    "es6.constants",
    "es6.destructuring",
    "es6.modules",
    "es6.parameters",
    "es6.properties.computed",
    "es6.properties.shorthand",
    "es6.spread",
    "es6.templateLiterals",
    "es7.asyncFunctions",
    "es7.trailingFunctionCommas",
    "es7.objectRestSpread",
    "es7.classProperties",
    "es7.decorators",
    "flow",
    "react",
    "react.displayName",
    "regenerator"
  ]
}
```
