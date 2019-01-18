/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import { Button, Icon, Select } from 'antd';
import PropTypes from 'prop-types';
import { math } from '@edulastic/constants';
import styled from 'styled-components';
import { isObject } from 'lodash';

import Delete from '../../assets/images/numpads/delete.svg';
import Sqrt from '../../assets/images/numpads/sqrt.svg';
import Group940 from '../../assets/images/numpads/940.svg';
import Group941 from '../../assets/images/numpads/941.svg';
import Group942 from '../../assets/images/numpads/942.svg';
import Group943 from '../../assets/images/numpads/943.svg';
import Group944 from '../../assets/images/numpads/944.svg';
import Group993 from '../../assets/images/numpads/993.svg';
import Group940v2 from '../../assets/images/numpads/940-2.svg';
import Group944v2 from '../../assets/images/numpads/944-2.svg';
import Group999 from '../../assets/images/numpads/999.svg';
import Group1052 from '../../assets/images/numpads/1052.svg';
import Group2251 from '../../assets/images/numpads/2251.svg';
import Group2249 from '../../assets/images/numpads/2249.svg';
import Group2247 from '../../assets/images/numpads/2247.svg';
import Group2245 from '../../assets/images/numpads/2245.svg';
import Group2243 from '../../assets/images/numpads/2243.svg';
import Group2241 from '../../assets/images/numpads/2241.svg';
import Group2206 from '../../assets/images/numpads/2206.svg';
import Group1006 from '../../assets/images/numpads/1006.svg';
import Group1007 from '../../assets/images/numpads/1007.svg';
import Group2207 from '../../assets/images/numpads/2207.svg';
import Group1004 from '../../assets/images/numpads/1004.svg';
import Group2208 from '../../assets/images/numpads/2208.svg';
import Group1005 from '../../assets/images/numpads/1005.svg';
import Group1001 from '../../assets/images/numpads/1001.svg';
import Group1002 from '../../assets/images/numpads/1002.svg';
import Group2256 from '../../assets/images/numpads/2256.svg';
import Group2253 from '../../assets/images/numpads/2253.svg';
import Group2263 from '../../assets/images/numpads/2263.svg';
import Group2261 from '../../assets/images/numpads/2261.svg';
import Group2255 from '../../assets/images/numpads/2255.svg';
import Group2266 from '../../assets/images/numpads/2266.svg';
import Group2262 from '../../assets/images/numpads/2262.svg';
import Group1024 from '../../assets/images/numpads/1024.svg';
import Group1023 from '../../assets/images/numpads/1023.svg';
import Group1025 from '../../assets/images/numpads/1025.svg';
import Group1045 from '../../assets/images/numpads/1045.svg';
import Group1010 from '../../assets/images/numpads/1010.svg';
import Group1011 from '../../assets/images/numpads/1011.svg';
import Group1012 from '../../assets/images/numpads/1012.svg';
import Group1013 from '../../assets/images/numpads/1013.svg';
import Group1022 from '../../assets/images/numpads/1022.svg';
import Group1014 from '../../assets/images/numpads/1014.svg';
import Group1054 from '../../assets/images/numpads/1054.svg';
import Group1029 from '../../assets/images/numpads/1029.svg';
import Group1030 from '../../assets/images/numpads/1030.svg';
import Group1058 from '../../assets/images/numpads/1058.svg';
import Group1030v2 from '../../assets/images/numpads/1030v2.svg';
import Group2357 from '../../assets/images/numpads/2357.svg';
import Group1043 from '../../assets/images/numpads/1043.svg';

import MathKeyboardStyles from './MathKeyboardStyles';
import { Keyboard } from '../../../common';
import { numberPadItems } from '../../../common/Options/components/KeyPadOptions';

const { EMBED_RESPONSE } = math;

const CustomImage = styled.img`
  width: 25px;
  height: 25px;
  object-fit: contain;
`;

export const keyboardButtons = [
  { handler: 'x', label: 'x', types: ['all', 'basic', 'algebra', 'general'], command: 'cmd' },
  { handler: 'y', label: 'y', types: ['all', 'basic', 'algebra', 'general'], command: 'cmd' },
  { handler: 'leftright2', label: 'x²', types: ['all', 'basic', 'algebra', 'general'], command: 'cmd' },
  {
    handler: '\\sqrt',
    label: <CustomImage src={Sqrt} role="presentation" />,
    types: ['all', 'basic', 'algebra', 'general'],
    command: 'cmd'
  },
  {
    handler: '\\sqrt[n]{}',
    label: <CustomImage src={Group999} role="presentation" />,
    types: ['all', 'algebra', 'general'],
    command: 'write'
  },
  {
    handler: '/',
    label: <CustomImage src={Group940} role="presentation" />,
    types: ['all', 'basic', 'algebra'],
    command: 'cmd'
  },
  {
    handler: '/',
    label: <CustomImage src={Group940v2} role="presentation" />,
    types: ['all', 'basic_junior', 'general'],
    command: 'cmd'
  },
  {
    handler: '\\frac{}{}',
    label: <CustomImage src={Group941} role="presentation" />,
    types: ['all', 'basic', 'basic_junior', 'algebra', 'general'],
    command: 'write'
  },
  {
    handler: '^',
    label: <CustomImage src={Group942} role="presentation" />,
    types: ['all', 'basic', 'algebra', 'general'],
    command: 'cmd'
  },
  {
    handler: '≠',
    label: '≠',
    types: ['all', 'comparison'],
    command: 'cmd'
  },
  {
    handler: '≈',
    label: '≈',
    types: ['all', 'comparison'],
    command: 'cmd'
  },
  {
    handler: '<',
    label: '<',
    types: ['all', 'basic', 'basic_junior', 'algebra', 'comparison'],
    command: 'cmd'
  },
  {
    handler: '_',
    label: <CustomImage src={Group943} role="presentation" />,
    types: ['all', 'basic', 'general'],
    command: 'cmd'
  },
  {
    handler: '>',
    label: '>',
    types: ['all', 'basic', 'basic_junior', 'algebra', 'comparison'],
    command: 'cmd'
  },
  {
    handler: '≤',
    label: '≤',
    types: ['all', 'comparison'],
    command: 'cmd'
  },
  {
    handler: '≥',
    label: '≥',
    types: ['all', 'comparison'],
    command: 'cmd'
  },
  {
    handler: '≯',
    label: '≯',
    types: ['all', 'comparison'],
    command: 'cmd'
  },
  {
    handler: '≮',
    label: '≮',
    types: ['all', 'comparison'],
    command: 'cmd'
  },
  {
    handler: '\\pm',
    label: '±',
    types: ['all', 'basic', 'algebra', 'general'],
    command: 'cmd'
  },
  {
    handler: '$',
    label: '$',
    types: ['all', 'basic'],
    command: 'cmd'
  },
  {
    handler: '%',
    label: '%',
    types: ['all', 'basic', 'general'],
    command: 'cmd'
  },
  {
    handler: '°',
    label: 'º',
    types: ['all', 'basic'],
    command: 'cmd'
  },
  {
    handler: ':',
    label: ':',
    types: ['all', 'basic', 'general', 'sets'],
    command: 'cmd'
  },
  {
    handler: '(',
    label: <CustomImage src={Group944} role="presentation" />,
    types: ['all', 'basic', 'algebra'],
    command: 'cmd'
  },
  {
    handler: '[',
    label: <CustomImage src={Group944v2} role="presentation" />,
    types: ['all', 'algebra'],
    command: 'cmd'
  },
  {
    handler: '|',
    label: <CustomImage src={Group993} role="presentation" />,
    types: ['all', 'basic', 'algebra', 'general'],
    command: 'cmd'
  },
  {
    handler: 'π',
    label: 'π',
    types: ['all', 'basic', 'algebra'],
    command: 'cmd'
  },
  {
    handler: 'Backspace',
    label: <CustomImage src={Delete} role="presentation" />,
    types: ['all', 'basic'],
    command: 'cmd'
  },
  {
    handler: '\\infinity',
    label: '∞',
    types: ['all', 'basic', 'algebra', 'general'],
    command: 'cmd'
  },
  // Geometry
  {
    handler: '⊥',
    label: '⊥',
    types: ['all', 'geometry'],
    command: 'cmd'
  },
  {
    handler: '∥',
    label: '∥',
    types: ['all', 'geometry'],
    command: 'cmd'
  },
  {
    handler: '∦',
    label: '∦',
    types: ['all', 'geometry'],
    command: 'cmd'
  },
  {
    handler: '\\underset{\\sim}{\\mathbf{}}',
    label: <CustomImage src={Group1052} role="presentation" />,
    types: ['all', 'geometry'],
    command: 'write'
  },
  // Matrices
  {
    handler: '\\ldots',
    label: <CustomImage src={Group2206} role="presentation" />,
    types: ['all', 'matrices'],
    command: 'cmd'
  },
  {
    handler: '[',
    label: <CustomImage src={Group944v2} role="presentation" />,
    types: ['all', 'matrices'],
    command: 'cmd'
  },
  {
    handler: '\\ddots',
    label: <CustomImage src={Group2207} role="presentation" />,
    types: ['all', 'matrices'],
    command: 'cmd'
  },
  {
    handler: '\\begin{bmatrix}&\\\\&\\end{bmatrix}',
    label: <CustomImage src={Group1004} role="presentation" />,
    types: ['all', 'matrices'],
    command: 'write'
  },
  {
    handler: '\\vdots',
    label: <CustomImage src={Group2208} role="presentation" />,
    types: ['all', 'matrices'],
    command: 'cmd'
  },
  {
    handler: '\\begin{bmatrix}{}&{}&{}\\\\{}&{}&{}\\\\{}&{}&{}\\end{bmatrix}',
    label: <CustomImage src={Group1005} role="presentation" />,
    types: ['all', 'matrices'],
    command: 'write'
  },
  {
    handler: '^',
    label: <CustomImage src={Group1001} role="presentation" />,
    types: ['all', 'matrices'],
    command: 'cmd'
  },
  {
    handler: '_',
    label: <CustomImage src={Group1002} role="presentation" />,
    types: ['all', 'matrices'],
    command: 'cmd'
  },
  {
    handler: 'Shift-Spacebar',
    label: <CustomImage src={Group1006} role="presentation" />,
    types: ['all', 'matrices'],
    command: 'keystroke'
  },
  {
    handler: 'Shift-Enter',
    label: <CustomImage src={Group1007} role="presentation" />,
    types: ['all', 'matrices'],
    command: 'keystroke'
  },
  // Trigonometry
  {
    handler: '\\sin',
    label: 'sin',
    types: ['all', 'trigonometry'],
    command: 'cmd'
  },
  {
    handler: '\\sec',
    label: 'sec',
    types: ['all', 'trigonometry'],
    command: 'cmd'
  },
  {
    handler: '\\sin^{-1}',
    label: <CustomImage src={Group2251} role="presentation" />,
    types: ['all', 'trigonometry'],
    command: 'cmd'
  },
  {
    handler: '\\sec^{-1}',
    label: <CustomImage src={Group2249} role="presentation" />,
    types: ['all', 'trigonometry'],
    command: 'cmd'
  },
  {
    handler: '\\cos',
    label: 'cos',
    types: ['all', 'trigonometry'],
    command: 'cmd'
  },
  {
    handler: '\\csc',
    label: 'csc',
    types: ['all', 'trigonometry'],
    command: 'cmd'
  },
  {
    handler: '\\cos^{-1}',
    label: <CustomImage src={Group2247} role="presentation" />,
    types: ['all', 'trigonometry'],
    command: 'write'
  },
  {
    handler: '\\csc^{-1}',
    label: <CustomImage src={Group2245} role="presentation" />,
    types: ['all', 'trigonometry'],
    command: 'write'
  },
  {
    handler: '\\tan',
    label: 'tan',
    types: ['all', 'trigonometry'],
    command: 'cmd'
  },
  {
    handler: '\\cot',
    label: 'cot',
    types: ['all', 'trigonometry'],
    command: 'cmd'
  },
  {
    handler: '\\tan^{-1}',
    label: <CustomImage src={Group2243} role="presentation" />,
    types: ['all', 'trigonometry'],
    command: 'write'
  },
  {
    handler: '\\cot^{-1}',
    label: <CustomImage src={Group2241} role="presentation" />,
    types: ['all', 'trigonometry'],
    command: 'write'
  },
  // Sets
  {
    handler: '\\subset',
    label: <CustomImage src={Group2256} role="presentation" />,
    types: ['all', 'sets'],
    command: 'cmd'
  },
  {
    handler: '\\supset',
    label: <CustomImage src={Group2253} role="presentation" />,
    types: ['all', 'sets'],
    command: 'cmd'
  },
  {
    handler: '\\subseteq',
    label: <CustomImage src={Group2263} role="presentation" />,
    types: ['all', 'sets'],
    command: 'cmd'
  },
  {
    handler: '\\supseteq',
    label: <CustomImage src={Group2261} role="presentation" />,
    types: ['all', 'sets'],
    command: 'cmd'
  },
  {
    handler: '\\in',
    label: <CustomImage src={Group2255} role="presentation" />,
    types: ['all', 'sets'],
    command: 'cmd'
  },
  {
    handler: '\\notin',
    label: <CustomImage src={Group2266} role="presentation" />,
    types: ['all', 'sets'],
    command: 'cmd'
  },
  {
    handler: '\\ni',
    label: <CustomImage src={Group2262} role="presentation" />,
    types: ['all', 'sets'],
    command: 'cmd'
  },
  {
    handler: '\\not\\subset',
    label: '⊄',
    types: ['all', 'sets'],
    command: 'write'
  },
  {
    handler: '\\union',
    label: '∪',
    types: ['all', 'sets'],
    command: 'cmd'
  },
  {
    handler: '\\intersection',
    label: '∩',
    types: ['all', 'sets'],
    command: 'cmd'
  },
  {
    handler: '\\emptyset',
    label: '∅',
    types: ['all', 'sets'],
    command: 'cmd'
  },
  {
    handler: ',',
    label: ',',
    types: ['all', 'sets'],
    command: 'cmd'
  },
  {
    handler: '!',
    label: '!',
    types: ['all', 'sets'],
    command: 'cmd'
  },
  {
    handler: '\\backslash',
    label: '\\',
    types: ['all', 'sets'],
    command: 'cmd'
  },
  {
    handler: '(',
    label: <CustomImage src={Group1024} role="presentation" />,
    types: ['all', 'sets'],
    command: 'cmd'
  },
  {
    handler: '{',
    label: <CustomImage src={Group1023} role="presentation" />,
    types: ['all', 'sets'],
    command: 'cmd'
  },
  {
    handler: '\\left[\\right)',
    label: <CustomImage src={Group1025} role="presentation" />,
    types: ['all', 'sets'],
    command: 'write'
  },
  {
    handler: '\\left(\\right]',
    label: <CustomImage src={Group1045} role="presentation" />,
    types: ['all', 'sets'],
    command: 'write'
  },
  // Units (SI)
  {
    handler: 'g',
    label: 'g',
    types: ['all', 'units_si'],
    command: 'cmd'
  },
  {
    handler: 'kg',
    label: 'kg',
    types: ['all', 'units_si'],
    command: 'cmd'
  },
  {
    handler: 'mg',
    label: 'mg',
    types: ['all', 'units_si'],
    command: 'cmd'
  },
  {
    handler: 'µg',
    label: 'µg',
    types: ['all', 'units_si'],
    command: 'cmd'
  },
  {
    handler: 'm',
    label: 'm',
    types: ['all', 'units_si'],
    command: 'cmd'
  },
  {
    handler: 'km',
    label: 'km',
    types: ['all', 'units_si'],
    command: 'cmd'
  },
  {
    handler: 'cm',
    label: 'cm',
    types: ['all', 'units_si'],
    command: 'cmd'
  },
  {
    handler: 'mm',
    label: 'mm',
    types: ['all', 'units_si'],
    command: 'cmd'
  },
  {
    handler: 'L',
    label: 'L',
    types: ['all', 'units_si'],
    command: 'cmd'
  },
  {
    handler: 'mL',
    label: 'mL',
    types: ['all', 'units_si'],
    command: 'cmd'
  },
  {
    handler: 's',
    label: 's',
    types: ['all', 'units_si'],
    command: 'cmd'
  },
  {
    handler: 'ms',
    label: 'ms',
    types: ['all', 'units_si'],
    command: 'cmd'
  },
  // Units (US)
  {
    handler: 'oz',
    label: 'oz',
    types: ['all', 'units_us'],
    command: 'cmd'
  },
  {
    handler: 'lb',
    label: 'lb',
    types: ['all', 'units_us'],
    command: 'cmd'
  },
  {
    handler: 'in',
    label: 'in',
    types: ['all', 'units_us'],
    command: 'cmd'
  },
  {
    handler: 'ft',
    label: 'ft',
    types: ['all', 'units_us'],
    command: 'cmd'
  },
  {
    handler: 'mi',
    label: 'mi',
    types: ['all', 'units_us'],
    command: 'cmd'
  },
  {
    handler: 'fl oz',
    label: 'fl oz',
    types: ['all', 'units_us'],
    command: 'cmd'
  },
  {
    handler: 'pt',
    label: 'pt',
    types: ['all', 'units_us'],
    command: 'cmd'
  },
  {
    handler: 'gal',
    label: 'gal',
    types: ['all', 'units_us'],
    command: 'cmd'
  },
  // Greek
  {
    handler: '\\alpha',
    label: 'α',
    types: ['all', 'greek'],
    command: 'cmd'
  },
  {
    handler: '\\gamma',
    label: 'γ',
    types: ['all', 'greek'],
    command: 'cmd'
  },
  {
    handler: '\\delta',
    label: 'δ',
    types: ['all', 'greek'],
    command: 'cmd'
  },
  {
    handler: '\\pi',
    label: 'π',
    types: ['all', 'greek'],
    command: 'cmd'
  },
  {
    handler: '\\theta',
    label: 'θ',
    types: ['all', 'greek'],
    command: 'cmd'
  },
  {
    handler: '\\sigma',
    label: 'σ',
    types: ['all', 'greek'],
    command: 'cmd'
  },
  {
    handler: '\\Delta',
    label: 'Δ',
    types: ['all', 'greek'],
    command: 'cmd'
  },
  {
    handler: '\\Pi',
    label: 'Π',
    types: ['all', 'greek']
  },
  {
    handler: '\\Theta',
    label: 'Θ',
    types: ['all', 'greek'],
    command: 'cmd'
  },
  {
    handler: '\\Sigma',
    label: 'Σ',
    types: ['all', 'greek'],
    command: 'cmd'
  },
  {
    handler: '\\lambda',
    label: 'λ',
    types: ['all', 'greek'],
    command: 'cmd'
  },
  {
    handler: '\\phi',
    label: 'ϕ',
    types: ['all', 'greek'],
    command: 'cmd'
  },
  {
    handler: '\\tau',
    label: 'τ',
    types: ['all', 'greek'],
    command: 'cmd'
  },
  {
    handler: '\\varepsilon',
    label: 'ε',
    types: ['all', 'greek'],
    command: 'cmd'
  },
  {
    handler: '\\beta',
    label: 'β',
    types: ['all', 'greek'],
    command: 'cmd'
  },
  // Chemistry
  {
    handler: '^',
    label: <CustomImage src={Group1010} role="presentation" />,
    types: ['all', 'chemistry'],
    command: 'cmd'
  },
  {
    handler: '_',
    label: <CustomImage src={Group1011} role="presentation" />,
    types: ['all', 'chemistry'],
    command: 'cmd'
  },
  {
    handler: '\\frac{\\mathrm{}}{\\mathrm{}}H',
    label: <CustomImage src={Group1012} role="presentation" />,
    types: ['all', 'chemistry'],
    command: 'write'
  },
  {
    handler: 'H\\frac{\\mathrm{}}{\\mathrm{}}',
    label: <CustomImage src={Group1013} role="presentation" />,
    types: ['all', 'chemistry'],
    command: 'write'
  },
  {
    handler: '\\rightarrow',
    label: '→',
    types: ['all', 'chemistry'],
    command: 'write'
  },
  {
    handler: '\\leftarrow',
    label: '←',
    types: ['all', 'chemistry'],
    command: 'write'
  },
  {
    handler: '\\rightleftharpoons',
    label: '⇋',
    types: ['all', 'chemistry'],
    command: 'write'
  },
  {
    handler: '\\longleftrightarrow',
    label: '←→',
    types: ['all', 'chemistry'],
    command: 'write'
  },
  {
    handler: '\\xrightarrow[]{}',
    label: <CustomImage src={Group1022} role="presentation" />,
    types: ['all', 'chemistry'],
    command: 'write'
  },
  {
    handler: 'mol',
    label: 'mol',
    types: ['all', 'chemistry'],
    command: 'write'
  },
  {
    handler: '\'',
    label: '\'',
    types: ['all', 'chemistry'],
    command: 'write'
  },
  {
    handler: '\\overset{}^{H}',
    label: <CustomImage src={Group1014} role="presentation" />,
    types: ['all', 'chemistry'],
    command: 'write'
  },
  {
    handler: '\\text{g}\\ \\text{mol}^{-1}',
    label: <CustomImage src={Group1054} role="presentation" />,
    types: ['all', 'chemistry'],
    command: 'write'
  },
  // Grouping
  {
    handler: '(',
    label: <CustomImage src={Group944} role="presentation" />,
    types: ['all', 'grouping'],
    command: 'cmd'
  },
  {
    handler: '[',
    label: <CustomImage src={Group944v2} role="presentation" />,
    types: ['all', 'grouping'],
    command: 'cmd'
  },
  {
    handler: '{',
    label: <CustomImage src={Group1023} role="presentation" />,
    types: ['all', 'grouping'],
    command: 'cmd'
  },
  // Calculus
  {
    handler: 'd',
    label: 'd',
    types: ['all', 'calculus'],
    command: 'cmd'
  },
  {
    handler: 'f',
    label: 'f',
    types: ['all', 'calculus'],
    command: 'cmd'
  },
  {
    handler: '\\Delta',
    label: 'Δ',
    types: ['all', 'calculus'],
    command: 'cmd'
  },
  {
    handler: '/',
    label: <CustomImage src={Group940v2} role="presentation" />,
    types: ['all', 'calculus'],
    command: 'cmd'
  },
  {
    handler: '(',
    label: <CustomImage src={Group944} role="presentation" />,
    types: ['all', 'calculus'],
    command: 'cmd'
  },
  {
    handler: '\\int_{}^{}',
    label: <CustomImage src={Group1029} role="presentation" />,
    types: ['all', 'calculus'],
    command: 'write'
  },
  {
    handler: '\\sum',
    label: <CustomImage src={Group1030} role="presentation" />,
    types: ['all', 'calculus'],
    command: 'cmd'
  },
  {
    handler: '\\partial',
    label: '∂',
    types: ['all', 'calculus'],
    command: 'cmd'
  },
  {
    handler: '\\lim_{x\\to {}}',
    label: <CustomImage src={Group1058} role="presentation" />,
    types: ['all', 'calculus'],
    command: 'write'
  },
  // Misc
  {
    handler: 'a',
    label: 'a',
    types: ['all', 'misc'],
    command: 'cmd'
  },
  {
    handler: 'b',
    label: 'b',
    types: ['all', 'misc'],
    command: 'cmd'
  },
  {
    handler: '\\propto',
    label: '∝',
    types: ['all', 'misc'],
    command: 'cmd'
  },
  {
    handler: 'abc',
    label: 'abc',
    types: ['all', 'misc'],
    command: 'cmd'
  },
  {
    handler: '|',
    label: '|',
    types: ['all', 'misc'],
    command: 'cmd'
  },
  {
    handler: '\\cdot',
    label: '·',
    types: ['all', 'misc'],
    command: 'cmd'
  },
  {
    handler: '\\longdiv',
    label: <CustomImage src={Group1030v2} role="presentation" />,
    types: ['all', 'misc'],
    command: 'cmd'
  },
  {
    handler: 'ℝ',
    label: <CustomImage src={Group2357} role="presentation" />,
    types: ['all', 'misc'],
    command: 'write'
  },
  // Discrete
  {
    handler: '\\lfloor',
    label: '⌊',
    types: ['all', 'discrete'],
    command: 'cmd'
  },
  {
    handler: '\\rfloor',
    label: '⌋',
    types: ['all', 'discrete'],
    command: 'cmd'
  },
  {
    handler: '\\lceil',
    label: '⌈',
    types: ['all', 'discrete'],
    command: 'cmd'
  },
  {
    handler: '\\rceil',
    label: '⌉',
    types: ['all', 'discrete'],
    command: 'cmd'
  },
  {
    handler: '\\uparrow',
    label: '↑',
    types: ['all', 'discrete'],
    command: 'cmd'
  },
  {
    handler: '\\equiv',
    label: '≡',
    types: ['all', 'discrete'],
    command: 'cmd'
  },
  {
    handler: '\\and',
    label: '∧',
    types: ['all', 'discrete'],
    command: 'cmd'
  },
  {
    handler: '\\or',
    label: '∨',
    types: ['all', 'discrete'],
    command: 'cmd'
  },
  {
    handler: '\\not',
    label: '¬',
    types: ['all', 'discrete'],
    command: 'cmd'
  },
  {
    handler: '\\exist',
    label: '∃',
    types: ['all', 'discrete'],
    command: 'cmd'
  },
  {
    handler: '\\forall',
    label: '∀',
    types: ['all', 'discrete'],
    command: 'cmd'
  },
  {
    handler: '\\oplus',
    label: '⊕',
    types: ['all', 'discrete'],
    command: 'cmd'
  },
  // General
  {
    handler: '\\sqrt[3]{}',
    label: <CustomImage src={Group1043} role="presentation" />,
    types: ['all', 'general'],
    command: 'write'
  },
  {
    handler: '\\therefore',
    label: '∴',
    types: ['all', 'general'],
    command: 'cmd'
  }
];

class MathKeyboard extends React.PureComponent {
  state = {
    dropdownOpened: false,
    // eslint-disable-next-line react/destructuring-assignment
    type: this.props.symbols[0]
  };

  close = () => {
    const { onClose } = this.props;
    onClose();
  };

  handleGroupSelect = (value) => {
    this.setState({
      type: value
    });
  };

  renderButtons = () => {
    const { onInput } = this.props;
    const { type } = this.state;

    return this.keyboardButtons.map(({ label, handler, command = 'cmd', types }, i) => {
      if (types.includes(type)) {
        return (
          <Button key={i} className="num num--type-3" onClick={() => onInput(handler, command)}>
            {label}
          </Button>
        );
      }

      return null;
    });
  };

  get keyboardButtons() {
    const { symbols } = this.props;

    return keyboardButtons.map((btn) => {
      symbols.forEach((symbol) => {
        if (isObject(symbol) && symbol.value.includes(btn.handler)) {
          btn.types.push(symbol.label);
        }
      });

      return btn;
    });
  }

  get selectOptions() {
    const { symbols } = this.props;

    return symbols.map((symbol) => {
      if (typeof symbol === 'string') {
        return math.symbols.find(opt => opt.value === symbol);
      }

      if (isObject(symbol)) {
        return {
          value: symbol.label,
          label: symbol.label
        };
      }

      return symbol;
    });
  }

  get numberPadItems() {
    const { numberPad } = this.props;

    if (!numberPad) {
      return [];
    }

    return numberPad.map((num) => {
      const res = numberPadItems.find(({ value }) => num === value);
      return res || { value: '', label: '' };
    });
  }

  render() {
    const { dropdownOpened, type } = this.state;
    const { onInput, showResponse, symbols } = this.props;

    return (
      <MathKeyboardStyles>
        <div className="keyboard">
          <div className="keyboard__header">
            <div>
              <Select
                defaultValue={symbols[0]}
                className="keyboard__header__select"
                size="large"
                onSelect={this.handleGroupSelect}
                onDropdownVisibleChange={(open) => {
                  this.setState({ dropdownOpened: open });
                }}
                suffixIcon={(
                  <Icon
                    type={dropdownOpened ? 'up' : 'down'}
                    style={{ color: '#51aef8' }}
                    theme="outlined"
                  />
)}
              >
                {this.selectOptions.map(({ value, label }, index) => (
                  <Select.Option value={value} key={index}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
              {showResponse && (
                <span
                  className="response-embed"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onInput(EMBED_RESPONSE)}
                >
                  <span className="response-embed__char">R</span>
                  <span className="response-embed__text">Response</span>
                </span>
              )}
            </div>
          </div>
          <br />
          {type === 'qwerty' && <Keyboard onInput={onInput} />}
          {type !== 'qwerty' && (
            <div className="keyboard__main">
              <div className="half-box">
                {this.numberPadItems.map((item, index) => (
                  <Button disabled={!item.value} key={index} className="num num--type-1" onClick={() => onInput(item.value)}>
                    {item.label}
                  </Button>
                ))}
              </div>
              <div className="keyboard__types3 half-box">{this.renderButtons()}</div>
            </div>
          )}
        </div>
      </MathKeyboardStyles>
    );
  }
}

MathKeyboard.propTypes = {
  onClose: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
  showResponse: PropTypes.bool,
  symbols: PropTypes.array.isRequired,
  numberPad: PropTypes.array.isRequired
};

MathKeyboard.defaultProps = {
  showResponse: false
};

export default MathKeyboard;
