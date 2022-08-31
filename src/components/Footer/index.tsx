import React, { memo } from 'react';
import styled from 'styled-components/macro';
import cygniLogo from '/images/cygni-logo.svg';

const StyledFooter = styled.footer`
  display: flex;
  background-color: #000735;
  height: 60px;
`;

const StyledLink = styled.a`
  display: flex;
  align-items: center;
`;

const CygniLogo = styled.img`
  height: 60px;
  width: auto;
`;

function Footer() {
  return (
    <StyledFooter>
      <StyledLink href="https://cygni.se" aria-label="Cygni, Part of Accenture">
        <CygniLogo src={cygniLogo} alt={'Cygni'} />
      </StyledLink>
    </StyledFooter>
  );
}

export default memo(Footer);
