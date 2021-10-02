import React from 'react';
import styled from 'styled-components/macro';

import { ReactComponent as Logo } from '../../resources/images/cygni-logo.svg';

const StyledFooter = styled.footer`
  background-color: #000735;
  width: 100%;
  padding: 1.5rem 1rem 1rem;
`;

const CygniLogo = styled(Logo)`
  height: 40px;
  width: 110px;
`;

export default function Footer() {
  return (
    <StyledFooter>
      <a href="https://cygni.se" aria-label="Cygni">
        <CygniLogo />
      </a>
    </StyledFooter>
  );
}
