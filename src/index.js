import { h, render, Component } from 'preact';

import ContentRouter from 'content-router';

import './shared-styles/index.scss';

const mountPoint = document.getElementById('mount-point');

class App extends Component {
  render() {
    return <ContentRouter />;
  }
}

render(<App />, mountPoint, mountPoint.lastElementChild);
