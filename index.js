'use strict';


var React = require('react');
var {
  Component,
} = React;

import PropTypes from 'prop-types';  //add this to make it compatible for latest RN versions

var ReactNative = require('react-native');
var {
  View,
  Easing,
  StyleSheet,
  Animated,
  } = ReactNative;



class FlipView extends Component {
  static propTypes = {
    style:  PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    flipDuration: PropTypes.number,
    flipEasing: PropTypes.func,
    flipAxis: PropTypes.oneOf(['x', 'y']),
    front: PropTypes.object,
    back: PropTypes.object,
    perspective: PropTypes.number,
    onFlip: PropTypes.func,
    onFlipped: PropTypes.func,
    isFlipped: PropTypes.bool,
  };

  static defaultProps = {
    style: {},
    flipDuration: 500,
    flipEasing: Easing.out(Easing.ease),
    flipAxis: 'y',
    perspective: 1000,
    onFlip: () => {},
    onFlipped: () => {},
    isFlipped: false,
  };

  constructor(props) {
    super(props);

    var targetRenderState = this._getTargetRenderStateFromFlippedValue(props.isFlipped);

    var frontRotationAnimatedValue = new Animated.Value(targetRenderState.frontRotation);
    var backRotationAnimatedValue = new Animated.Value(targetRenderState.backRotation);

    var interpolationConfig = {inputRange: [0, 1], outputRange: ["0deg", "360deg"]};
    var frontRotation = frontRotationAnimatedValue.interpolate(interpolationConfig);
    var backRotation = backRotationAnimatedValue.interpolate(interpolationConfig);

    this.state = {
      frontRotationAnimatedValue,
      backRotationAnimatedValue,
      frontRotation,
      backRotation,
      isFlipped: props.isFlipped,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.isFlipped !== this.props.isFlipped) {
      this.flip();
    }
  };

  _getTargetRenderStateFromFlippedValue = (isFlipped) => {
    return {
      frontRotation: isFlipped ? 0.5 : 0,
      backRotation: isFlipped ? 1 : 0.5
    };
  };


  render = () => {
    var rotateProperty = this.props.flipAxis === 'y' ? 'rotateY' : 'rotateX';

    return (
      <View {...this.props}>
        <Animated.View
          pointerEvents={this.state.isFlipped ? 'none' : 'auto'}
          style={[styles.flippableView, {transform: [{perspective: this.props.perspective}, {[rotateProperty]: this.state.frontRotation}]}]}>
          {this.props.front}
        </Animated.View>
        <Animated.View
          pointerEvents={this.state.isFlipped ? 'auto' : 'none'}
          style={[styles.flippableView, {transform: [{perspective: this.props.perspective}, {[rotateProperty]: this.state.backRotation}]}]}>
          {this.props.back}
        </Animated.View>
      </View>
    );
  };

  flip = () => {
    this.props.onFlip();

    var nextIsFlipped = !this.state.isFlipped;

    var {frontRotation, backRotation} = this._getTargetRenderStateFromFlippedValue(nextIsFlipped);

    setImmediate(() => {
      requestAnimationFrame(() => {
        Animated.parallel([this._animateValue(this.state.frontRotationAnimatedValue, frontRotation, this.props.flipEasing),
          this._animateValue(this.state.backRotationAnimatedValue, backRotation, this.props.flipEasing)]
        ).start(k => {
          if (!k.finished) {
            return;
          }
          this.setState({isFlipped: nextIsFlipped});
          this.props.onFlipped(nextIsFlipped);
        });
      });
    });
  };

  _animateValue = (animatedValue, toValue, easing) => {
    return Animated.timing(
      animatedValue,
      {
        toValue: toValue,
        duration: this.props.flipDuration,
        easing: easing,
                useNativeDriver: true
      }
    );
  };
}

var styles = StyleSheet.create({
  flippableView: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backfaceVisibility: 'hidden',
  }
});

module.exports = FlipView;
