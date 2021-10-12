import React from 'react';
import styled from 'styled-components/macro';

import { ReactComponent as Logo } from '../../resources/images/cygni-logo.svg';

const StyledFooter = styled.footer`
  background-color: #000735;
  width: 100%;
  padding: 1rem 0.5rem 0.5rem;
`;

const StyledLink = styled.a`
  display: inline-block;
`;

const CygniLogo = styled(Logo)`
  height: 80px;
  max-width: 100%;
`;

export default function Footer() {
  return (
    <StyledFooter>
      <StyledLink href="https://cygni.se" aria-label="Cygni, Part of Accenture">
        <CygniLogo />
      </StyledLink>
    </StyledFooter>
  );
}
