import React from "react";
import "./publishCommon.scss";
import { Form, Input, Radio, Select } from "@alifd/next";

const FormItem = Form.Item;

const publishFormItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

export class PublishInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
    };
  }

  getValue = () => {
    const inputvalue = this.state.inputValue;
    let res = {};
    res[this.props.name] = inputvalue;
    console.log(res);
    return res;
  };

  render() {
    const name = this.props.name;
    const inputValue = this.state.inputValue;
    return (
      <Form {...publishFormItemLayout} labelTextAlign="left">
        <FormItem required={true} label={name}>
          <Input
            className="publish-input"
            value={inputValue}
            onChange={(e) => {
              this.setState({
                inputValue: e,
              });
            }}
          ></Input>
        </FormItem>
      </Form>
    );
  }
}

export class PublishBoolean extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      booleanValue: "",
    };
    if (props.onRef) {
      props.onRef(this);
    }
  }

  getValue = () => {
    let res = {};
    res[this.props.name] = this.state.booleanValue;
    console.log(res);
    return res;
  };
  render() {
    const name = this.props.name;

    return (
      <Form {...publishFormItemLayout} labelTextAlign="left">
        <FormItem required={true} label={name}>
          <Radio.Group
            shape="normal"
            value={this.state.booleanValue}
            onChange={(value) => {
              this.setState({
                booleanValue: value,
              });
            }}
          >
            <Radio value="true">true</Radio>
            <Radio value="false">false</Radio>
          </Radio.Group>
        </FormItem>
      </Form>
    );
  }
}

export class PublishSingle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      singleSelect: "",
    };
  }

  getValue = () => {
    let res = {};
    res[this.props.name] = this.state.singleSelect;
    console.log(res);
    return res;
  };
  render() {
    const name = this.props.name;
    const enumList = this.props.singleSelect;
    return (
      <Form {...publishFormItemLayout} labelTextAlign="left">
        <FormItem required={true} label={name}>
          <Select
            className="select-part"
            dataSource={enumList}
            value={this.state.singleSelect}
            onChange={(value) => {
              this.setState({ singleSelect: value });
            }}
          ></Select>
        </FormItem>
      </Form>
    );
  }
}

export class PublishMul extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      singleSelect: "",
    };
  }

  getValue = () => {
    let res = {};
    res[this.props.name] = this.state.singleSelect;
    console.log(res);
    return res;
  };
  render() {
    const name = this.props.name;
    const enumList = this.props.singleSelect;
    return (
      <Form {...publishFormItemLayout} labelTextAlign="left">
        <FormItem required={true} label={name}>
          <Select
            mode="multiple"
            className="select-part"
            dataSource={enumList}
            value={this.state.singleSelect}
            onChange={(value) => {
              this.setState({ singleSelect: value });
            }}
          ></Select>
        </FormItem>
      </Form>
    );
  }
}
