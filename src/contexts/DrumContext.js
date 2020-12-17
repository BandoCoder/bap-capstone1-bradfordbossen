import React from "react";

const PianoContext = React.createContext({
  pads: [],
  selectMultiple: false,
  addPad: (string) => {},
  removePad: (string) => {},
  setPads: (time, key) => {},
});

export default PianoContext;
