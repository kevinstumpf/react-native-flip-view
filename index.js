'use strict';

var React = require('react-native');

var {
  Component,
  PropTypes,
  View,
  Easing,
  StyleSheet,
  Animated,
  } = React;

export default class FlipView extends Component {
  static propTypes = {
    style: View.propTypes.style,
    flipDuration: PropTypes.number,
    flipEasing: PropTypes.func,
    flipAxis: PropTypes.oneOf(['x', 'y']),
    front: PropTypes.object,
    back: PropTypes.object,
    perspective: PropTypes.number,
    onFlipped: PropTypes.func,
    isFlipped: PropTypes.bool,
  };

  static defaultProps = {
    style: {},
    flipDuration: 500,
    flipEasing: Easing.inOut(Easing.ease),
    flipAxis: 'y',
    perspective: 1000,
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
      frontOpacity: new Animated.Value(targetRenderState.frontOpacity),
      backOpacity: new Animated.Value(targetRenderState.backOpacity),
      isFlipped: false,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.isFlipped !== this.props.isFlipped) {
      this.flip();
    }
  };

  _getTargetRenderStateFromFlippedValue = (isFlipped) => {
    return {
      frontOpacity: isFlipped ? 0 : 1,
      backOpacity: isFlipped ? 1 : 0,
      frontRotation: isFlipped ? 0.5 : 0,
      backRotation: isFlipped ? 1 : 0.5
    };
  };


  render = () => {
    var rotateProperty = this.props.flipAxis === 'y' ? 'rotateY' : 'rotateX';

    return (
      <View {...this.props}>
        <Animated.View
          style={[styles.flippableView, {opacity: this.state.frontOpacity, transform: [{perspective: this.props.perspective}, {[rotateProperty]: this.state.frontRotation}]}]}>
          {this.props.front}
        </Animated.View>
        <Animated.View
          style={[styles.flippableView, {opacity: this.state.backOpacity, transform: [{perspective: this.props.perspective}, {[rotateProperty]: this.state.backRotation}]}]}>
          {this.props.back}
        </Animated.View>
      </View>
    );
  };

  flip = () => {
    var nextIsFlipped = !this.state.isFlipped;

    var {frontOpacity, backOpacity, frontRotation, backRotation} = this._getTargetRenderStateFromFlippedValue(nextIsFlipped);

    Animated.parallel([this._animateValue(this.state.frontOpacity, frontOpacity, this._stepFunctionEasing),
      this._animateValue(this.state.backOpacity, backOpacity, this._stepFunctionEasing),
      this._animateValue(this.state.frontRotationAnimatedValue, frontRotation, this.props.flipEasing),
      this._animateValue(this.state.backRotationAnimatedValue, backRotation, this.props.flipEasing)]
    ).start(k => {
      if (!k.finished) {
        return;
      }
      this.setState({isFlipped: nextIsFlipped});
      this.props.onFlipped(nextIsFlipped);
    });
  };

  _animateValue = (animatedValue, toValue, easing) => {
    return Animated.timing(
      animatedValue,
      {
        toValue: toValue,
        duration: this.props.flipDuration,
        easing: easing
      }
    );
  };

  _stepFunctionEasing = (t) => {
    return Math.round(this.props.flipEasing(t));
  };
}

var styles = StyleSheet.create({
  flippableView: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  }
});