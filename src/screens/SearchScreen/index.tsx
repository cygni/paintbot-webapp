import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components/macro';
import { useApiToSearchGamesPlayed } from '../../api/API';
import { CharacterColors } from '../../common/constants';
import Button from '../../components/Button';
import { Heading1 } from '../../components/Heading';
import Loading from '../../components/Loading';
import { Paper, PaperRow } from '../../components/Paper';

import GamesList from './GameList';

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 420px) {
    flex-direction: row;
  }
`;

const Input = styled.input`
  border: 1px solid rgb(148, 148, 148);
  border-radius: 8px;
  padding: 0.75rem;

  @media screen and (min-width: 420px) {
    border-radius: 8px 0 0 8px;
    flex: 1;
  }
`;

const SearchButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;

  @media screen and (min-width: 420px) {
    width: auto;
    margin-top: 0;
    border-radius: 0 8px 8px 0;
  }
`;

interface SearchFormProps {
  defaultValue: string;
  disabled: boolean;
  handleSubmit: (searchTerm: string) => any;
  errorMessage?: string;
}

function SearchForm({ defaultValue, disabled, handleSubmit, errorMessage }: SearchFormProps) {
  const submit = (e: any) => {
    e.preventDefault();
    handleSubmit(e.currentTarget.search.value);
  };

  return (
    <form onSubmit={submit}>
      <PaperRow>
        <SearchContainer>
          <Input id="search" type="text" defaultValue={defaultValue} placeholder="Search" aria-label="Search" />
          <SearchButton disabled={disabled}>Search</SearchButton>
        </SearchContainer>
      </PaperRow>
      {errorMessage && (
        <PaperRow>
          <Error>{errorMessage}</Error>
        </PaperRow>
      )}
    </form>
  );
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchScreen() {
  const query = useQuery().get('q') || '';
  const navigate = useNavigate();
  const setSearchTerm = (term: string) => {
    navigate({ pathname: '/search', search: new URLSearchParams(`?q=${term}`).toString() });
  };
  const [loading, setLoading] = useState(false);
  const searchGames = useApiToSearchGamesPlayed(query);
  const [gamesList, setGamesList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const doSearch = async () => {
      setLoading(true);
      let games = [];
      try {
        games = await searchGames().then((resp) => resp.items);
      } catch (e) {
        console.log(e);
        setErrorMessage('Failed to search');
      }

      setGamesList(games);
      setLoading(false);
    };

    if (query) {
      doSearch();
    }
  }, [query, searchGames]);

  const handleSearchSubmit = async (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };
  return (
    <Paper style={{ width: '100%' }}>
      <PaperRow>
        <Heading1>Old games</Heading1>
      </PaperRow>
      <SearchForm
        defaultValue={query}
        disabled={loading}
        handleSubmit={handleSearchSubmit}
        errorMessage={errorMessage}
      />
      {loading && <Loading />}
      {!loading && <GamesList games={gamesList} />}
    </Paper>
  );
}

const Error = styled.span`
  color: ${CharacterColors.Red};
`;
