import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.scss";
import BasicLoyout from "./layout/index";
import Login from "./pages/Login/index";
import Register from "./pages/Login/register";

function App() {
  return (
    <div className="app">
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/app" push />} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route exact path="*" component={BasicLoyout} />
      </Switch>
    </div>
  );
}

export default App;
