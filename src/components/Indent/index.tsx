import styled from 'styled-components/macro';

interface IndentProps {
  num?: number;
}

export const Indent = styled.div<IndentProps>(({ num = 1 }) => {
  const paddingSize = 10 * num;
  return {
    paddingLeft: paddingSize,
    paddingRight: paddingSize,
  };
});
