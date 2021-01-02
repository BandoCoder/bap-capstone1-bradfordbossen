import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Grid from "./Grid";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <BrowserRouter>
      <Grid />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
