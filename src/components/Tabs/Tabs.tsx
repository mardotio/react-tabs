import * as React from 'react';
import styled, { css, Keyframes, keyframes } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { mathClamp } from '../../utils/math';

type TabValue = string | number;

interface Props {
  value: TabValue;
  onChange: (value: TabValue) => void;
}

interface IndicatorStyles {
  left?: number;
  animation?: Keyframes;
  animationLength?: number;
}

interface IndicatorProps {
  animation?: Keyframes;
  left?: number;
  animationLength?: number;
}

const INDICATOR_HEIGHT = 4;
const INDICATOR_WIDTH = INDICATOR_HEIGHT * 4;
const ANIMATION_PIXEL_PER_SECOND = 1000;

const Container = styled.div`
  position: relative;
`;

const TabContainer = styled.div`
`;

const generateAnimation = (currentLeft: number | null, finalLeft: number) => {
  if (currentLeft === null) {
    return undefined;
  }
  if (finalLeft > currentLeft) {
    return keyframes`
    0% {
      left: ${currentLeft - INDICATOR_WIDTH / 2}px;
      width: ${INDICATOR_WIDTH}px;
    }
    
    50% {
      left: ${currentLeft - INDICATOR_WIDTH / 2}px;
      width: ${finalLeft - currentLeft + INDICATOR_WIDTH}px;
    }
    
    100% {
      left: ${finalLeft - INDICATOR_WIDTH / 2}px;
      width: ${INDICATOR_WIDTH}px;
    }
  `;
  }
  return keyframes`
    0% {
      left: ${currentLeft - INDICATOR_WIDTH / 2}px;
      width: ${INDICATOR_WIDTH}px;
    }
    
    50% {
      left: ${finalLeft - INDICATOR_WIDTH / 2}px;
      width: ${currentLeft - finalLeft + INDICATOR_WIDTH}px;
    }
    
    100% {
      left: ${finalLeft - INDICATOR_WIDTH / 2}px;
      width: ${INDICATOR_WIDTH}px;
    }
  `;
};

const TabIndicator = styled.span<IndicatorProps>`
  display: block;
  background-color: tomato;
  height: ${INDICATOR_HEIGHT}px;
  width: ${INDICATOR_WIDTH}px;
  border-radius: ${INDICATOR_HEIGHT / 2}px;
  position: relative;
  left: ${props => props.left ? props.left - INDICATOR_WIDTH / 2 : 0}px;
  transition: opacity 500ms ease;
  ${props => {
    if (props.animation && props.animationLength) {
      return css`
        animation: ${props.animation} ${mathClamp(200, 300, props.animationLength)}ms cubic-bezier(.8, .3 , .2, .7);
      `;
    } else if (!props.left) {
      return css`
        opacity: 0;
      `;
    }
  }};
`;

const getTabChildData = <T extends HTMLElement>(mounted: boolean, ref: T | null, selected: TabValue, valueMap: Map<TabValue, number>) => {
  const childIndex = valueMap.get(selected);
  if (!mounted || ref === null || childIndex === undefined) {
    return null;
  }
  const selectedChild = ref.children[childIndex];
  if (!selectedChild) {
    return null;
  }
  const tabDimensions = selectedChild.getBoundingClientRect();
  console.log(tabDimensions);
  return tabDimensions.left - ref.getBoundingClientRect().left + tabDimensions.width / 2;
};

export const Tabs: React.FunctionComponent<Props> = props => {
  const tabsContainerRef = useRef(null as null | HTMLDivElement);
  const [mounted, setMounted] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({} as IndicatorStyles);
  const tabValues: Map<TabValue, number> = new Map();

  useEffect(() => setMounted(true), []);

  let selectedIndex: number | null = null;
  const children = React.Children.map(props.children, (child, i) => {
    if (!React.isValidElement(child)) {
      return null;
    }
    const childValue = child.props.value === undefined || child.props.value === null ? i : child.props.value;
    const selected = childValue === props.value;
    tabValues.set(childValue, i);

    return React.cloneElement(
      child,
      {
        selected: selected || undefined,
        value: childValue,
        onClick: (e: MouseEvent) => {
          props.onChange(childValue);
          if (child.props.onClick) {
            child.props.onClick(e);
          }
        }
      }
    );
  });

  const tabsData = getTabChildData(mounted, tabsContainerRef.current, props.value, tabValues);
  const updateIndicatorState = () => {
    if (tabsData === null) {
      return;
    }
    setIndicatorStyle({
      animation: generateAnimation(indicatorStyle.left || null, tabsData),
      left: tabsData,
      animationLength: indicatorStyle.left ? Math.abs(indicatorStyle.left - tabsData) / ANIMATION_PIXEL_PER_SECOND * 1000 : undefined
    });
  }

  useEffect(() => updateIndicatorState(), [tabsData]);

  return (
    <Container>
      <TabContainer ref={tabsContainerRef}>{children}</TabContainer>
      <TabIndicator animation={indicatorStyle.animation} left={indicatorStyle.left} animationLength={indicatorStyle.animationLength}/>
    </Container>
  );
};
