import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';

import AccountContext from '../../../common/contexts/AccountContext';
import TournamentContext from '../../../common/contexts/TournamentContext';
import { Player } from '../../../common/types';
import { Heading1 } from '../../../components/Heading';
import { Paper, PaperRow } from '../../../components/Paper';

import Controls from './Controls';
import GamePlan, { PlayedGame } from './GamePlan';
import Players from './Players';
import TournamentPropertySetter from './TournamentPropertySetter';
import Settings from './Settings';
import GameDirector from '../../GameScreen/GameDirector';

interface NextGame {
  lvl: number;
  game: number;
  players: Player[];
}

const PaperGrid = styled.div`
  width: 60rem;
  max-width: calc(100vw - 2rem);
  display: grid;
  gap: 1rem;
  margin: auto;
  margin-top: 1rem;

  @media screen and (min-width: 600px) {
    grid-template-columns: 1fr auto;
  }
`;

export default function TournamentController() {
  const tour = useContext(TournamentContext);
  const acc = useContext(AccountContext);
  const levels = tour.gamePlan.tournamentLevels;
  const started = levels.length > 0 && levels[0].tournamentGames[0].gameId !== null;
  const [nextGame, setNextGame] = useState<NextGame>({ lvl: 0, game: 0, players: [] });
  const showSetters = acc.loggedIn && !started;
  const [playedGames, setPlayedGames] = useState(new Array<PlayedGame>());

  useEffect(() => {
    const result = new Array<PlayedGame>();
    let game = 0;
    let level = 0;
    for (const lvl of tour.gamePlan.tournamentLevels) {
      for (const g of lvl.tournamentGames) {
        if (g.gamePlayed) {
          result.unshift({ gameId: g.gameId, players: g.players });
          game = game + 1;
          if (game === tour.gamePlan.tournamentLevels[level].tournamentGames.length) {
            game = 0;
            level = level + 1;
          }
        }
      }
    }
    let players = Array<Player>();
    if (tour.gamePlan.tournamentLevels[level] && tour.gamePlan.tournamentLevels[level].tournamentGames[game]) {
      players = tour.gamePlan.tournamentLevels[level].tournamentGames[game].players;
    }
    setPlayedGames(result);
    setNextGame({ lvl: level, game, players });
  }, [tour]);

  return (
    <div>
      <GameDirector tournamentIds={levels.flatMap((l) => l.tournamentGames.map((g) => g.gameId))} />
      <PaperGrid>
        <div>
          <Paper>
            <PaperRow>
              <Heading1>{tour.tournamentName}</Heading1>
              <p>It's on! Start the tournament once all players have joined.</p>
              {acc.loggedIn && <Controls started={started} />}
            </PaperRow>
            <Players />
          </Paper>
          {started && (
            <GamePlan lvl={nextGame.lvl} game={nextGame.game} players={nextGame.players} playedGames={playedGames} />
          )}
        </div>
        <div>
          {showSetters && <TournamentPropertySetter />}
          {!showSetters && <Settings />}
        </div>
      </PaperGrid>
    </div>
  );
}
