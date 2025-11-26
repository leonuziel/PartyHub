import React from 'react';

const rrd = {
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ children }) => <div>{children}</div>,
  Link: ({ children } )=> <a href={children}>{children}</a>,
};

module.exports = rrd;
