import { useState } from 'react';

const isBrowser = typeof window !== 'undefined';

export function stringifyOptions(options) {
  return Object.keys(options).reduce((acc, key) => {
    if (key === 'days') {
      return acc;
    }
    if (options[key] === false) {
      return acc;
    } if (options[key] === true) {
      return `${acc}; ${key}`;
    }
    return `${acc}; ${key}=${options[key]}`;
  }, '');
}

export const setCookie = (name, value, options) => {
  if (!isBrowser) return;

  const optionsWithDefaults = {
    days: 7,
    path: '/',
    ...options,
  };

  const expires = new Date(
    Date.now() + optionsWithDefaults.days * 864e5,
  ).toUTCString();

  document.cookie = `${name
  }=${
    encodeURIComponent(value)
  }; expires=${
    expires
  }${stringifyOptions(optionsWithDefaults)}`;
};

export const getCookie = (name, initialValue = '') => (
  (isBrowser
            && document.cookie.split('; ').reduce((r, v) => {
              const parts = v.split('=');
              return parts[0] === name ? decodeURIComponent(parts[1]) : r;
            }, ''))
        || initialValue
);

export default function useCookie(key, initialValue) {
  const [item, setItem] = useState(() => getCookie(key, initialValue));

  const updateItem = (value, options) => {
    setItem(value);
    setCookie(key, value, options);
  };

  return [item, updateItem];
}
