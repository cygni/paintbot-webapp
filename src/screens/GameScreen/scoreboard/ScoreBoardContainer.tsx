import React from 'react';
import FlipMove from 'react-flip-move';
import styled from 'styled-components/macro';
import Button from '../../../components/Button';
import { Character } from '../type';
// import ScoreBoardEntry from './ScoreBoardEntry';
// import { SortOrder, sortPlayers } from './Util';

interface Props {
  players: Character[];
  worldTick: number;
  gameDurationInTicks: number;
  ticksPerRender: number;
}

const Container = styled.div`
  padding-left: 20px;
  padding-right: 20px;
  width: 200px;
`;

export default class ScoreBoardContainer extends React.Component<Props> {
  // private getPlayers() {
  //   const sortedPlayers = sortPlayers(this.props.players, SortOrder.DESCENDING);
  //   return sortedPlayers.map((player) => {
  //     return <ScoreBoardEntry key={player.id} player={player} />;
  //   });
  // }
  shouldComponentUpdate(nextProps: Props) {
    const { worldTick, ticksPerRender, gameDurationInTicks } = nextProps;
    return worldTick % ticksPerRender === 0 || worldTick === gameDurationInTicks - 1; // Updates on every ticksPerRender tick and also the last tick
  }

  render() {
    return (
      <Container>
        <FlipMove>
          {[1].map((i) => (
            <Button key={i} />
          ))}
        </FlipMove>
      </Container>
    );
  }
}
