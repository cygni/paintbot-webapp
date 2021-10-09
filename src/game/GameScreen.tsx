import React from 'react';
import { useParams } from 'react-router';

import TemplatePage from '../common/ui/TemplatePage';

import GameDirector from './GameDirector';

export default function GameScreen() {
  const { id } = useParams<{ id: string }>();
  const decodedId = decodeURIComponent(id);
  return (
    <TemplatePage>
      <GameDirector id={decodedId} />
    </TemplatePage>
  );
}
