import React from 'react';
import ReactDOM from 'react-dom';
import TreeToggle from './TreeToggle';

it('renders without crashing', () => {
  const div = document.createElement('div');
  //props.view.sourceTreeOpen}
  ReactDOM.render(<TreeToggle view={{
    sourceTreeOpen:true
  }} />, div);
});

it('should prompt user to open the tree when the tree is closed', () => {
  const div = document.createElement('div');
  //props.view.sourceTreeOpen}
  ReactDOM.render(<TreeToggle view={{
    sourceTreeOpen:false
  }} />, div);

  if(!div.innerHTML.includes('Open ')) {
    const err = `Tree toggle button should prompt users to open the three when the tree is closed`;
    console.log(err);
    throw new Error(err);
  }
});

it('should prompt user to close the tree when the tree is open', () => {
  const div = document.createElement('div');
  //props.view.sourceTreeOpen}
  ReactDOM.render(<TreeToggle view={{
    sourceTreeOpen:true
  }} />, div);

  if(!div.innerHTML.includes('Close ')) {
    const err = `Tree toggle button should prompt users to close the three when the tree is open`;
    console.log(err);
    throw new Error(err);
  }
});

it('should contain the aria-controls attribute', () => {
  const div = document.createElement('div');
  //props.view.sourceTreeOpen}
  ReactDOM.render(<TreeToggle view={{
    sourceTreeOpen:true
  }} />, div);

  if(!div.querySelector(`#eureka__tree-toggle__button`).hasAttribute('aria-controls')) {
    const err = `Tree toggle button should contain the aria-controls attribute`;
    console.log(err);
    throw new Error(err);
  }

});

it('should contain the aria-expanded attribute', () => {
  const div = document.createElement('div');
  //props.view.sourceTreeOpen}
  ReactDOM.render(<TreeToggle view={{
    sourceTreeOpen:true
  }} />, div);

  if(!div.querySelector(`#eureka__tree-toggle__button`).hasAttribute('aria-expanded')) {
    const err = `Tree toggle button should contain the aria-expanded attribute`;
    console.log(err);
    throw new Error(err);
  }

});

it('should have an aria-expanded attribute based on sourceTreeOpen', () => {
  const div = document.createElement('div');
  //props.view.sourceTreeOpen}
  ReactDOM.render(<TreeToggle view={{
    sourceTreeOpen:true
  }} />, div);

  if(!((div.querySelector(`#eureka__tree-toggle__button`).getAttribute('aria-expanded') == "true") ? true : false)) {
    const err = `Should have an aria-expanded attribute of true`;
    console.log(err);
    throw new Error(err);
  }

});
