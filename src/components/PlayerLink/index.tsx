import React from 'react';
import { CharacterColors } from '../../common/constants';
import Link from '../Link';

export default function PlayerLink(props: any) {
  return (
    <Link className={props.className} to={`/search?q=${encodeURIComponent(props.name)}`} color={CharacterColors.Navy}>
      {props.name}
    </Link>
  );
}
