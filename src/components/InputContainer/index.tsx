import styled from 'styled-components/macro';

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  & * {
    align-self: flex-start;
  }
`;

export default InputContainer;
