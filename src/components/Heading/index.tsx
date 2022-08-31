import styled, { css } from 'styled-components/macro';

const HeadingCss = css`
  font-family: 'Short Stack', sans-serif;
  margin: 0px;
`;

export const Heading1 = styled.h1`
  ${HeadingCss};
  font-size: 2rem;
`;

export const Heading2 = styled.h2`
  ${HeadingCss};
  font-size: 1.5rem;
`;

export const Heading3 = styled.h3`
  ${HeadingCss};
  font-size: 1.25rem;
`;
