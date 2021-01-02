import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Pad from "./Pad";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <BrowserRouter>
      <Pad />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
