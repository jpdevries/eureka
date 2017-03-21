import React from 'react';
import ReactDOM from 'react-dom';
import ContextMenu from './ContextMenu';

import {cssSafe} from '../utility/utility';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const tr = document.createElement('tr');
  const item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  ReactDOM.render(<ContextMenu config={{
    allowRename:true,
    allowDelete:true,
    storagePrefix:'eureka__'
  }} item={item} hidden={false}  />, tr);

});

it('should contain a delete button if allowDelete is true', () => {
  const tr = document.createElement('tr');
  const item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  ReactDOM.render(<ContextMenu config={{
    allowRename:true,
    allowDelete:true,
    storagePrefix:'eureka__'
  }} item={item} hidden={false}  />, tr);

  if(!tr.querySelector(`#eureka__delete__${cssSafe(item.filename)}`)) {
    const err = 'it should contain a delete button if allowDelete is true';
    console.log(err);
    throw new Error(err);
  }

});

it('should not contain a delete button if allowDelete is not true', () => {
  const tr = document.createElement('tr');
  const item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  ReactDOM.render(<ContextMenu config={{
    allowRename:true,
    allowDelete:false,
    storagePrefix:'eureka__'
  }} item={item} hidden={false}  />, tr);

  if(tr.querySelector(`#eureka__delete__${cssSafe(item.filename)}`)) {
    const err = 'it should not contain a delete button if allowDelete is not true';
    console.log(err);
    throw new Error(err);
  }

});

it('should contain a rename button if allowRename is true', () => {
  const tr = document.createElement('tr');
  const item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  ReactDOM.render(<ContextMenu config={{
    allowRename:true,
    allowDelete:true,
    storagePrefix:'eureka__'
  }} item={item} hidden={false}  />, tr);

  if(!tr.querySelector(`#eureka__rename__${cssSafe(item.filename)}`)) {
    const err = 'it should contain a rename button if allowRename is true';
    console.log(err);
    throw new Error(err);
  }

});

it('should not contain a rename button if allowRename is not true', () => {
  const tr = document.createElement('tr');
  const item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  ReactDOM.render(<ContextMenu config={{
    allowRename:false,
    allowDelete:true,
    storagePrefix:'eureka__'
  }} item={item} hidden={false}  />, tr);

  if(tr.querySelector(`#eureka__rename__${cssSafe(item.filename)}`)) {
    const err = 'it should not contain a rename button if allowRename is not true';
    console.log(err);
    throw new Error(err);
  }

});

it('should be semantically hidden if hidden is true', () => {
  const tr = document.createElement('tr');
  const item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  ReactDOM.render(<ContextMenu config={{
    allowRename:false,
    allowDelete:true,
    storagePrefix:'eureka__'
  }} item={item} hidden={true}  />, tr);

  if(!tr.querySelector(`td`).hasAttribute('hidden')) {
    const err = 'it should be semantically hidden if hidden is not true';
    console.log(err);
    throw new Error(err);
  }

});

it('should not be semantically hidden if hidden is not true', () => {
  const tr = document.createElement('tr');
  const item = {
    filename: 'sky.jpg'
  };
  //props.view.sourceTreeOpen}
  ReactDOM.render(<ContextMenu config={{
    allowRename:false,
    allowDelete:true,
    storagePrefix:'eureka__'
  }} item={item} hidden={false}  />, tr);

  if(tr.querySelector(`td`).hasAttribute('hidden')) {
    const err = 'it should be semantically hidden if hidden is not true';
    console.log(err);
    throw new Error(err);
  }

});

it('renders a snapshot', () => {
  const item = {
    filename: 'sky.jpg'
  },
  icon = renderer.create((
    <ContextMenu config={{
      allowRename:false,
      allowDelete:true,
      storagePrefix:'eureka__'
    }} item={item} hidden={false}  />
  )).toJSON();

  expect(icon).toMatchSnapshot();
});
