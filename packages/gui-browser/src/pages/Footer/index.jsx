import React from "react";
import "./index.scss";
import { Button, Switch } from "@alifd/next";

class CommonFooter extends React.Component {
  getValue = () => {};
  render() {
    const buttonContent = this.props.content;
    return (
      <footer className="footer-style">
        <Button className="footer-button" onClick={this.getValue}>
          <span className="button-content"> {buttonContent}</span>
        </Button>
        <Switch
          defaultChecked={false}
          size="small"
          className="switch-require"
        />
        <p className="hide-option">Hide optional fields</p>
      </footer>
    );
  }
}

export default CommonFooter;
