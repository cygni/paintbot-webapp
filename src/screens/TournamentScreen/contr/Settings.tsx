import React, { useContext } from 'react';
import styled from 'styled-components/macro';

import TournamentContext from '../../../common/contexts/TournamentContext';
import { Heading2 } from '../../../components/Heading';
import { Paper, PaperList, PaperListItem, PaperRow } from '../../../components/Paper';

export default function Settings() {
  const tour = useContext(TournamentContext);
  const gameSettings = tour.gameSettings;

  return (
    <Paper>
      <PaperRow>
        <Heading2>Settings</Heading2>
      </PaperRow>
      <PaperList>
        {Object.keys(gameSettings).map((k) => (
          <FlexedPaperListItem key={k}>
            {<SettingName>{k}</SettingName>}
            {<span>{`${typeof gameSettings[k] === 'boolean' ? (gameSettings[k] ? '✔' : '-') : gameSettings[k]}`}</span>}
          </FlexedPaperListItem>
        ))}
      </PaperList>
    </Paper>
  );
}

const SettingName = styled.span`
  margin-right: 1rem;
`;

const FlexedPaperListItem = styled(PaperListItem)`
  display: flex;
  justify-content: space-between;
`;
