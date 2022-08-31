import React, { memo } from 'react';
import { useParams } from 'react-router';
import GameDirector from './GameDirector';
import Text from '../../components/Text';

function GameScreen() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <Text>No ID :)</Text>;
  }
  const decodedId = decodeURIComponent(id);
  return <GameDirector id={decodedId} />;
}

export default memo(GameScreen);
