import { h, render, Component } from 'preact';

import ContentShell from 'content-shell';

import './shared-styles/index.scss';

const mountPoint = document.getElementById('mount-point');

class App extends Component {
  render() {
    return <ContentShell />;
  }
}

render(<App />, mountPoint, mountPoint.lastElementChild);
