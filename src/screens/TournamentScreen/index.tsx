import React, { useContext } from 'react';

import TournamentContext from '../../common/contexts/TournamentContext';

import TournamentController from './contr/TournamentController';
import TournamentCreator from './TournamentCreator';

export default function TournamentScreen() {
  // const accContext = useContext(AccountContext);
  const tourContext = useContext(TournamentContext);

  // if (!accContext.loggedIn) {
  //   return (
  //     <Paper>
  //       <PaperRow>Log in to create a tournament!</PaperRow>
  //     </Paper>
  //   );
  // }

  if (tourContext.tournamentId === '') {
    return <TournamentCreator />;
  }

  return <TournamentController />;
}
