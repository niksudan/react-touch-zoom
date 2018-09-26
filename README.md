# react-touch-zoom

[![npm](https://img.shields.io/npm/v/react-touch-zoom.svg)](https://www.npmjs.com/package/react-touch-zoom)

Zoom and pan into any content on a touch device.

* Zoom with two fingers
* Pan with one finger
* Double tap to reset

> ⚠️ This is still a very rough version. Use at your own risk!

## Usage

Simply wrap any HTML in a `<Zoom />` container.

```jsx
<Zoom height={600}>
  <img src="https://source.unsplash.com/random/800x600" />
</Zoom>
```

* `height` (number, required) - Height of the container
* `maxZoom` (number, default: `8`) - The maximum zoom value
* `disabled` (boolean) - Whether to disable zooming
* `handleZoom` (function) - Callback whenever the zoom value has been changed
