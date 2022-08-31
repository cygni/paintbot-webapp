import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';

import { REQUEST_TYPES } from '../../../api/API';
import AccountContext from '../../../common/contexts/AccountContext';
import TournamentContext from '../../../common/contexts/TournamentContext';
import WebSocketContext from '../../../common/contexts/WebSocketContext';
import { Player } from '../../../common/types';
import Button from '../../../components/Button';
import GameLink from '../../../components/GameLink';
import { Heading2, Heading3 } from '../../../components/Heading';
import { Paper, PaperHeadingRow, PaperRow } from '../../../components/Paper';
import PlayerLink from '../../../components/PlayerLink';

interface GamePlanProps {
  lvl: number;
  game: number;
  players: Player[];
  playedGames: PlayedGame[];
}

export interface PlayedGame {
  gameId: string;
  players: Player[];
}

export default function GamePlan({ lvl, game, players, playedGames }: GamePlanProps) {
  const tour = useContext(TournamentContext);
  const levels = tour.gamePlan.tournamentLevels;
  const started = levels.length > 0 && levels[0].tournamentGames[0].gameId !== null;
  const { send } = useContext(WebSocketContext);
  const acc = useContext(AccountContext);
  const noLevels = tour.gamePlan.noofLevels;
  const [showNextGame, setShowNextGame] = useState(lvl === 0 && game === 0 && !tour.winner);
  const [playing, setPlaying] = useState(false);

  const startNextGame = (event: any) => {
    event.preventDefault();
    setPlaying(true);
    const l = lvl;
    const g = game;
    const currLvl = tour.gamePlan.tournamentLevels[l];
    const currGame = currLvl.tournamentGames[g];
    const gameMess = {
      token: acc.token,
      gameId: currGame.gameId,
      type: REQUEST_TYPES.START_TOURNAMENT_GAME,
    };
    send(gameMess);
  };

  useEffect(() => {
    setShowNextGame(lvl === 0 && game === 0);
    setPlaying(false);
  }, [lvl, game]);

  function handleShowNextGame() {
    setShowNextGame(true);
  }

  return (
    <Paper>
      <PaperRow>
        <Heading2>Game plan</Heading2>
      </PaperRow>
      {!started && <span>Tournament has not been started yet!</span>}
      {started && showNextGame && (
        <>
          <PaperHeadingRow>
            <Heading3>{lvl + 1 === noLevels ? 'Final' : `Game ${lvl + 1}-${game + 1}`}</Heading3>
            {acc.loggedIn && (
              <Button onClick={startNextGame} disabled={playing}>
                {playing ? 'Playing...' : 'Play'}
              </Button>
            )}
          </PaperHeadingRow>
          {players.map((player) => {
            return (
              <PaperRow key={player.name}>
                <PlayerLink name={player.name} />
              </PaperRow>
            );
          })}
        </>
      )}
      {started &&
        playedGames.map((playedGame, index) => {
          let currLvl = 0;
          let currGame = playedGames.length - index;
          while (currGame > levels[currLvl].tournamentGames.length) {
            currGame = currGame - levels[currLvl].tournamentGames.length;
            currLvl = currLvl + 1;
          }
          currLvl = currLvl + 1;
          const shouldShowGamePlayerInfo = index !== 0 || showNextGame;
          return (
            <React.Fragment key={playedGame.gameId}>
              <PaperHeadingRow>
                <Heading3>
                  <GameLink id={playedGame.gameId}>
                    {currLvl === noLevels ? 'Final' : `Game ${currLvl}-${currGame}`}
                  </GameLink>
                </Heading3>
                {index === 0 && currLvl !== noLevels && !showNextGame && (
                  <Button onClick={handleShowNextGame}>Next game</Button>
                )}
              </PaperHeadingRow>
              {playedGame.players.map((player) => {
                return (
                  <PaperRow key={player.name}>
                    <PlayerRow>
                      <PlayerLink name={player.name} />
                      {shouldShowGamePlayerInfo && (
                        <GamePlayerInfo>
                          <Score>{player.points}</Score>{' '}
                          <MovingUpIndicator>{player.isMovedUpInTournament ? '^' : ''}</MovingUpIndicator>
                        </GamePlayerInfo>
                      )}
                    </PlayerRow>
                  </PaperRow>
                );
              })}
            </React.Fragment>
          );
        })}
    </Paper>
  );
}

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
