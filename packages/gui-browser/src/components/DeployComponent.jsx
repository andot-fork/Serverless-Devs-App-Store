import React from "react";
import { Button, Dialog } from "@alifd/next";
import { TYPE_MAP } from "../constants";
import Translation from "./Translation";
class DeployComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      content: "",
      info: "",
      title: "",
      downloadFilePath: "",
      downLoadSuccess: false,
      choosedComponentData: {
        name: "",
        type: "",
        provider: "",
      },
    };
  }

  beginDownload = (data) => {
    const { name, type, provider } = data;
    const typeDesc = TYPE_MAP[type] || type;
    const downloadFilePath = data.result;
    this.setState({
      visible: true,
      title: <span><Translation>The directory is selected and ready to download</Translation>{`《${name}》【${typeDesc}】`}</span>,
      info: <span><Translation>Download path</Translation> {downloadFilePath}</span>,
      downloadFilePath: `${downloadFilePath}/${name}`,
      choosedComponentData: {
        name,
        type,
        provider,
      },
    });
  };

  downloadProcess = (data) => {
    const { result, name, type } = data;
    const typeDesc = TYPE_MAP[type] || type;
    this.setState({
      title: `${name} ${typeDesc} downing...`,
      content: result,
    });
  };

  downloadSuccess = (data) => {
    this.setState({
      title: <Translation>download successful</Translation>,
      downLoadSuccess: true,
    });
  };

  goInit = () => {
    const { downloadFilePath, choosedComponentData } = this.state;
    this.closeDialog();
    const path = {
      pathname: "/init",
      state: {
        downloadFilePath,
        ...choosedComponentData,
      },
    };
    this.props.history.push(path);
  };

  goDirectConfig = (data) => {
    const { name, type, provider } = data;
    this.setState({
      visible: true,
      title: <Translation>Configuration file already exists</Translation>,
      info: <span style={{ color: "green" }}><Translation>The configuration file already exists, please configure it directly</Translation></span>,
      downLoadSuccess: true,
      downloadFilePath: data.result,
      choosedComponentData: {
        name,
        type,
        provider,
      },
    });
  };

  showError = (data) => {
    this.setState({
      visible: true,
      title: <Translation>abnormal</Translation>,
      info: <span style={{ color: "red" }}><Translation>Exception information</Translation>：{data.result}</span>,
    });
  };

  replyDeploy = (data) => {
    const { status } = data;
    if (status === 1) {
      this.beginDownload(data);
    }
    if (status === 2) {
      this.downloadProcess(data);
    }
    if (status === 3) {
      this.downloadSuccess(data);
    }
    if (status === 4) {
      this.goDirectConfig(data);
    }
    if (status === 5) {
      this.showError(data);
    }
  };

  closeDialog = () => {
    this.setState({
      visible: false,
      content: "",
      info: "",
      downLoadSuccess: false,
    });
  };

  render() {
    const { title, visible, content, info, downLoadSuccess } = this.state;

    return (
      <Dialog
        title={title}
        shouldUpdatePosition
        onClose={this.closeDialog}
        footer={
          <div style={{ width: "100%", textAlign: "right" }}>
            <Button
              disabled={!downLoadSuccess}
              onClick={this.goInit}
              type="primary"

            >
              <Translation>Enter configuration</Translation>
            </Button>
          </div>
        }
        visible={visible}
      >
        <div style={{ width: 600 }}>
          <div style={{ marginBottom: 10 }}>{info}</div>
          <If condition={content}>
            {/* <HightLightBlock content={content} /> */}
            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className="code-block-container"
            />
          </If>
        </div>
      </Dialog>
    );
  }
}

export default DeployComponent;
