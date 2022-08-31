import React, { useContext, useState } from 'react';
import styled from 'styled-components/macro';

import { REQUEST_TYPES } from '../../../api/API';
import AccountContext from '../../../common/contexts/AccountContext';
import TournamentContext from '../../../common/contexts/TournamentContext';
import WebSocketContext from '../../../common/contexts/WebSocketContext';
import Button from '../../../components/Button';
import { Heading2 } from '../../../components/Heading';
import { Checkbox, NumberInput, RangeInput } from '../../../components/Input';
import { Paper, PaperList, PaperListItem, PaperRow } from '../../../components/Paper';

const StickyPaperRow = styled(PaperRow)`
  position: sticky;
  bottom: 0;
  background-color: white;
  padding-bottom: 1rem;
`;

export default function TournamentPropertySetter() {
  const [dirty, setDirty] = useState(false);
  const tourContext = useContext(TournamentContext);
  const accContext = useContext(AccountContext);
  const [currentProperties, setCurrentProperties] = useState(tourContext);
  const gameSettings = currentProperties.gameSettings;
  const { send } = useContext(WebSocketContext);

  const handleSubmit = (event: any) => {
    if (event !== null) {
      event.preventDefault();
    } else {
      return;
    }
    if (dirty) {
      setDirty(false);
      const mess = {
        gameSettings,
        token: accContext.token,
        type: REQUEST_TYPES.UPDATE_TOURNAMENT,
      };
      send(mess);
    }
  };

  const handleSetCurrentProperties = (props: any) => {
    setCurrentProperties(props);
    setDirty(true);
  };

  return (
    <Paper>
      <PaperRow>
        <Heading2>Settings</Heading2>
      </PaperRow>
      <form onSubmit={handleSubmit}>
        <SettingsForm setter={handleSetCurrentProperties} curr={currentProperties} />
        <StickyPaperRow>
          <Button onClick={handleSubmit} disabled={!dirty} width="100%">
            Save changes
          </Button>
        </StickyPaperRow>
      </form>
    </Paper>
  );
}

function SettingsForm(props: any) {
  const currentProperties = props.curr;
  const setCurrentProperties = props.setter;
  const gameSettings = currentProperties.gameSettings;

  const updateProperty = (propKey: string, propValue: any) => {
    const copy = JSON.parse(JSON.stringify(currentProperties));
    if (propKey === 'tournamentId' || propKey === 'tournamentName') {
      copy[propKey] = propValue;
    } else {
      copy.gameSettings[propKey] = propValue;
    }
    setCurrentProperties(copy);
  };

  return (
    <PaperList>
      <PaperListItem>
        <Checkbox
          label="obstaclesEnabled"
          checked={gameSettings.obstaclesEnabled}
          onChange={() => updateProperty('obstaclesEnabled', !gameSettings.obstaclesEnabled)}
        />
      </PaperListItem>
      <PaperListItem>
        <Checkbox
          label="powerUpsEnabled"
          checked={gameSettings.powerUpsEnabled}
          onChange={() => updateProperty('powerUpsEnabled', !gameSettings.powerUpsEnabled)}
        />
      </PaperListItem>
      <PaperListItem>
        <Checkbox
          label="pointsPerTick"
          checked={gameSettings.pointsPerTick}
          onChange={() => updateProperty('pointsPerTick', !gameSettings.pointsPerTick)}
        />
      </PaperListItem>
      <PaperListItem>
        <Checkbox
          label="trainingGame"
          checked={gameSettings.trainingGame}
          onChange={() => updateProperty('trainingGame', !gameSettings.trainingGame)}
        />
      </PaperListItem>
      <PaperListItem>
        <RangeInput
          label="addPowerUpLikelihood"
          min={0}
          max={100}
          onChange={(e) => updateProperty('addPowerUpLikelihood', e.target.value)}
          value={gameSettings.addPowerUpLikelihood}
        />
      </PaperListItem>
      <PaperListItem>
        <RangeInput
          label="removePowerUpLikelihood"
          min={0}
          max={100}
          onChange={(e) => updateProperty('removePowerUpLikelihood', e.target.value)}
          value={gameSettings.removePowerUpLikelihood}
        />
      </PaperListItem>
      <PaperListItem>
        <RangeInput
          label="maxNoofPlayers"
          min={2}
          max={20}
          onChange={(e) => updateProperty('maxNoofPlayers', e.target.value)}
          value={gameSettings.maxNoofPlayers}
        />
      </PaperListItem>
      <PaperListItem>
        <NumberInput
          label="startObstacles"
          min={0}
          onChange={(e) => updateProperty('startObstacles', e.target.value)}
          value={gameSettings.startObstacles}
        />
      </PaperListItem>
      <PaperListItem>
        <NumberInput
          label="startPowerUps"
          min={0}
          onChange={(e) => updateProperty('startPowerUps', e.target.value)}
          value={gameSettings.startPowerUps}
        />
      </PaperListItem>
      <PaperListItem>
        <NumberInput
          label="explosionRange"
          min={0}
          onChange={(e) => updateProperty('explosionRange', e.target.value)}
          value={gameSettings.explosionRange}
        />
      </PaperListItem>
      <PaperListItem>
        <NumberInput
          label="gameDurationInSeconds"
          min={0}
          onChange={(e) => updateProperty('gameDurationInSeconds', e.target.value)}
          value={gameSettings.gameDurationInSeconds}
        />
      </PaperListItem>
      <PaperListItem>
        <NumberInput
          label="noOfTicksInvulnerableAfterStun"
          min={0}
          onChange={(e) => updateProperty('noOfTicksInvulnerableAfterStun', e.target.value)}
          value={gameSettings.noOfTicksInvulnerableAfterStun}
        />
      </PaperListItem>
      <PaperListItem>
        <NumberInput
          label="minNoOfTicksStunned"
          min={0}
          onChange={(e) => updateProperty('minNoOfTicksStunned', e.target.value)}
          value={gameSettings.minNoOfTicksStunned}
        />
      </PaperListItem>
      <PaperListItem>
        <NumberInput
          label="maxNoOfTicksStunned"
          min={0}
          onChange={(e) => updateProperty('maxNoOfTicksStunned', e.target.value)}
          value={gameSettings.maxNoOfTicksStunned}
        />
      </PaperListItem>
      <PaperListItem>
        <NumberInput
          label="pointsPerCausedStun"
          min={0}
          onChange={(e) => updateProperty('pointsPerCausedStun', e.target.value)}
          value={gameSettings.pointsPerCausedStun}
        />
      </PaperListItem>
      <PaperListItem>
        <NumberInput
          label="pointsPerTileOwned"
          min={0}
          onChange={(e) => updateProperty('pointsPerTileOwned', e.target.value)}
          value={gameSettings.pointsPerTileOwned}
        />
      </PaperListItem>
      <PaperListItem>
        <NumberInput
          label="timeInMsPerTick"
          min={0}
          onChange={(e) => updateProperty('timeInMsPerTick', e.target.value)}
          value={gameSettings.timeInMsPerTick}
        />
      </PaperListItem>
    </PaperList>
  );
}
