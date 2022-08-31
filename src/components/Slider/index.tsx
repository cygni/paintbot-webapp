import React, { ChangeEvent } from 'react';
import styled from 'styled-components/macro';

import { StandardColors } from '../../common/constants';

export interface SliderProps {
  maxValue: number;
  minValue: number;
  reverse?: boolean;
  backgroundColor?: string;
  value: number;
  onChange(newValue: number): void;
}

interface InputProps {
  rotateDegrees: number;
  backgroundColor: string;
}

const SliderInput = styled.input<InputProps>`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 7px;
  background: ${(props) => props.backgroundColor};
  outline: none;
  opacity: 0.6;
  transform: rotate(${(props) => props.rotateDegrees}deg);
`;

export default class Slider extends React.Component<SliderProps> {
  private readonly handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.target.value, 10);
    if (!Number.isNaN(value)) {
      this.props.onChange(value);
    }
  };

  render() {
    const { minValue, maxValue, value, reverse, backgroundColor = StandardColors.White } = this.props;
    return (
      <SliderInput
        type="range"
        step="10"
        rotateDegrees={reverse ? 180 : 0}
        backgroundColor={backgroundColor}
        min={minValue}
        max={maxValue}
        value={value}
        onChange={this.handleChange}
      />
    );
  }
}
