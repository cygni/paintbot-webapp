import styled from 'styled-components/macro';

interface PaperProps {
  width?: string;
}

export const Paper = styled.div<PaperProps>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: white;
  box-shadow: 0 0 2px rgb(0 0 0 / 10%), 0 0 4px rgb(0 0 0 / 10%), 0 0 6px rgb(0 0 0 / 10%);
  padding: 1em 0;
  margin-bottom: 1rem;
  width: ${props => props.width};
`;

export const PaperTopic = styled.h2`
  margin: 0;
  text-transform: uppercase;
  font-size: 0.875rem;
  color: #8496ad;
  text-align: center;
`;

interface PaperRowProps {
  textAlign?: string;
}

export const PaperRow = styled.div<PaperRowProps>`
  box-sizing: border-box;
  border-bottom: 1px solid aliceblue;
  padding: 0.5rem 1.5rem;
  width: 100%;
  min-height: 38px;
  text-align: ${props => props.textAlign};
`;

export const PaperHeadingRow = styled(PaperRow)`
  margin-top: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PaperList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  flex-direction: column;
`;

export const PaperListItem = styled.li`
  list-style-type: none;
  width: 100%;
  border-bottom: 1px solid aliceblue;
  padding: 0.5em 1.5em;
  box-sizing: border-box;
`;
