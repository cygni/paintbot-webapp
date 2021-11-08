import React, { useContext, useState } from 'react';
import styled from 'styled-components/macro';
import { REQUEST_TYPES } from '../../common/API';
import AccountContext from '../../common/contexts/AccountContext';
import TournamentContext from '../../common/contexts/TournamentContext';
import WebSocketContext from '../../common/contexts/WebSocketContext';
import { Player, TournamentLevel } from '../../common/types';
import DefaultButton from '../../common/ui/DefaultButton';
import { GameLink } from '../../common/ui/GameLink';
import { Heading2, Heading3 } from '../../common/ui/Heading';
import { Paper, PaperHeadingRow, PaperRow } from '../../common/ui/Paper';
import PlayerLink from '../../common/ui/PlayerLink';
import { NextGame } from './TournamentController';

export interface PlayedGame {
  gameId: string;
  players: Player[];
}

interface GamePlanProps {
  nextGame: NextGame;
  playedGames: PlayedGame[];
}

export const GamePlan = ({ nextGame, playedGames }: GamePlanProps) => {
  const account = useContext(AccountContext);
  const tournament = useContext(TournamentContext);
  const { send } = useContext(WebSocketContext);

  const { tournamentLevels: levels, noofLevels: totalLevels } = tournament.gamePlan;
  const { lvl: nextLevelNo, game: nextGameNo, players } = nextGame;
  const [isPlaying, setIsPlaying] = useState(false);

  const isFinalGame = (level: number) => level === totalLevels;
  const formatGameTitle = (levelNo: number, gameNo: number) => isFinalGame(levelNo) ? 'Final' : `Game ${levelNo}-${gameNo}`;
  const isTournamentOver = !!tournament.winner;

  const startNextGame = () => {
    setIsPlaying(true);
    const currentLevel = levels[nextLevelNo];
    const currentGame = currentLevel.tournamentGames[nextGameNo];
    const startGameMessage = {
      token: account.token,
      gameId: currentGame.gameId,
      type: REQUEST_TYPES.START_TOURNAMENT_GAME,
    };
    send(startGameMessage);
  };

  return (
    <Paper>
      <PaperRow>
        <Heading2>Game plan</Heading2>
      </PaperRow>

      {!isTournamentOver &&
      <>
        <PaperHeadingRow>
          <Heading3>
            {formatGameTitle(nextLevelNo + 1, nextGameNo + 1)}
          </Heading3>
          {account.loggedIn && (
            <DefaultButton onClick={startNextGame} disabled={isPlaying}>
              {isPlaying ? 'Playing...' : 'Play'}
            </DefaultButton>
          )}
        </PaperHeadingRow>
        {players.map(player =>
          (
            <PaperRow key={player.name}>
              <PlayerLink name={player.name} />
            </PaperRow>
          ))}
      </>
      }
      {playedGames.map((playedGame, index) => {
        const flatGameIndex = playedGames.length - index;
        const { levelNo, gameNo } = getLevelAndGame(flatGameIndex, levels);
        return (
          <React.Fragment key={playedGame.gameId}>
            <PaperHeadingRow>
              <Heading3>
                {formatGameTitle(levelNo, gameNo)}
              </Heading3>
              <GameLink id={playedGame.gameId}>
                Watch
              </GameLink>
            </PaperHeadingRow>
            {playedGame.players.map(player => {
              return (
                <PaperRow key={player.name}>
                  <PlayerRow>
                    <PlayerLink name={player.name} />
                    <GamePlayerInfo>
                      <Score>{player.points}</Score>{' '}
                      <MovingUpIndicator>{player.isMovedUpInTournament ? '^' : ''}</MovingUpIndicator>
                    </GamePlayerInfo>
                  </PlayerRow>
                </PaperRow>
              );
            })}
          </React.Fragment>
        );
      })}
    </Paper>
  );
};

const PlayerRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const GamePlayerInfo = styled.div`
  display: flex;
  justify-content: space-around;
  width: 6em;
`;

const Score = styled.div`
  width: 3em;
  text-align: end;
`;

const MovingUpIndicator = styled.div`
  width: 0.5em;
`;

/**
 * Returns level and game number from a one-dimensional game number
 */
const getLevelAndGame = (flatGameIndex: number, levels: TournamentLevel[]) => {
  let levelIndex = 0;
  let gameIndex = flatGameIndex;
  // For every level, remove games until we hit the correct level
  while (gameIndex > levels[levelIndex].tournamentGames.length) {
    gameIndex = gameIndex - levels[levelIndex].tournamentGames.length;
    levelIndex = levelIndex + 1;
  }
  return { levelNo: levelIndex + 1, gameNo: gameIndex };
};
