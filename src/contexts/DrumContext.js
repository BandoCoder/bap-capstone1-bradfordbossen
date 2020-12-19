import React from "react";

const DrumContext = React.createContext({
  pads: [],
  addPad: (string) => {},
  removePad: (string) => {},
  setPads: (time, key) => {},
});

export default DrumContext;
