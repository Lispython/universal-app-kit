import React, { Component } from 'react'
const { inspect } = require('util');

import withStyles from 'isomorphic-style-loader/withStyles'

import styles from "./my_styles.css";


function Hello(props) {
  return (<div id="hello" className={styles.component1} >
    {props.children}
    <h2>Hello component:</h2>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/users">Users</a></li>
      <li><a href="/user/10">User 10</a></li>
    </ul>
  </div>);
}


export default Hello
