import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class Nav extends Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to="/todo">Todo</Link>
          </li>
          <li>
            <Link to="/search">Search</Link>
          </li>
        </ul>
      </div>
    )
  }
}
