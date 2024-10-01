import DIFF_MODES from '../enums/modes'

type modeOptions = {
  array?: DIFF_MODES;
  object?: DIFF_MODES;
  function?: DIFF_MODES;
};

type config = {
  mode ?: modeOptions; 
  compareArraysInOrder?: boolean;
  keepKeys?: string[];
};

export default config;
