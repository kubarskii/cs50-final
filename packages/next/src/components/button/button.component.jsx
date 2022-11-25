import React from 'react';
import dynamic from 'next/dynamic';
import nonce from '../../utils/nonce';
import { combineClasses } from '../../utils/combineClasses';

export function SVGIcon(props) {
  const { type = null } = props;
  const DynamicSVG = type ? dynamic(
    () => import(`../icons/me-${type}.component`),
    {
      ssr: false,
    },
  ) : () => null;
  return <DynamicSVG />;
}

export default function MEButton(props) {
  const {
    type = null,
    disabled = false,
    onClick = nonce,
    title = '',
    shadow = false,
    svg = false,
  } = props;

  const className = combineClasses(
    'btn',
    svg ? 'svg' : null,
    shadow ? null : 'btn-no-shadow',
  );

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {title}
      <SVGIcon type={type} />
    </button>
  );
}
