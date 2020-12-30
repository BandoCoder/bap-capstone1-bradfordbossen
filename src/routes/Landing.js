import React from "react";
import { Link } from "react-router-dom";

import "./Landing.css";

export default function Landing() {
  return (
    <section className="landing">
      <h1>WELCOME TO BAP</h1>
      <h2>Your very own beat machine!</h2>
      <p>
        This app is a drum sequencer. You are given a grid of buttons, each row
        is a different sound and each column is 1 beat out of 16. When you
        select a button from the grid and press 'Play', that sound will trigger
        on the coresponding beat. If you are new to this, just press play and
        start selecting boxes. It will make noise, and you will find your own
        sound. Never give up!
      </p>
      <h2>Try it out! Click:</h2>
      <Link className="nav-link" to="/sequencer">
        New Pattern
      </Link>
      <h2>To save your patterns, create an account:</h2>
      <Link className="nav-link" to="/signup">
        Signup
      </Link>
      <h2>Or log in to an existing account:</h2>
      <Link className="nav-link" to="/login">
        Login
      </Link>
    </section>
  );
}
