import React from "react";
import { Balloon } from "@alifd/next";
/*****************************此行为标记行, 请勿删和修改此行, 文件和组件依赖请写在此行上面, 主体代码请写在此行下面的class中*****************************/
/**
 * @author 寒斜
 * @desc 气泡
 * @example
 * <CommonBalloon
       content={'展示内容'}
    >
    {children}
  <CommonBalloon />
 */
class CommonBalloon extends React.Component {
  render() {
    const {
      content = "",
      children = null,
      closable = false,
      align = "r",
    } = this.props;

    return (
      <Balloon trigger={children} closable={closable} align={align}>
        {content}
      </Balloon>
    );
  }
}
/*****************************此行为标记行, 请勿删和修改此行, 主体代码请写在此行上面的class中, 组件导出语句及其他信息请写在此行下面*****************************/
export default CommonBalloon;
