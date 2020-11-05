import React from "react";
import "./index.scss";
import { Form, Input, Radio, Select } from "@alifd/next";

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    fixedSpan: 3,
  },
  wrapperCol: {
    span: 14,
  },
};

const publishFormItemLayout = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

export class Inputpart extends React.Component {
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
  componentDidMount() {
    const i = this.props.inputPart;
    if (i["Default"]) {
      let dvalue = i["Default"];

      this.setState({ inputValue: dvalue });
    } else if (i["Example"]) {
      let dvalue = i["Example"];

      this.setState({ inputValue: dvalue });
    }
  }

  render() {
    const i = this.props.inputPart;
    const name = this.props.name;
    const desc = i.Description;
    const req = i.Required;
    const inputValue = this.state.inputValue;

    return (
      <Form {...publishFormItemLayout} labelTextAlign="left">
        <FormItem required={req} label={name}>
          <Input
            className="init-input"
            value={inputValue}
            onChange={(e) => {
              this.setState({
                inputValue: e,
              });
            }}
          ></Input>
          <p className="init-input-desc">{desc} </p>
        </FormItem>
      </Form>
    );
  }
}

export class SingleBoolean extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      booleanValue: "",
    };
    if (props.onRef) {
      props.onRef(this);
    }
  }
  componentDidMount() {
    const i = this.props.inputPart;
    if (i["Default"]) {
      let dvalue = i["Default"];
      console.log(dvalue);
      this.setState({ booleanValue: dvalue });
    } else if (i["Example"]) {
      let dvalue = i["Example"];
      this.setState({ booleanValue: dvalue });
    }
  }
  getValue = () => {
    let res = {};
    res[this.props.name] = this.state.booleanValue;
    console.log(res);
    return res;
  };
  render() {
    const i = this.props.inputPart;
    const name = this.props.name;
    const desc = i.Description;
    const req = i.Required;
    return (
      <Form {...publishFormItemLayout} labelTextAlign="left">
        <FormItem required={req} label={name}>
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
          <p className="init-input-desc">{desc} </p>
        </FormItem>
      </Form>
    );
  }
}

const Option = Select.Option;
export class SingleSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      singleSelect: "",
    };
  }
  componentDidMount() {
    const i = this.props.inputPart;
    if (i["Default"]) {
      let dvalue = i["Default"];
      console.log(dvalue);
      this.setState({ singleSelect: dvalue });
    } else if (i["Example"]) {
      let dvalue = i["Example"];
      this.setState({ singleSelect: dvalue });
    }
  }
  getValue = () => {
    let res = {};
    res[this.props.name] = this.state.singleSelect;
    console.log(res);
    return res;
  };
  render() {
    const i = this.props.inputPart;
    const name = this.props.name;
    const desc = i.Description;
    const req = i.Required;
    const enumList = Object.values(i.Type[0])[0];
    return (
      <Form {...formItemLayout} labelTextAlign="left">
        <FormItem required={req} label={name}>
          <Select
            className="select-part"
            dataSource={enumList}
            value={this.state.singleSelect}
            onChange={(value) => {
              this.setState({ singleSelect: value });
            }}
          ></Select>
          <p className="init-input-desc">{desc} </p>
        </FormItem>
      </Form>
    );
  }
}

export class MulSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mulSelect: "",
    };
  }
  getValue = () => {
    let res = {};
    res[this.props.name] = this.state.mulSelect;
    console.log(res);
    return res;
  };
  render() {
    const i = this.props.inputPart;
    const name = this.props.name;
    const desc = i.Description;
    const req = i.Required;
    const enumList = Object.values(i.Type[0])[0];

    return (
      <Form {...formItemLayout} labelTextAlign="left">
        <FormItem required={req} label={name}>
          <Select
            mode="multiple"
            dataSource={enumList}
            onChange={(value) => {
              this.setState({
                mulSelect: value,
              });
            }}
          ></Select>
          <p className="init-input-desc">{desc} </p>
        </FormItem>
      </Form>
    );
  }
}

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
            className="init-input"
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
