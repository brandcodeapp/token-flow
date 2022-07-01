import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@stitches/react';
import { violet, mauve, blackA, whiteA } from '@radix-ui/colors';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { RootState } from "../store";
import { updateTokenTypeStatus } from '../store/tokeTypeStatus';

const StyledSwitch = styled(SwitchPrimitive.Root, {
  all: 'unset',
  width: 42,
  height: 25,
  backgroundColor: blackA.blackA9,
  borderRadius: '9999px',
  position: 'relative',
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  '&:focus': { boxShadow: `0 0 0 2px black` },
  '&[data-state="checked"]': { backgroundColor: 'black' },
});

const StyledThumb = styled(SwitchPrimitive.Thumb, {
  display: 'block',
  width: 21,
  height: 21,
  backgroundColor: 'white',
  borderRadius: '9999px',
  boxShadow: `0 2px 2px ${blackA.blackA7}`,
  transition: 'transform 100ms',
  transform: 'translateX(2px)',
  willChange: 'transform',
  '&[data-state="unchecked"]': { transform: 'translateX(19px)' },
});

// Exports
export const Switch = StyledSwitch;
export const SwitchThumb = StyledThumb;

// Your app...
const Flex = styled('div', { 
  display: 'flex',
  justifyContent: 'space-between'
});
const Label = styled('label', {
  color: 'black',
  fontSize: 15,
  lineHeight: 1,
  userSelect: 'none',
});

type Props = {
  tokenType?: string;
}

const TreeItem: React.FC<Props> = ({
  tokenType
}) => {
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = React.useState(false);
  const tokenTypeChecked = useSelector((state: RootState) => (state.tokenType));
  const handleSwithcClicked = React.useCallback(() => {
    dispatch(updateTokenTypeStatus({name: tokenType}));
    setIsChecked(!isChecked);
  }, [isChecked]);

  useEffect(() => {
    Object.entries(tokenTypeChecked).forEach(t => {
      if(t[0] === tokenType){
        setIsChecked(t[1]);
    }
  })
  }, [isChecked]);
  return (
    <form>
      <Flex>
        <Label htmlFor="s1" css={{ paddingRight: 15 }}>
          {tokenType}
        </Label>
        <Switch checked={isChecked} id="s1" onCheckedChange={handleSwithcClicked} >
          <SwitchThumb />
        </Switch>
      </Flex>
    </form>
  );
}
export default TreeItem;