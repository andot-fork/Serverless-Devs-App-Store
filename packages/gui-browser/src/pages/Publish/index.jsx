import React from "react";
import { Icon, Button, Dialog, Message } from "@alifd/next";
import yaml from "js-yaml";
import Editor from "../../components/Editor";
import HightLightBlock from "../../components/HightLightBlock";
import ProjectPannel from "./project-panel";
import Translation from "../../components/Translation";
import "./index.scss";

import { request } from "../../utils/request";
const defaultConfig = {
  Type: "App",
  Name: "",
  Provider: "",
  Description: "",
  HomePage: "",
  Commands: "",
  Tags: "",
  Category: "",
  Service: "",
  Properties: {
    ProjectName: {
      Description: "",
      Required: "",
      Type: "",
    },
    CodeUri: {
      Description: "",
      Required: "",
      Type: "",
    },
  },
};

class Publish extends React.Component {
  constructor(props) {
    super(props);
    this.childNode = {};
    this.singleStructArray = [];
    this.state = {
      title: "",
      visible: false,
      moreInfo: "",
      content: "",
      configValue: "",
      configData: "",
      templateObj: {}
    };
  }

  async componentDidMount() {
    const configValue = yaml.dump(defaultConfig);
    this.setState({
      configValue,
      configData: defaultConfig,
    });
    const { onPublishTemplate } = window;
    onPublishTemplate && onPublishTemplate(this.replyOnSavePublishConfig);
  }

  replyOnSavePublishConfig = (event, data) => {
    console.log(event);
    console.log(data);
  };

  backToAppCenter = () => {
    this.props.history.push("/app");
  };

  savePublishConfig = () => {
    if (this.projectPannel.validate()) {
      const { configValue } = this.state;
      const { publishTemplate } = window;
      publishTemplate &&
        publishTemplate({ data: { publishFile: configValue } });
    }
  };
  executePublish = async () => {
    const result = await request({
      url: "/package/put/object/url",
      data: {
        user: "yeguang",
        publish: "hello world",
      },
      method: "post",
    });
    const isValidToken = result.data.isValidToken;
    if (!isValidToken) {
      Message.error({
        title: "you are not login,please login",
      });
      this.props.history.push({
        pathname: "login",
        state: { from: this.props.location.pathname },
      });
    } else {
      Message.success({
        title: "your config has been saved",
      });
    }
  };
  setConfigValue = (values) => {
    const configValue = yaml.dump(values);
    this.setState({
      configValue,
    });
  };

  render() {
    const contentHeight = window.innerHeight - 189;
    const {
      configValue,
      title,
      content,
      visible,
      moreInfo,
    } = this.state;
    return (
      <div className="publish-container">
        <div className="publish-title">
          <Icon
            type="arrow-left"
            className="back-icon"
            onClick={this.backToAppCenter}
          />
          <div className="title-span">
            <Translation>Publish</Translation>
          </div>
        </div>
        <div
          className="publish-data-part"
          style={{ height: contentHeight, overflow: "hidden" }}
        >
          <div
            className="left-part"
            style={{ height: contentHeight, overflow: "hidden" }}
          >
            <div style={{ height: contentHeight, overflow: "auto" }}>
              <ProjectPannel
                ref={(ref) => (this.projectPannel = ref)}
                setConfigValue={this.setConfigValue}
              />
            </div>
          </div>
          <div className="right-part">
            <Editor
              height={contentHeight}
              code={configValue}
              setConfigValue={this.setConfigValue}
            />
          </div>
        </div>
        <div className="publish-footer">
          <Button
            type="primary"
            className="publish-btn active"
            onClick={() => this.savePublishConfig()}
            style={{ marginRight: 10 }}
          >
            <Translation>Save</Translation>
          </Button>
          <Button
            type="primary"
            className="publish-btn active"
            onClick={() => this.executePublish()}
            style={{ marginRight: 10 }}
          >
            <Translation>Execute</Translation>
          </Button>

          {/* <Switch checked={hideUnRequiredForm} onChange={this.toggleUnRequriedForm} size="small" className="switch-button" />
          <span className="switch-word">Hide optional fields</span> */}
        </div>
        <Dialog
          title={title}
          shouldUpdatePosition
          onClose={this.closeDialog}
          footer={<div style={{ width: "100%", textAlign: "right" }} />}
          visible={visible}
        >
          <div style={{ width: 600 }}>
            <If condition={moreInfo}>
              <div>{moreInfo}</div>
            </If>
            <If condition={content}>
              <HightLightBlock content={content} />
            </If>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default Publish;
