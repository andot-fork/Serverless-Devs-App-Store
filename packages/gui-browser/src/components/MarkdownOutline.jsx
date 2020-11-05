import React from "react";
import * as unified from 'unified';
import * as markdown from 'remark-parse';
import _ from 'loadsh';
import { Nav } from "@alifd/next";
import { bindScroll, unbindScroll } from '../utils/common';
const { Item, SubNav } = Nav;
const markdownParse = unified().use(markdown);

class MarkdownOutline extends React.Component {
  constructor(props) {
    super(props);
    this.deepestNumber = 1;

  }

  componentDidMount() {
    const scrollable = document.getElementById('scrollable');
    bindScroll(scrollable);
  }

  componentWillUnmount() {
    unbindScroll()
  }

  scrollToElementPosition = (id) => {
    const element = document.getElementById(id);
    if (element && element.offsetTop) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth"
      });
    }

  }

  renderOutLine = (originArray, subArray, depth) => {
    const renderArr = subArray.filter((item) => item.depth === depth && item.type === 'heading');
    return renderArr.map((item, i) => {
      const nextItem = renderArr[i + 1];

      let hasChild = false;
      let indexSplice = {};
      if (nextItem) {
        let spliceStart = item.originIndex + 1;
        let spliceEnd = nextItem.originIndex;
        for (let i = spliceStart; i < spliceEnd; i++) {
          if (originArray[i] && originArray[i].type === 'heading') {
            hasChild = true;
          }
        }
        indexSplice.start = spliceStart;
        indexSplice.end = spliceEnd;
      } else {
        let spliceStart = item.originIndex + 1;
        let spliceEnd = subArray[subArray.length - 1].originIndex + 1;
        for (let i = spliceStart; i < spliceEnd; i++) {
          if (originArray[i] && originArray[i].type === 'heading') {
            hasChild = true;
          }
        }
        indexSplice.start = spliceStart;
        indexSplice.end = spliceEnd;
      }
      const { line, column } = _.get(item, 'children[0].position.start');
      const type = _.get(item, 'children[0].type', '');
      const value = _.get(item, 'children[0].value', '');
      if (hasChild) { // 存在差值
        return <SubNav label={<a onClick={() => this.scrollToElementPosition(`${type}-${line}-${column}-0`)}>{value}</a>} key={item.originIndex}>
          {this.renderOutLine(originArray, originArray.slice(indexSplice.start, indexSplice.end), depth + 1)}
        </SubNav>;
      } else {

        return <Item key={item.originIndex}><a  onClick={() => this.scrollToElementPosition(`${type}-${line}-${column}-0`)}>{value}</a></Item>
      }
    })
  }

  render() {
    const { context } = this.props;
    const markdownArray = _.get(markdownParse.parse(context), 'children', []).map((item, i) => Object.assign({}, item, { originIndex: i }));
    const firstDepth = _.get(markdownArray, '[0].depth', 1);
    return (<If condition={markdownArray.length > 0}><Nav defaultOpenAll >{this.renderOutLine(markdownArray, markdownArray, firstDepth)}</Nav></If>)
  }
}

export default MarkdownOutline;