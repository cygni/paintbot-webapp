import React, { memo, PropsWithChildren } from 'react';
import Link from '../Link';

function GameLink(props: PropsWithChildren<{ id: string }>) {
  return (
    <Link to={`/game/${encodeURIComponent(props.id)}`}>
      {props.children && props.children}
      {!props.children && props.id}
    </Link>
  );
}

export default memo(GameLink);
