import React from 'react';
import styled from 'styled-components/macro';
import tinycolor from 'tinycolor2';

import { Spacing } from '../../../components/Spacing';
import { Character } from '../type';

interface Props {
  player: Character;
}

interface ScoreLabelContainerProps {
  playerColour: string;
}

function isDarkColor(color: string) {
  const c = tinycolor(color);
  return c.isDark();
}

const ScoreLabelContainer = styled.div<ScoreLabelContainerProps>`
  opacity: 1;
  background-color: ${(props) => props.playerColour};
  color: ${(props) => (isDarkColor(props.playerColour) ? 'white' : 'black')};
  font-size: 2rem;
  transition: position 0.5s linear;
`;

export default class ScoreBoardEntry extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return nextProps.player.points !== this.props.player.points;
  }

  render() {
    const { player } = this.props;
    const playerName = player.name;
    const playerScore = `${player.points}`;
    return (
      <Spacing>
        <ScoreLabelContainer playerColour={player.colour} data-testid="score-board-entry">
          <Card>
            <Name>{playerName}</Name>
            <Score>{playerScore}</Score>
          </Card>
        </ScoreLabelContainer>
      </Spacing>
    );
  }
}

const Name = styled.div`
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 1rem;
  text-align: left;
`;

const Score = styled.div`
  text-align: right;
  opacity: 0.5;
  font-size: 1.5rem;
  line-height: 25px;
`;

const Card = styled.div`
  box-shadow: 0 0 2px rgb(0 0 0 / 10%), 0 0 4px rgb(0 0 0 / 10%), 0 0 6px rgb(0 0 0 / 10%);
  padding: 10px;
  font-family: 'Short Stack', sans-serif;
`;
