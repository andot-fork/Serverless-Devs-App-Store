import React from "react";
import MonacoEditor from "react-monaco-editor";

export default class Editor extends React.Component {
  editorDidMount = (editor, monaco) => {
    editor.focus();
  };
  onChange = (newValue, e) => {
    const { setConfigValue } = this.props;
    setConfigValue(newValue);
  };
  render() {
    const { code, language = "yaml", height } = this.props;
    const options = {
      selectOnLineNumbers: true,
    };
    return (
      <MonacoEditor
        width="614"
        height={height}
        language={language}
        theme="vs-dark"
        value={code}
        options={options}
        onChange={this.onChange}
        editorDidMount={this.editorDidMount}
      />
    );
  }
}
