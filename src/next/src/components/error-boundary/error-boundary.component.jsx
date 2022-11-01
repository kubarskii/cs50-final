import React, { Component } from 'react';

export default class Boundary extends Component {
  static getDerivedStateFromError(error) {
    return { hasError: true, error: error.toString() };
  }

  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: '',
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { children, type } = this.props;
    if (hasError) {
      return (
        <div
          style={{
            padding: '6px 12px',
            boxSizing: 'border-box',
            border: '1px solid #ffd6d6',
            background: '#fff0f0',
            color: '#ff0000',
          }}
        >
          {!!type && (
          <h3 style={{ margin: '0 0 12px 0' }}>
            Error occurred in widget:
            <b style={{ color: 'grey' }}>{` <${type} />`}</b>
          </h3>
          )}
          <p>Please check console for more details</p>
          <p>{error}</p>
        </div>
      );
    }

    return children;
  }
}
