import { memo } from 'react';
import styled from 'styled-components/macro';
import tinycolor from 'tinycolor2';

import { CharacterColors, StandardColors } from '../../common/constants';

interface ButtonProps {
  color?: string;
  width?: string | number;
  backgroundColor?: string;
  fontSize?: string | number;
  marginTop?: string | number;
  disabled?: boolean;
}

const Button = styled.button<ButtonProps>(
  ({
    backgroundColor = CharacterColors.Blue,
    color = StandardColors.White,
    fontSize = '1rem',
    width = 'fit-content',
    marginTop = 0,
    disabled,
  }) => {
    const bgColor = disabled ? CharacterColors.Grey : backgroundColor;
    return {
      backgroundColor: bgColor,
      border: 'none',
      boxShadow: '0 1px 4px 0 rgba(0,0,0,0.3)',
      color,
      textAlign: 'center',
      fontSize,
      fontWeight: 700,
      fontFamily: '"Short Stack", cursive',
      padding: '0.75rem 1.25em',
      width,
      cursor: 'pointer',
      marginTop,

      borderBottom: `3px solid ${tinycolor(bgColor).darken(12).toRgbString()}`,
      borderRadius: 40,

      ':hover:not(:disabled)': {
        backgroundColor: tinycolor(bgColor).darken(5).toRgbString(),
        borderColor: tinycolor(bgColor).darken(17).toRgbString(),
      },
    };
  },
);

export default memo(Button);
