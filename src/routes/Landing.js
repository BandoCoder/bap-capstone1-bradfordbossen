import React from "react";
import { Link } from "react-router-dom";

import "./Landing.css";

export default function Landing() {
  return (
    <section className="landing">
      <h1>WELCOME TO BAP</h1>
      <h3>Your very own beat machine!</h3>
      <p>
        This app is a drum sequencer. You are given a grid of buttons, each row
        is a different sound and each column is 1 beat out of 16. When you
        select a button from the grid and press 'Play', that sound will trigger
        on the coresponding beat. If you are new to this, just press play and
        start selecting boxes. It will make noise, and you will find your own
        sound. Never give up!
      </p>
      <h3>Try it out! Click:</h3>
      <Link className="nav-link-button" to="/sequencer">
        New Pattern
      </Link>
      <h3>To save your patterns, create an account:</h3>
      <Link className="nav-link-button" to="/signup">
        Signup
      </Link>
      <h3>Or log in to an existing account:</h3>
      <Link className="nav-link-button" to="/login">
        Login
      </Link>
    </section>
  );
}
