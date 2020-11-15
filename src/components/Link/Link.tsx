import * as React from 'react';
import styled from 'styled-components';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

const Container = styled.button<Props>`
  font-family: Montserrat, sans-serif;
  font-size: 16px;
  color: #696969;
  display: inline-flex;
  background-color: transparent;
  margin: 0;
  padding: 11px 16px;
  border: 0;
  outline: none;
  cursor: pointer;
  
  &[aria-selected=true] {
    color: #414040;
  }
  
  &:hover {
    background-color: rgba(255,99,71,0.1);
  }
  
  &:focus {
    background-color: rgba(255,99,71,0.2);
  }
`;

export const Link: React.FunctionComponent<Props> = props => {
  const { selected, children, ...rest} = props;
  return (
    <Container aria-selected={selected} {...rest}>
      {children}
    </Container>
  );
};
