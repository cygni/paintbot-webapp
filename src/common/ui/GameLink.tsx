import React from 'react';
import { DefaultLink } from './DefaultLink';

interface GameLinkProps {
  id: string;
  children: React.ReactNode;
}

export const GameLink = ({ id, children }: GameLinkProps) => (
  <DefaultLink to={`/game/${encodeURIComponent(id)}`}>
    {children}
  </DefaultLink>
);
