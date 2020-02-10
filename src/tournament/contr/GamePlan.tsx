import React, { useContext, useEffect, useState } from 'react';

import { REQUEST_TYPES } from '../../common/API';
import AccountContext from '../../common/contexts/AccountContext';
import TournamentContext from '../../common/contexts/TournamentContext';
import WebSocketContext from '../../common/contexts/WebSocketContext';
import { Player } from '../../common/types';
import ControlsButton from '../../common/ui/ControlsButton';
import GameLink from '../../common/ui/GameLink';
import { Heading3 } from '../../common/ui/Heading';
import { Paper, PaperHeadingRow, PaperRow, PaperTopic } from '../../common/ui/Paper';
import PlayerLink from '../../common/ui/PlayerLink';

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
  const send = useContext(WebSocketContext);
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

  useEffect(
    () => {
      setShowNextGame(lvl === 0 && game === 0);
      setPlaying(false);
    },
    [lvl, game],
  );

  function handleShowNextGame() {
    setShowNextGame(true);
  }

  return (
    <Paper>
      <PaperTopic>Game plan</PaperTopic>
      {!started && <span>Tournament has not been started yet!</span>}
      {started && showNextGame && (
        <>
          <PaperHeadingRow>
            <span>{lvl + 1 === noLevels ? 'Final' : `Game ${lvl + 1}-${game + 1}`}</span>
            {acc.loggedIn && (
              <ControlsButton onClick={startNextGame} disabled={playing}>
                {playing ? 'Playing...' : 'Start'}
              </ControlsButton>
            )}
          </PaperHeadingRow>
          {players.map(player => {
            return (
              <PaperRow key={player.name}>
                <PlayerLink name={player.name} />
              </PaperRow>
            );
          })}
          <PaperRow />
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
          return (
            <React.Fragment key={playedGame.gameId}>
              <PaperHeadingRow>
                <Heading3>
                  <GameLink id={playedGame.gameId}>
                    {currLvl === noLevels ? 'Final' : `Game ${currLvl}-${currGame}`}
                  </GameLink>
                </Heading3>
                {index === 0 && currLvl !== noLevels && !showNextGame && (
                  <ControlsButton onClick={handleShowNextGame}>Next game</ControlsButton>
                )}
              </PaperHeadingRow>
              {playedGame.players.map(player => {
                return (
                  <PaperRow key={player.name}>
                    <PlayerLink name={player.name} />
                  </PaperRow>
                );
              })}
              <PaperRow />
            </React.Fragment>
          );
        })}
    </Paper>
  );
}
