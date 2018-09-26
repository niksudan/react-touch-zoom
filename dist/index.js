"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var React = require("react");
var Hammer = require("hammerjs");
var clamp = function (value, min, max) {
    return Math.min(max, Math.max(min, value));
};
var Zoom = /** @class */ (function (_super) {
    __extends(Zoom, _super);
    function Zoom(props) {
        var _this = _super.call(this, props) || this;
        _this.initialState = {
            scale: 1,
            zoom: 1,
            x: 0,
            y: 0,
            offsetX: 0,
            offsetY: 0,
            centerX: 50,
            centerY: 50
        };
        _this.state = _this.initialState;
        _this.maxZoom = _this.props.maxZoom ? _this.props.maxZoom : 8;
        _this.handleZoomStart = _this.handleZoomStart.bind(_this);
        _this.handleZoom = _this.handleZoom.bind(_this);
        _this.handlePan = _this.handlePan.bind(_this);
        _this.handleSave = _this.handleSave.bind(_this);
        _this.handleReset = _this.handleReset.bind(_this);
        return _this;
    }
    /**
     * Register Hammer events
     */
    Zoom.prototype.componentDidMount = function () {
        this.hammer = new Hammer.Manager(this.element);
        this.width = this.element.clientWidth;
        var pinch = new Hammer.Pinch();
        var pan = new Hammer.Pan();
        var doubleTap = new Hammer.Tap({ event: 'doubletap', taps: 2 });
        pinch.recognizeWith(pan);
        this.hammer.add([pinch, pan, doubleTap]);
        this.hammer.on('pinchstart', this.handleZoomStart);
        this.hammer.on('pinchmove', this.handleZoom);
        this.hammer.on('pinchmove panmove', this.handlePan);
        this.hammer.on('pinchend panend', this.handleSave);
        this.hammer.on('doubletap', this.handleReset);
    };
    /**
     * Lock in the focal point of the zoom
     */
    Zoom.prototype.handleZoomStart = function (e) {
        if (this.props.disabled || this.state.scale !== 1) {
            return;
        }
        this.setState({
            centerX: clamp(e.center.x / this.width, 0, 1) * 100,
            centerY: clamp(e.center.y / this.props.height, 0, 1) * 100
        });
    };
    /**
     * Determine the zoom value to apply
     */
    Zoom.prototype.handleZoom = function (e) {
        if (this.props.disabled) {
            return;
        }
        this.setState({ zoom: e.scale });
        if (this.props.handleZoom !== undefined) {
            this.props.handleZoom(this.state.scale * e.scale);
        }
    };
    /**
     * Determine the pan value to apply
     */
    Zoom.prototype.handlePan = function (e) {
        if (this.props.disabled) {
            return;
        }
        var newState = {
            offsetX: e.deltaX,
            offsetY: e.deltaY
        };
        if (this.state.scale + e.scale <= 2) {
            newState.offsetX = 0;
            newState.offsetY = 0;
        }
        this.setState(newState);
    };
    /**
     * Process the pan and zoom
     */
    Zoom.prototype.handleSave = function () {
        if (this.props.disabled) {
            return;
        }
        var scale = clamp(this.state.scale * this.state.zoom, 1, this.maxZoom);
        var newState = {
            scale: scale,
            x: this.state.x + this.state.offsetX,
            y: this.state.y + this.state.offsetY,
            zoom: 1,
            offsetX: 0,
            offsetY: 0
        };
        if (scale === 1) {
            newState.x = 0;
            newState.y = 0;
        }
        this.setState(newState);
        if (this.props.handleZoom !== undefined) {
            this.props.handleZoom(scale);
        }
    };
    /**
     * Reset on double tap
     */
    Zoom.prototype.handleReset = function () {
        if (this.props.disabled) {
            return;
        }
        this.setState(this.initialState);
        if (this.props.handleZoom !== undefined) {
            this.props.handleZoom(1);
        }
    };
    Zoom.prototype.render = function () {
        var _this = this;
        var scale = clamp(this.state.scale * this.state.zoom, 0.9, this.maxZoom + 1);
        var x = this.state.x + this.state.offsetX;
        var y = this.state.y + this.state.offsetY;
        return (React.createElement("div", { className: "zoom", style: { overflow: 'hidden' } },
            React.createElement("div", { className: "zoom__content", ref: function (e) { return (_this.element = e); }, style: {
                    transform: "scale(" + scale + ") translate(" + x + "px, " + y + "px)",
                    transformOrigin: this.state.centerX + "% " + this.state.centerY + "%",
                    transition: '0.1s all ease-out'
                } }, this.props.children)));
    };
    return Zoom;
}(React.Component));
exports["default"] = Zoom;
