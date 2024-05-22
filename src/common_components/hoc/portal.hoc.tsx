import React from 'react'
import ReactDOM from 'react-dom';

const portalRoot: any = document.getElementById("portal");

export default class Portal extends React.Component <{}, {}> {
  constructor(public props: any, public el: HTMLElement) { // eslint-disable-line
    super(props);
    // 1: Create a new div that wraps the component
    this.el = document.createElement("div");
  }

  // 2: Append the element to the DOM when it mounts
  componentDidMount = () => {
    portalRoot.appendChild(this.el);
  };

  // 3: Remove the element when it unmounts
  componentWillUnmount = () => {
    portalRoot.removeChild(this.el);
  };

  render() {
    // 4: Render the element's children in a Portal
    const { children } = this.props;
    return ReactDOM.createPortal(children, this.el);
  }
}
