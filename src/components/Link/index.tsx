import { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components/macro';

import { CharacterColors } from '../../common/constants';

interface LinkProps {
  color?: string;
}

const Link = styled(RouterLink)<LinkProps>(({ color = CharacterColors.Blue }) => ({
  color,
  textDecoration: 'inherit',
  ':hover': {
    textDecoration: 'underline',
  },
  ':active': {
    textDecoration: 'underline',
  },
  ':focus': {
    textDecoration: 'underline',
    outline: 'none',
  },
}));

export default memo(Link);
