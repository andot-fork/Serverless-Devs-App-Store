import React from "react";
import { Form, Input, Field, Select, Button, Dialog, Message } from "@alifd/next";
import { PROVIDER_MAP, PROVIDER_LIST, } from '../constants';
import Translation from "./Translation";
const FormItem = Form.Item;
export const layout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: { span: 16 },
};
class AccessConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: <Translation>Configuration information</Translation>,
      visible: false,
      content: '',
      accessFormList: ['AccountID', 'AccessKeyID', 'AccessKeySecret']

    };
    this.field = new Field(this);
    const { onAddAccessConfig } = window;
    onAddAccessConfig && onAddAccessConfig(this.getAddConfigReplay);
  }

  closeDialog = () => {
    this.setState({
      visible: false
    })
  }

  changeProvider = (provider) => {

    this.field.setValue('Provider', provider);
    const accessFormList = PROVIDER_MAP[provider] || {};
    this.setState({
      accessFormList
    })
  }

  openDialog = () => {
    this.setState({
      visible: true
    })
  }

  saveConfig = () => {
    this.field.validate((error, values) => {
      if (error) {
        return;
      }
      const { addAccessConfig } = window;
      addAccessConfig && addAccessConfig({ data: values });
    })
  }

  getAddConfigReplay = (event, data) => {
    const { status, content } = data;
    if (status === 0) {
      Message.show({
        type: 'error',
        title: <Translation>Error</Translation>,
        content,
        hasMask: true
      });
      return;
    }
    if (status === 1) {
      const { refreshGuiObj } = this.props;
      refreshGuiObj && refreshGuiObj();
      this.closeDialog();
    }
  }

  openBrowser = (url) => {
    window.openExternal ? window.openExternal(url) : window.open(url);
  }

  render() {
    const { title, visible, accessFormList } = this.state;
    const init = this.field.init;
    return (
      <Dialog
        title={title}
        shouldUpdatePosition
        onClose={this.closeDialog}
        footer={
          <div style={{ width: '100%', textAlign: 'right' }}>
            <Button type='primary' onClick={this.saveConfig}><Translation>Sure to add</Translation></Button>
          </div>
        }
        visible={visible}
      >
        <div style={{ width: 420 }}>
          <Form
            {...layout}
            field={this.field}
            style={{
              backgroundColor: '#FFFFFF',
            }}
            labelTextAlign="left"
          >
            <FormItem
              {...layout}

              label={'Provider'}
              labelTextAlign="left"
              required={true}
            >
              <Select style={{ width: '100%' }} dataSource={PROVIDER_LIST}  {...init("Provider", { initValue: 'alibaba' })} onChange={this.changeProvider} />
            </FormItem>
            <FormItem
              {...layout}

              label={'AliasName'}
              labelTextAlign="left"

            >
              <Input style={{ width: '100%' }}   {...init('AliasName', { initValue: 'default' })} />
            </FormItem>
            {accessFormList.map((key) => <FormItem
              {...layout}
              key={key}
              label={key}
              labelTextAlign="left"
              required={true}
            >
              <Input style={{ width: '100%' }}   {...init(key, {
                rules: [{
                  required: true
                }]
              })} />
            </FormItem>)}
          </Form>
          <span className="a-tag" onClick={() => this.openBrowser('https://github.com/Serverless-Devs/docs/blob/master/docs/zh/tool/%E5%AF%86%E9%92%A5%E9%85%8D%E7%BD%AE.md#user-content-%E4%BA%91%E5%8E%82%E5%95%86%E5%AF%86%E9%92%A5%E9%85%8D%E7%BD%AE')} ><Translation>Cloud vendor secret key setting guidelines</Translation></span>
        </div>
      </Dialog>
    );
  }
}

export default AccessConfig;
