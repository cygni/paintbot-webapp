import React from 'react';

import { RESPONSE_TYPES } from '../API';
import { Game, Tournament, TournamentLevel } from '../types';

export const defaultTournament: Tournament = {
  gamePlan: {
    noofLevels: 0,
    players: [],
    tournamentId: '',
    tournamentLevels: [],
    tournamentName: '',
  },
  gameSettings: {
    obstaclesEnabled: true,
    powerUpsEnabled: true,
    pointsPerTick: false,
    trainingGame: true,
    addPowerUpLikelihood: 15,
    removePowerUpLikelihood: 5,
    maxNoofPlayers: 10,
    startObstacles: 30,
    startPowerUps: 0,
    explosionRange: 4,
    gameDurationInSeconds: 180,
    noOfTicksInvulnerableAfterStun: 3,
    minNoOfTicksStunned: 8,
    maxNoOfTicksStunned: 10,
    pointsPerCausedStun: 5,
    pointsPerTileOwned: 1,
    timeInMsPerTick: 250,
  },
  tournamentId: '',
  tournamentName: '',
  winner: undefined,
};

export const validateTour = (tournamentInfo: any, currentContext: any, messType: string) => {
  const newTourContext = JSON.parse(JSON.stringify(currentContext));

  const compareObjects = (newObj: any, oldObj: any) => {
    if (newObj === undefined) {
      return oldObj;
    }
    const revisedNewObj = JSON.parse(JSON.stringify(oldObj));
    for (const k of Object.keys(newObj)) {
      if (k === 'type') {
        continue;
      }
      const oldVal = oldObj[k];
      const newVal = newObj[k];
      if (oldVal === undefined || typeof oldVal !== typeof newVal) {
        console.log(`WEIRDNESS IN THE NEW OBJECT`);
        console.log(`oldVal: ${oldVal}, newVal: ${newVal}`);
      } else if (oldVal instanceof Array) {
        revisedNewObj[k] = newVal;
      } else if (typeof oldVal === 'object') {
        revisedNewObj[k] = compareObjects(newVal, oldVal);
      } else {
        revisedNewObj[k] = newVal;
      }
    }
    return revisedNewObj;
  };

  const validateObjects = () => {
    newTourContext.gameSettings = compareObjects(tournamentInfo.gameSettings, currentContext.gameSettings);
    newTourContext.gamePlan = compareObjects(tournamentInfo.gamePlan, currentContext.gamePlan);
  };

  const validateNewTournament = () => {
    validateObjects();
    newTourContext.tournamentId = tournamentInfo.tournamentId;
    newTourContext.tournamentName = tournamentInfo.tournamentName;
    newTourContext.winner = tournamentInfo.winner;
  };

  switch (messType) {
    case RESPONSE_TYPES.TOURNAMENT_GAME_PLAN:
      validateObjects();
      break;
    case RESPONSE_TYPES.TOURNAMENT_CREATED:
    case RESPONSE_TYPES.TOURNAMENT_INFO:
      validateNewTournament();
      break;
    case RESPONSE_TYPES.TOURNAMENT_KILLED:
      return defaultTournament;
    default:
      break;
  }

  return newTourContext;
};

export function setGamePlayed(gameId: string, tour: Tournament, isPlayed: boolean) {
  const newTour: Tournament = JSON.parse(JSON.stringify(tour));
  newTour.gamePlan.tournamentLevels.forEach((lvl: TournamentLevel, lvlIndex: number) => {
    lvl.tournamentGames.forEach((g: Game, gameIndex: number) => {
      if (g.gameId === gameId) {
        newTour.gamePlan.tournamentLevels[lvlIndex].tournamentGames[gameIndex].gamePlayed = isPlayed;
      }
    });
  });
  return newTour;
}

const TournamentContext = React.createContext(defaultTournament);
export default TournamentContext;
