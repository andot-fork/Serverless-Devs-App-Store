import React from "react";
import { Icon, Button, Tab, Switch, Dialog } from "@alifd/next";
import yaml from "js-yaml";
import Editor from "../../components/Editor";
// import HightLightBlock from "../../components/HightLightBlock";
import ProjectPannel from "./project-panel";
import Translation from "../../components/Translation";
import "./index.scss";
import _ from "loadsh";
import { request } from "../../utils/request";

class InitData extends React.Component {
  constructor(props) {
    super(props);
    this.childNode = {};
    this.singleStructArray = [];
    this.state = {
      title: "",
      visible: false,
      moreInfo: "",
      content: "",
      projectTabList: [],
      activeKey: "",
      configValue: "",
      templateObj: {},
      hideUnRequiredForm: true,
      guiObj: {},
    };
  }

  async componentDidMount() {
    this.initWindowHeight = window.innerHeight || 0;
    const lastPageData = _.get(this.props, "history.location.state", {});
    const { templateObj, guiObj } = await this.getConfigObj(lastPageData);
    const configValue = yaml.dump(templateObj);
    const projectTabList = Object.keys(templateObj).map((key) => {
      return {
        key,
        title: key,
        data: templateObj[key],
      };
    });

    const activeKey = _.get(projectTabList[0], "key", "");

    this.setState({
      guiObj,
      configValue,
      templateObj,
      activeKey,
      projectTabList,

    });

    const { onSaveConfigAndInitiate } = window;
    onSaveConfigAndInitiate && onSaveConfigAndInitiate(this.replyOnSaveConfigAndInitiate);
  }

  refreshGuiObj = async (callback) => {
    const lastPageData = _.get(this.props, "history.location.state", {});
    const { guiObj } = await this.getConfigObj(lastPageData);
    this.setState(
      {
        guiObj,
      },
      callback
    );
  };

  replyOnSaveConfigAndInitiate = (event, data) => {
    const { status, content, projectPath } = data;
    switch (status) {
      case 1:
        let moreInfo = "";
        let title = "保存配置成功";
        if (projectPath) {
          moreInfo = (
            <div>
              <div>
                项目地址为{" "}
                <span style={{ color: "#0000EF" }}>{projectPath}</span>{" "}
              </div>
              <div>您可以继续进行编辑，编辑之后可以通过命令行工具进一步操作：</div>
            </div>
          );
        } else {
          title = "保存配置成功,即将开始部署";
        }
        this.setState({
          title,
          content,
          moreInfo,
        });
        break;
      case 2:
        this.setState({
          title: "执行部署",
          content,
        });
        break;
      case 3:
        this.setState({
          title: "执行结束",
        });
        break;
      case 4:
        this.setState({
          title: "执行失败,请检查配置",
          content,
        });
        break;
      default:
        break;
    }
  };

  setCodeProperties = (data) => {
    let { templateObj } = this.state;
    const projectName = data.ProjectName;
    const Access = data.Access;
    const Provider = data.Provider;
    delete data.ProjectName;
    delete data.Access;
    delete data.Provider;
    if (templateObj[projectName]) {
      templateObj[projectName].Properties = data;
      templateObj[projectName].Access = Access || "";
      templateObj[projectName].Provider = Provider || "";
    }
    const configValue = yaml.dump(templateObj);
    this.setState({
      configValue,
      templateObj,
    });
  };

  setConfigValue = (configValue) => {
    this.setState({
      configValue,
    });
  };

  getConfigObj = async (params) => {
    let url = '/getTemplateFile';
    if (!window.isBrowser) {
      url = 'config-center-get-template';
    }
    const result = await request({
      url,
      params,
    });

    const templateObj = _.get(result, "data.configPart", {});
    const guiObj = _.get(result, "data.guiPart", {});
    return { templateObj, guiObj };
  };

  backToAppCenter = () => {
    this.props.history.push("/app");
  };

  saveConfigValue = (isExcuteCommand) => {
    const { configValue, activeKey } = this.state;
    if (this[activeKey].isValid()) {
      const currentRouter = _.get(this.props, "history.location.state", {});
      const { downloadFilePath } = currentRouter;
      const { saveConfigAndInitiate } = window;
      if (saveConfigAndInitiate) {
        this.setState({
          visible: true,
          title: "配置保存中，请稍后",
        });
        const data = {
          configValue,
          downloadFilePath,
          isExcuteCommand,
        };
        saveConfigAndInitiate({ data });
      }
    }
  };

  toggleUnRequriedForm = (hideUnRequiredForm) => {
    this.setState({
      hideUnRequiredForm,
    });
  };

  setActiveKey = (activeKey) => {
    this.setState({ activeKey });
  }

  closeDialog = () => {
    this.setState({
      visible: false,
      content: "",
    });
  };

  render() {
    const contentHeight = this.initWindowHeight - 189;
    const {
      projectTabList,
      activeKey,
      configValue,
      hideUnRequiredForm,
      title,
      content,
      visible,
      guiObj,
      moreInfo,
    } = this.state;
    return (
      <div className="init-container" style={{ height: this.initWindowHeight - 78, overflow: 'hidden' }}>
        <div className="init-title">
          <Icon
            type="arrow-left"
            className="back-icon"
            onClick={this.backToAppCenter}
          />
          <div className="title-span"><Translation>Init App</Translation></div>
        </div>
        <div
          className="init-data-part"
          style={{ height: contentHeight, overflow: "hidden" }}
        >
          <div
            className="left-part"
            style={{ height: contentHeight, overflow: "hidden" }}
          >
            <Tab triggerType="click" tabPosition="left" activeKey={activeKey} onChange={this.setActiveKey}>
              {projectTabList.map((item) => (
                <Tab.Item key={item.key} title={item.title}>
                  <div style={{ height: contentHeight, overflow: "auto" }}>
                    <ProjectPannel
                      data={item.data}
                      ref={(ref) => (this[item.key] = ref)}
                      refreshGuiObj={this.refreshGuiObj}
                      projectName={item.key}
                      guiData={guiObj[item.key]}
                      hideUnRequiredForm={hideUnRequiredForm}
                      setCodeProperties={this.setCodeProperties}
                    />
                  </div>
                </Tab.Item>
              ))}
            </Tab>
          </div>
          <div className="right-part">
            <Editor
              height={contentHeight}
              code={configValue}
              setConfigValue={this.setConfigValue}
            />
          </div>
        </div>
        <div className="init-footer">
          <Button
            type="primary"
            className="init-btn active"
            onClick={() => this.saveConfigValue(false)}
            style={{ marginRight: 10 }}
          >
            <Translation>Save</Translation>
          </Button>
          <Button
            type="primary"
            className="init-btn active"
            onClick={() => this.saveConfigValue(true)}
          >
            <Translation>Deploy</Translation>
          </Button>
          <Switch
            checked={hideUnRequiredForm}
            onChange={this.toggleUnRequriedForm}
            size="small"
            className="switch-button"
          />
          <span className="switch-word"><Translation>Hide optional fields</Translation></span>
        </div>
        <Dialog
          title={title}
          shouldUpdatePosition
          onClose={this.closeDialog}
          footer={<div style={{ width: "100%", textAlign: "right" }} />}
          visible={visible}
        >
          <div style={{ width: 650 }}>
            <If condition={moreInfo}>
              <div>{moreInfo}</div>
            </If>
            <If condition={content}>
              <div dangerouslySetInnerHTML={{ __html: content }} className="code-block-container" />
              {/* <HightLightBlock content={content} /> */}
            </If>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default InitData;
