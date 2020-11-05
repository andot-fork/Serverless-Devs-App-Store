import React from "react";
import "./index.scss";
import { request, processResponse } from "../../utils/request";
import { Form, Input, Button, Message, Notification } from "@alifd/next";
import Translation from "../../components/Translation";
import { withTranslation } from "react-i18next";
import { bindKeydown, unbindKeydown } from "../../utils/common";
const FormItem = Form.Item;
class SendResetUrl extends React.Component {
  handleSubmit = (values) => {
    console.log("Get form value:", values);
  };
  constructor(props) {
    super(props);
    this.state = { email: "" };
  }
  componentDidMount() {
    this.input.focus();
    bindKeydown(async () => {
      this.postEmail();
    });
  }

  componentWillUnmount() {
    unbindKeydown();
  }
  postEmail = async () => {
    const { email } = this.state;

    if (email) {
      const result = await request({
        url: "/api/user/retrieve",
        data: {
          email: email,
        },
        method: "post",
      });
      let isValidEmail = processResponse(result);
      if (isValidEmail) {
        this.props.history.push("/has-send");
      } else {
        Message.error({
          title: "Please input valid email",
        });
      }
    } else {
      Message.error({
        title: "Please input your account email",
      });
    }
  };

  render() {
    const { email } = this.state;
    const { t } = this.props;
    return (
      <div className="reset-part">
        <Form className="reset-form" style={{ width: "300px" }}>
          <p className="reset-information">
            <Translation>Send a reset link</Translation>
          </p>

          <p className="safe-desc">
            <Translation>
              Don't worry, please enter the email address you used when you
              registered, we will send you a security link to help you reset
              your password
            </Translation>
          </p>
          <FormItem style={{ marginBottom: "24px" }}>
            <Input
              className="login-input-part"
              value={email}
              htmlType="text"
              name="email"
              ref={(input) => (this.input = input)}
              placeholder={t("Email")}
              onChange={(e) => {
                this.setState({
                  email: e,
                });
              }}
            />
          </FormItem>
          <FormItem className="login-button">
            <div className="reset-button">
              <Button className="is-log" onClick={this.postEmail}>
                <span className="login-sign-content">
                  {" "}
                  <Translation>Send</Translation>
                </span>
              </Button>
            </div>
          </FormItem>
        </Form>
        <footer className="reset-footer-part">
          Powered by Serverless Devs
        </footer>
      </div>
    );
  }
}

class HasSendUrl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goResetInput: 3,
    };
  }

  componentDidMount() {
    Notification.open({
      title: "Reset step",
      content:
        "The page will jump to the reset information page after 3 seconds",
      duration: 2000,
    });
    let timer = setInterval(() => {
      this.setState(
        (preState) => ({
          goResetInput: preState.goResetInput - 1,
        }),
        () => {
          if (this.state.goResetInput === 0) {
            clearInterval(timer);
          }
        }
      );
    }, 1000);
  }
  render() {
    if (this.state.goResetInput === 0) {
      this.props.history.push("/reset-input");
    }
    return (
      <div className="reset-part">
        <div className="reset-form" style={{ width: "300px" }}>
          <p className="reset-information">
            <Translation>Link sent</Translation>{" "}
          </p>

          <p className="safe-desc">
            <Translation>
              Please login to the email address you used when you registered,
              check the link and reset your password
            </Translation>
          </p>
          <div className="reset-has-url" onClick={this.toInput}></div>
        </div>
        <footer className="reset-footer-part">
          Powered by Serverless Devs
        </footer>
      </div>
    );
  }
}
class SuccessReset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goApp: 3,
    };
  }
  componentDidMount() {
    Notification.open({
      title: "Successful Reset",
      content: "The page will jump to the app store  after 3 seconds",
      duration: 2000,
    });

    let timer = setInterval(() => {
      this.setState(
        (preState) => ({
          goApp: preState.goApp - 1,
        }),
        () => {
          if (this.state.goApp === 0) {
            clearInterval(timer);
          }
        }
      );
    }, 1000);
  }
  gotoApp = () => {
    this.props.history.push("/app");
  };

  render() {
    const { goApp } = this.state;
    if (goApp === 0) {
      this.props.history.push("/app");
    }
    return (
      <div className="reset-part">
        <div className="reset-form" style={{ width: "400px" }}>
          <p className="reset-information">
            <Translation>Login information reset successfully</Translation>
          </p>

          <p className="safe-desc">
            <Translation></Translation>
            After <span className="success-reset-time">3s</span>, you will jump
            to the application center.
            <span className="success-reset-time" onClick={this.gotoApp}>
              jump immediately
            </span>
          </p>
          <div className="reset-has-url"></div>
        </div>
        <footer className="reset-footer-part">
          Powered by Serverless Devs
        </footer>
      </div>
    );
  }
}
class ResetInformation extends React.Component {
  handleSubmit = (values) => {
    console.log("Get form value:", values);
  };
  constructor(props) {
    super(props);
    this.state = {
      isLogin: true,
      code: "",
      resetPassword: "",
      confirmPassword: "",
    };
  }
  componentDidMount() {
    this.input.focus();
    bindKeydown(async () => {
      this.postSave();
    });
  }
  componentWillUnmount() {
    unbindKeydown();
  }
  postSave = async () => {
    const { code, resetPassword, confirmPassword } = this.state;

    if (code && resetPassword && confirmPassword) {
      if (confirmPassword === resetPassword) {
        const result = await request({
          url: "/api/user/update/password",
          data: {
            code: code,
            password: confirmPassword,
          },
          method: "post",
        });
        console.log(result);
        const isSucceedReset = processResponse(result, "reset");
        if (isSucceedReset) {
          this.props.history.push("/success-reset");
        }
      } else {
        Message.error({
          title: "Please input the same password",
        });
      }
    } else {
      Message.error({ title: "Please fill in the form" });
    }
  };

  render() {
    const { t } = this.props;
    const { code, resetPassword, confirmPassword } = this.state;
    return (
      <div className="reset-part">
        <Form className="reset-form" style={{ width: "300px" }}>
          <p className="reset-information">
            <Translation>Reset login information</Translation>
          </p>
          <FormItem className="form-item" style={{ marginBottom: "24px" }}>
            <Input
              className="login-input-part"
              value={code}
              htmlType="text"
              name="username"
              placeholder={t("Code")}
              ref={(input) => (this.input = input)}
              onChange={(e) => {
                console.log(e);
                this.setState({
                  code: e,
                });
              }}
            />
          </FormItem>
          <FormItem style={{ marginBottom: "24px" }}>
            <Input
              className="login-input-part"
              value={resetPassword}
              htmlType="text"
              name="email"
              placeholder={t("resetPassword")}
              onChange={(e) => {
                this.setState({
                  resetPassword: e,
                });
              }}
            />
          </FormItem>
          <FormItem>
            <Input
              className="login-input-part"
              value={confirmPassword}
              htmlType="Password"
              name="basePass"
              placeholder={t("confirmPassword")}
              onChange={(e) => {
                this.setState({
                  confirmPassword: e,
                });
              }}
            />
          </FormItem>

          <FormItem className="login-button">
            <div className="reset-button">
              <Button className="is-log" onClick={this.postSave}>
                <span className="login-sign-content">
                  <Translation>Save</Translation>
                </span>
              </Button>
            </div>
          </FormItem>
        </Form>

        <footer className="reset-footer-part">
          Powered by Serverless Devs
        </footer>
      </div>
    );
  }
}
const withSendResetUrl = withTranslation()(SendResetUrl);
const withResetInformation = withTranslation()(ResetInformation);
export default {
  SendResetUrl: withSendResetUrl,
  HasSendUrl: HasSendUrl,
  SuccessReset: SuccessReset,
  ResetInformation: withResetInformation,
};
