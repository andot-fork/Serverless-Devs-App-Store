import React from "react";
import { Form, Select, Field } from "@alifd/next";
import { FOTM_ITEM_LAYOUT } from '../../constants';
// import PropertyForm from './property-form';
import PropertyList from './property-list';
import EnumForm from './enum-form';
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
    value: 'Struct',
    label: 'Struct'
  }, {
    value: 'Enum',
    label: 'Enum'
  }
];


class ListForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      configData: {},
    };

    this.field = new Field(this, {
      onChange: () => {
        this.timmer && clearTimeout(this.timmer);
        this.timmer = setTimeout(() => {
          this.props.setConfigValue();
        }, 500);
      }
    });

  }



  componentDidMount() {

  }

  getValues = () => {
    const listParamsType = this.field.getValue('list-params-type') || '';
    if (this.propertyForm) {
      const structData = this.propertyForm.getValues();
      return {
        'List<Struct>': structData
      }
    } if (this.enumForm) {
      const enumData = this.enumForm.getValues();
      return {
        'List<Enum>': enumData
      }
    }
    else {
      return `List<${listParamsType}>`
    }
  }

  render() {

    const init = this.field.init;
    const { setConfigValue } = this.props;
    const paramsType = this.field.getValue('list-params-type');
    return <span>
      <FormItem
        {...FOTM_ITEM_LAYOUT}
        label={'List 泛型类型'}
        labelTextAlign="left"
        required
      >
        <Select style={{ width: '100%' }} dataSource={PARAMS_TYPE_LIST}  {...init('list-params-type', { rules: [{ required: true }], initValue: 'String' })} />
      </FormItem>
      <If condition={paramsType === 'Struct'}>
        <div className="struct-container"><PropertyList ref={(ref) => this.propertyForm = ref} setConfigValue={setConfigValue} /></div>
      </If>
      <If condition={paramsType === 'Enum'}>
        <div className="enum-container" ><EnumForm ref={(ref) => this.enumForm = ref} setConfigValue={setConfigValue} /></div>
      </If>
    </span>

  }
}

export default ListForm;
