import styled from 'styled-components/macro';

interface SpacingProps {
  num?: number;
  children?: React.ReactNode;
}

export const Spacing = styled.div<SpacingProps>(({ num = 1 }) => {
  const paddingSize = 10 * num;
  return {
    paddingTop: paddingSize,
    paddingBottom: paddingSize,
  };
});
