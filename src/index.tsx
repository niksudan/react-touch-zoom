import * as React from 'react';
import * as Hammer from 'hammerjs';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

interface Props {
  height: number;
  handleZoom?: Function;
  maxZoom?: number;
  disabled?: boolean;
  children: any;
}

interface State {
  scale: number;
  zoom: any;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  centerX: number;
  centerY: number;
}

class Zoom extends React.Component<Props, State> {
  initialState: any;
  element: any;
  hammer: any;
  width: any;
  height: any;
  maxZoom: number;

  constructor(props) {
    super(props);
    this.initialState = {
      scale: 1,
      zoom: 1,
      x: 0,
      y: 0,
      offsetX: 0,
      offsetY: 0,
      centerX: 50,
      centerY: 50,
    };
    this.state = this.initialState;
    this.maxZoom = this.props.maxZoom ? this.props.maxZoom : 8;
    this.handleZoomStart = this.handleZoomStart.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.handlePan = this.handlePan.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  /**
   * Register Hammer events
   */
  componentDidMount() {
    this.hammer = new Hammer.Manager(this.element);
    this.width = this.element.clientWidth;
    const pinch = new Hammer.Pinch();
    const pan = new Hammer.Pan();
    const doubleTap = new Hammer.Tap({ event: 'doubletap', taps: 2 });
    pinch.recognizeWith(pan);
    this.hammer.add([pinch, pan, doubleTap]);
    this.hammer.on('pinchstart', this.handleZoomStart);
    this.hammer.on('pinchmove', this.handleZoom);
    this.hammer.on('pinchmove panmove', this.handlePan);
    this.hammer.on('pinchend panend', this.handleSave);
    this.hammer.on('doubletap', this.handleReset);
  }

  /**
   * Lock in the focal point of the zoom
   */
  handleZoomStart(e) {
    if (this.props.disabled || this.state.scale !== 1) {
      return;
    }
    this.setState({
      centerX: clamp(e.center.x / this.width, 0, 1) * 100,
      centerY: clamp(e.center.y / this.props.height, 0, 1) * 100,
    });
  }

  /**
   * Determine the zoom value to apply
   */
  handleZoom(e) {
    if (this.props.disabled) {
      return;
    }
    this.setState({ zoom: e.scale });
    if (this.props.handleZoom !== undefined) {
      this.props.handleZoom(this.state.scale * e.scale);
    }
  }

  /**
   * Determine the pan value to apply
   */
  handlePan(e) {
    if (this.props.disabled) {
      return;
    }
    const newState = {
      offsetX: e.deltaX,
      offsetY: e.deltaY,
    };
    if (this.state.scale + e.scale <= 2) {
      newState.offsetX = 0;
      newState.offsetY = 0;
    }
    this.setState(newState);
  }

  /**
   * Process the pan and zoom
   */
  handleSave() {
    if (this.props.disabled) {
      return;
    }
    const scale = clamp(this.state.scale * this.state.zoom, 1, this.maxZoom);
    const newState = {
      scale,
      x: this.state.x + this.state.offsetX,
      y: this.state.y + this.state.offsetY,
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    };
    if (scale === 1) {
      newState.x = 0;
      newState.y = 0;
    }
    this.setState(newState);
    if (this.props.handleZoom !== undefined) {
      this.props.handleZoom(scale);
    }
  }

  /**
   * Reset on double tap
   */
  handleReset() {
    if (this.props.disabled) {
      return;
    }
    this.setState(this.initialState);
    if (this.props.handleZoom !== undefined) {
      this.props.handleZoom(1);
    }
  }

  render() {
    const scale = clamp(
      this.state.scale * this.state.zoom,
      0.9,
      this.maxZoom + 1,
    );
    const x = this.state.x + this.state.offsetX;
    const y = this.state.y + this.state.offsetY;
    return (
      <div className="zoom" style={{ overflow: 'hidden' }}>
        <div
          className="zoom__content"
          ref={(e) => (this.element = e)}
          style={{
            transform: `scale(${scale}) translate(${x}px, ${y}px)`,
            transformOrigin: `${this.state.centerX}% ${this.state.centerY}%`,
            transition: '0.1s all ease-out',
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Zoom;
