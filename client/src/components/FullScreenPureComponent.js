import React, { PureComponent } from 'react';

class FullScreenPureComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ifFullscreen: false,
      supportsFullscreen: this.featureDetectFullscreen()
    };

    // isn't this fun? why are you crying?
    document.onfullscreenchange = document.onwebkitfullscreenchange = document.onmozfullscreenchange = document.onmsfullscreenchange = document.onwebkitfullscreenchange = this.handleFullScreenChange.bind(this);
  }

  handleFullScreenChange(event) {
    this.setState({
      isFullscreen: this.getFullScreenElement() !== undefined
    });
  }

  featureDetectFullscreen() {
    return (
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  }

  getFullScreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || undefined;
  }

}

export default FullScreenPureComponent;
