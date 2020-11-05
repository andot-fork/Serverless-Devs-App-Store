import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { xonokai } from "react-syntax-highlighter/dist/esm/styles/prism";
import { jsx, javascript, sass, scss, yaml } from "react-syntax-highlighter/dist/esm/languages/prism";
class CodeBlock extends PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    language: PropTypes.string
  };

  static defaultProps = {
    language: null
  };

  componentWillMount() {

    SyntaxHighlighter.registerLanguage("jsx", jsx);
    SyntaxHighlighter.registerLanguage("javascript", javascript);
    SyntaxHighlighter.registerLanguage("js", javascript);
    SyntaxHighlighter.registerLanguage("yaml", yaml);
    SyntaxHighlighter.registerLanguage("sass", sass);
    SyntaxHighlighter.registerLanguage("scss", scss);
  }

  render() {
    const { language, value } = this.props;
    return (
      <figure className="highlight">
        <SyntaxHighlighter language={language} style={xonokai}>
          {value}
        </SyntaxHighlighter>
      </figure>
    );
  }
}
export default CodeBlock;