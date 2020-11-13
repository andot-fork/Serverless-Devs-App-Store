import React from "react";
import _ from "loadsh";

import "./cmp-content.scss";
import { Button } from "@alifd/next";
import ReactMarkdown from "react-markdown";
import { request } from "../../../utils/request";
import DeployComponent from "../../../components/DeployComponent";
import Translation from "../../../components/Translation";
import CodeBlock from "../../../components/CodeBlock";
import HeaderBlock from "../../../components/HeaderBlock";
import MarkdownOutline from "../../../components/MarkdownOutline";
import { getParams } from '../../../utils/common';

class ComponentContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      version: "",
      readme: "",
    };
  }

  async componentDidMount() {
    const id = getParams('id') || {};
    let readme = "";
    let version = "";
    let data = {};
    try {

      const result = await this.getComponentData({ id });
      const information = JSON.parse(result.Information);
      readme = result.Readme;
      version = information.Version;
      data = result;
    } catch (e) {
      console.log(e.message);
    }

    this.setState({
      data,
      readme,
      version,
    });
  }


  getComponentData = async (params) => {
    const result = await request({
      url: "/api/package/get/object/url",
      params,
    });
    const { Response } = result.data;
    return Response;
  };

  prepareDeploy = async () => {
    const { data } = this.state;

    const { openNativeDialog, onReplyOpenNativeDialog } = window;
    onReplyOpenNativeDialog((event, result) => {
      this.replyDeploy(result);
    });
    openNativeDialog({
      data,
    });
  };

  replyDeploy = (data) => {
    this.deployDialog && this.deployDialog.replyDeploy(data);
  };

  render() {
    const { data, readme } = this.state;
    const { history } = this.props;
    const {
      name,
      description,
      runtime,
      publish_time,
      download_count,
      type,
      user,
      tags = [],
      homepage = ""
    } = data;
    return (
      <div className="cmp-main-part">
        <div className="mid-component-content">
          <div name="1" id="intro">
            <div className="cmp-title"> {name}</div>
            <div className="cmp-title-desc">
              <span
                style={{
                  fontFamily: "Helvetica",
                  marginRight: "4px",
                }}
              >
                {name}
              </span>
              {description}
            </div>
            <div className="download-tag">
              <span
                className="update-time-download"
                style={{ marginRight: "21px" }}
              >
                <Translation>update</Translation>  {publish_time}
              </span>
              <img
                src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB5klEQVRYR+2WsU7DMBCGYzdS1eQBiuAlgJkJFiYCDJHdpSwICVhZK1GJRwCJDZbEigQoGxMbK+IBmIH2ATo1NjoUIxMcu01VdSBZMti+//N/vrORs+APLVjfqQFmdoAxFgghrvNUvsFfCDHEGH9gjO/CMHwypXkiABAhhKS6QEmSbGZZFuXCbXUOxviKEHIyEwBjrMc5P0cI3VJKD0zBkiRZzbLsUYF56HQ6+5UBpLgMYNpRmqbLo9HoRQjRBlghRBch9Ewp3agEoOx8gBA6gjxDcB1EURyciqJIVAZQxRuNxnYYhq+qiAqhE4cd5wADSunSVA7oxGUAmWPpRKvVulBtV89IHMefsG4qAJO4DgIhNJA5Lx5QqBxYU1Y9Mt5PGU4iXgJhrQ5rCkzistF4nrceBMG7CsE5P7TVue2uQbadM8YuOefHrutu2bqaTUw3juRhkae9OGnuAHCym83mULVXhZg7gM02EwDAc853CCF9W5yycetlZAKI4/gGWq7rumvQrIoi0KTKnP1ThmWEVQHkOt/3V0wQ3w6AlePxuOf7/mlxclWAKIruHcfZK3PnlwNSBGO8W+xcNUDtwP9wIH/Z9j3PCzVlCM/us7IxznlX9/CEW7RsTO051k5YtcVOuq4GWLgDXxkOQj+/THUZAAAAAElFTkSuQmCC`}
                alt="isTag"
                className="download-icon"
                style={{ marginRight: 4 }}
              />
              <span
                className="update-time-download"
                style={{ marginRight: "16px" }}
              >
                {download_count || "0"}
              </span>
              <If condition={tags !== ''}>
                <ul className="tag-display">
                  {tags.map((item, index) => (
                    <li key={index} className="tag-background">
                      {item}
                    </li>
                  ))}
                </ul>
              </If>
            </div>
            <div className="deploy-button">
              <If condition={!window.isBrowser}>
                <Button className="fast-deploy" onClick={this.prepareDeploy}>
                  <Translation>Fast Deploy</Translation>
                </Button>
              </If>
              {/* <Button className="local-deploy">Local Deploy </Button> */}
            </div>
          </div>
          <div className="mid-hr"></div>
          <div className="markdown-container">
            <ReactMarkdown
              source={readme}
              escapeHtml={false}
              renderers={{
                code: CodeBlock,
                heading: HeaderBlock,
              }}
            />
          </div>
        </div>
        <div className="component-tips-container">
          <div className="side-cmp">
            <div className="single-line">
              <div className="label-name">
                <div className="label-width">
                  <Translation className="label-width">Type</Translation>:{" "}
                </div>
                <span className="label-desc">{type}</span>
              </div>
            </div>
            <div className="single-line">
              <div className="label-name">
                <div className="label-width">
                  <Translation>Runtime</Translation>
                </div>
                <span className="label-desc">{runtime || '-'}</span>
              </div>
            </div>
            <div className="single-line">
              <div className="label-name">
                <div className="label-width">
                  <Translation>Author</Translation>
                </div>
                <span className="label-desc">{user}</span>
              </div>
            </div>
            <div className="single-line">
              <div className="label-name">
                <div className="label-width">
                  <Translation>Homepage</Translation>
                </div>
                <span className="label-desc a-tag" onClick={() => window.openExternal ? window.openExternal(homepage) : window.open(homepage)}>{homepage}</span>
              </div>
            </div>
            <div className="mid-hr"></div>
          </div>
          <div
            className="cmp-name"
            id="scrollable"
            style={{ borderLeft: "2px solid #eee", paddingLeft: 10 }}
          >
            {/* <div className="cmp-name-anchor">{name}</div> */}
            <MarkdownOutline context={readme} />
          </div>
        </div>
        <DeployComponent
          ref={(ref) => (this.deployDialog = ref)}
          history={history}
        />
      </div>
    );
  }
}

export default ComponentContent;
