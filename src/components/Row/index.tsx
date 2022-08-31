import React from 'react';
import styled from 'styled-components/macro';

type RowProps = Pick<React.CSSProperties, 'justifyContent' | 'alignItems' | 'alignSelf' | 'width' | 'height'>;

export const Row = styled.div<RowProps>(({ justifyContent, alignItems, alignSelf, width, height }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent,
  alignItems,
  alignSelf,
  width,
  height,
}));
