import React from "react";
import { Form, Select, Icon, Field, Input } from "@alifd/next";

import { FOTM_ITEM_LAYOUT } from '../../constants';
import ListForm from './list-form';
import EnumForm from './enum-form';
import PropertyList from './property-list';
import Translation from "../../components/Translation";
import "./index.scss";

const FormItem = Form.Item;

const PARAMS_TYPE_LIST = [
  {
    value: 'String',
    label: 'String'
  }, {
    value: 'Number',
    label: 'Number'
  }, {
    value: 'Boolean',
    label: 'Boolean'
  }, {
    value: 'List',
    label: 'List'
  }, {
    value: 'Struct',
    label: 'Struct'
  }, {
    value: 'Enum',
    label: 'Enum'
  }
];

const hiddenStyle = {
  visibility: 'hidden',
  height: 0,
  padding: 0,
  margin: 0
}

const showStyle = {
  visibility: 'visible',
}
class ParamsType extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      closeStruct: false
    };
    this.field = new Field(this, {
      onChange: (name, value) => {
        this.timmer && clearTimeout(this.timmer);
        this.timmer = setTimeout(() => {
          this.props.setConfigValue();
        }, 500);
      },
    });

  }

  componentDidMount() {

  }

  toggleShowStruct = () => {
    const { closeStruct } = this.state;
    this.setState({
      closeStruct: !closeStruct
    })
  }

  getValues = () => {
    const paramsType = this.field.getValue('paramsType') || '';
    const paramseTypeDesc = this.field.getValue('paramsTypeDesc') || '';
    let desc = '';
    if (paramseTypeDesc) {
      desc = `[${paramseTypeDesc}]`
    }
    let typeObj = {};
    if (paramsType === 'List') {
      const listFormValues = this.listForm.getValues();
      console.log(listFormValues);
      if (typeof listFormValues === 'string') {
        return listFormValues + desc;
      }
      let firstKey = Object.keys(listFormValues)[0] || '';
      typeObj[`${firstKey}${desc}`] = listFormValues[`${firstKey}`];
      return typeObj;
    }
    if (paramsType === 'Struct') {
      typeObj[`Struct${desc}`] = this.structForm.getValues();
      return typeObj;
    }
    if (paramsType === 'Enum') {
      typeObj[`Enum${desc}`] = this.enumForm.getValues();
      return typeObj
    }

    return `${paramsType}${desc}`;
  }

  render() {
    const { id, removeParamsType, setConfigValue } = this.props;
    const paramsType = this.field.getValue('paramsType');
    const init = this.field.init;
    const { closeStruct } = this.state;
    return (
      <div style={{ position: 'relative', borderBottom: '1px solid #eee', marginBottom: 10 }} className="params-type-container">
        <span className="remove-icon"><Icon type="ashbin" onClick={() => removeParamsType(id)} /></span>
        <If condition={paramsType === 'Struct'}><span className="toggle-open"  onClick={this.toggleShowStruct}>{!closeStruct ? <a>收起</a> : <a>打开</a>}</span></If>
        <FormItem
          {...FOTM_ITEM_LAYOUT}
          label={<Translation>Param Type</Translation>}
          labelTextAlign="left"
          required
        >
          <Select style={{ width: '100%' }} dataSource={PARAMS_TYPE_LIST}  {...init('paramsType', { rules: [{ required: true }], initValue: 'String' })} />
        </FormItem>
        <If condition={paramsType === 'List'}>
          <ListForm id={`list-${id}`} ref={(ref) => this.listForm = ref} setConfigValue={setConfigValue} />
        </If>
        <If condition={paramsType === 'Struct'}>
          <div className="struct-container" style={closeStruct ? hiddenStyle : showStyle} ><PropertyList ref={(ref) => this.structForm = ref} setConfigValue={setConfigValue} /></div>
        </If>
        <If condition={paramsType === 'Enum'}>
          <div className="enum-container" ><EnumForm ref={(ref) => this.enumForm = ref} setConfigValue={setConfigValue} /></div>
        </If>
        <FormItem
          {...FOTM_ITEM_LAYOUT}
          label={<Translation>Param Type Desc</Translation>}
          labelTextAlign="left"
        >
          <Input  {...init('paramsTypeDesc')} />
        </FormItem>

      </div>
    );
  }
}

export default ParamsType;
