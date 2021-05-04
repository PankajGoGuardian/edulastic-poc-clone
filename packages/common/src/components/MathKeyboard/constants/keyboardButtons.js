/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { math as mathConstant } from '@edulastic/constants'

import Grupo6133 from '../assets/Grupo6133.svg'
import Grupo6134 from '../assets/Grupo6134.svg'
import Grupo6135 from '../assets/Grupo6135.svg'
import Grupo6136 from '../assets/Grupo6136.svg'
import Grupo6137 from '../assets/Grupo6137.svg'
import Grupo6138 from '../assets/Grupo6138.svg'
import Grupo6140 from '../assets/Grupo6140.svg'
import Grupo6141 from '../assets/Grupo6141.svg'
import Grupo6142 from '../assets/Grupo6142.svg'

import { CustomImage } from './CustomImage'

import {
  plusButton,
  minusButton,
  asterisk,
  divide,
  multiplication,
  fraction,
  slashDivide,
  parentheses,
  timesDot,
  brackets,
  mixedFraction,
  exponent,
  subscriptBase,
  sqrt,
  mixedSqrt,
  plusMinus,
  greaterEqual,
  lessEqual,
  distance,
  degree,
  strictGreater,
  strictLess,
  piSymbol,
  imaginaryUnit,
  sine,
  cosine,
  arcsine,
  eulerNumber,
  arccosine,
  theta,
  infinity,
  tangent,
  arctangent,
  logSymbol,
  cotangent,
  mm2,
  cm2,
  m2,
  km2,
  si_ug,
  si_mg,
  si_g,
  si_kg,
  si_m,
  si_um,
  si_us,
  si_km,
  si_ms,
  si_s,
  si_ml,
  si_l,
  si_per_ms,
  si_per_ms2,
  si_mm3,
  si_cm3,
  si_m3,
  si_km3,
  si_kgm3,
  si_gcm3,
  us_in2,
  us_oz,
  us_lb,
  us_in,
  us_ft,
  us_mi,
  us_fl_oz,
  us_pt,
  us_gal,
  si_mm,
  si_cm,
  si_cm_sec,
  si_km_sec,
  us_mi2,
  us_ft2,
  us_second,
  us_minutes,
  us_hour,
  slash,
  equalSymbol,
  notEqual,
  similarity,
  equivalence,
  approximation,
  simeq,
  congruent,
  lneq,
  gnep,
  strictSubset,
  strictSuperset,
  subset,
  superset,
  belongsTo,
  notBelongsTo,
  union,
  intersection,
  square,
  triangle,
  o_dot,
  parallelogram,
  perp,
  parallel,
  mathbb_q,
  mathbb_w,
  mathbb_z,
  mathbb_c,
  mathbb_r,
  angle,
  m_angle,
  nparallel,
  not_ni_symbole,
  ni_symbole,
  forall,
  diamond,
  star,
  clubsuit,
  diamondsuit,
  spadesuit,
  heartsuit,
  // backslash,
  flat,
  natural,
  sharp,
  leftarrow,
  rightarrow,
  uparrow,
  downarrow,
  longleftrightarrow,
  rightleftharpoons,
  lceil,
  rceil,
  big_rightarrow,
  v_dot,
  l_dots,
  d_dots,
  therefore,
  because,
  v_two_dots,
  alpha,
  beta,
  gamma,
  delta,
  varepsilon,
  zeta,
  eta,
  vartheta,
  iota,
  kappa,
  lambda,
  mu,
  nu,
  xi,
  greek_o,
  varpi,
  rho,
  varsigma,
  sigma,
  tau,
  upsilon,
  varphi,
  phi,
  chi,
  psi,
  omega,
  upper_alpha,
  upper_beta,
  upper_gamma,
  upper_delta,
  upper_epsilon,
  upper_zeta,
  upper_eta,
  upper_theta,
  upper_iota,
  upper_kappa,
  upper_lambda,
  upper_mu,
  upper_nu,
  upper_xi,
  upper_omicron,
  upper_pi,
  upper_rho,
  upper_sigma,
  upper_tau,
  upper_upsilon,
  upper_phi,
  upper_chi,
  upper_psi,
  upper_omega,
  bmatrix,
  bmatrix_v_one,
  bmatrix_h_one,
  bmatrix_three,
  vmatrix,
  shift_matrix,
  shift_enter_matrix,
  left_matrix,
  right_matrix,
  // sq_matrix,
  // plus_matrix,
  xrightarrow,
  overline,
  overline_r_arrow,
  overline_l_r_arrow,
  over_arc,
  under_sim,
  braces,
  left_bracket,
  right_bracket,
  sum_symbol,
  no_subset,
  empty_set,
  exist_set,
  circle_plus,
  derivative,
  derivative_alpha,
  integral,
  limit,
  // frac_H,
  // mathrm_H,
  // overset_H,
  log_under,
  ln_left,
  arcsecant,
  arccosecant,
  secant,
  cosecant,
  exponentBase,
  arccot,
  us_feet,
  us_sq_mi,
  us_yard,
  us_acre,
  us_cup,
  us_qt,
  us_tbsp,
  us_ton,
  us_tsp,
  us_mph,
  us_fps,
  us_ft_2,
  us_in_3,
  us_mi_3,
  us_ft_3,
  mixedSqrtTree,
  parentheses_start,
  parentheses_end,
  brackets_start,
  brackets_end,
  e_number,
  nabla,
  delta_value,
  nabla_times,
  delta_multiple,
  integral_single,
  // integral_double,
  closed_contour,
  // closed_surface,
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
  zero,
} from './buttons'

const { keyboardMethods } = mathConstant

const tabIconSize = {
  width: 30,
  height: 30,
}

const OPERATORS = [plusButton, minusButton, asterisk, divide]

// keypad mode buttons

const BASIC = [
  plusButton,
  minusButton,
  multiplication,
  divide,
  strictLess,
  strictGreater,
  parentheses,
  brackets,
  fraction,
  mixedFraction,
  exponentBase,
  distance,
]

const BASIC_WO_NUMBER = [
  fraction,
  mixedFraction,
  sqrt,
  mixedSqrtTree,
  exponent,
  piSymbol,
]

const INTERMEDIATE = [
  divide,
  multiplication,
  plusMinus,
  greaterEqual,
  lessEqual,
  strictLess,
  strictGreater,
  parentheses_start,
  parentheses_end,
  brackets_start,
  brackets_end,
  piSymbol,
  infinity,
  logSymbol,
  distance,
  degree,
  mixedSqrt,
  fraction,
  mixedFraction,
  exponent,
  sqrt,
  // parentheses,
  // brackets,
]

const INTERMEDIATE_WO_NUMBER = [
  multiplication,
  plusMinus,
  greaterEqual,
  lessEqual,
  strictLess,
  strictGreater,
  parentheses_start,
  parentheses_end,
  brackets_start,
  brackets_end,
  piSymbol,
  infinity,
  logSymbol,
  distance,
  degree,
  mixedSqrt,
  fraction,
  mixedFraction,
  exponent,
  sqrt,
  parentheses,
  brackets,
]

const ADVANCED_MATRICES = [
  fraction,
  exponent,
  sqrt,
  vmatrix,
  bmatrix,
  bmatrix_three,
  shift_matrix,
  shift_enter_matrix,
]

const ADVANCED_TRIGNOMETRY = [
  imaginaryUnit,
  e_number,
  degree,
  piSymbol,
  exponent,
  fraction,
  distance,
  sqrt,
  sine,
  cosine,
  tangent,
  cotangent,
  arcsine,
  arccosine,
  arcsecant,
  arccosecant,
  arctangent,
  arccot,
]

const GEOMETRY = [
  perp,
  angle,
  triangle,
  degree,
  parallel,
  m_angle,
  o_dot,
  theta,
  nparallel,
  similarity,
  parallelogram,
  equivalence,
  under_sim,
  congruent,
  over_arc,
  piSymbol,
  overline,
  overline_r_arrow,
  overline_l_r_arrow,
  square,
]

const UNITS_SI = [
  mm2,
  cm2,
  m2,
  km2,
  si_ug,
  si_mg,
  si_g,
  si_kg,
  si_um,
  si_mm,
  si_cm,
  si_m,
  si_km,
  si_us,
  si_ms,
  si_s,
  si_ml,
  si_l,
  si_per_ms,
  si_cm_sec,
  si_km_sec,
  si_per_ms2,
  si_mm3,
  si_cm3,
  si_m3,
  si_km3,
  si_kgm3,
  si_gcm3,
]

const UNITS_US = [
  us_in2,
  us_mi2,
  us_ft2,
  us_feet,
  us_oz,
  us_lb,
  us_in,
  us_ft,
  us_mi,
  us_fl_oz,
  us_pt,
  us_gal,
  us_second,
  us_minutes,
  us_hour,
  us_sq_mi,
  us_yard,
  us_acre,
  us_cup,
  us_qt,
  us_tbsp,
  us_ton,
  us_tsp,
  us_mph,
  us_fps,
  us_ft_2,
  us_in_3,
  us_mi_3,
  us_ft_3,
]

const NUMBERS_ONLY = [
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
  zero,
]

export const KEYBOARD_BUTTONS = [
  ...OPERATORS,
  ...NUMBERS_ONLY.map((btn) => ({
    ...btn,
    types: [keyboardMethods.NUMBERS_ONLY],
  })),
  ...BASIC.map((btn) => ({ ...btn, types: [keyboardMethods.BASIC] })),
  ...BASIC_WO_NUMBER.map((btn) => ({
    ...btn,
    types: [keyboardMethods.BASIC_WO_NUMBER],
  })),
  ...INTERMEDIATE.map((btn) => ({
    ...btn,
    types: [keyboardMethods.INTERMEDIATE],
  })),
  ...INTERMEDIATE_WO_NUMBER.map((btn) => ({
    ...btn,
    types: [keyboardMethods.INTERMEDIATE_WO_NUMBER],
  })),
  ...ADVANCED_MATRICES.map((btn) => ({
    ...btn,
    types: [keyboardMethods.ADVANCED_MATRICES],
  })),
  ...ADVANCED_TRIGNOMETRY.map((btn) => ({
    ...btn,
    types: [keyboardMethods.ADVANCED_TRIGNOMETRY],
  })),
  ...GEOMETRY.map((btn) => ({ ...btn, types: [keyboardMethods.GEOMETRY] })),
  ...UNITS_SI.map((btn) => ({ ...btn, types: [keyboardMethods.UNITS_SI] })),
  ...UNITS_US.map((btn) => ({ ...btn, types: [keyboardMethods.UNITS_US] })),
]

export const TAB_BUTTONS = [
  {
    label: <CustomImage src={Grupo6134} {...tabIconSize} />,
    name: 'General',
    key: 'GENERAL',
    buttons: [
      plusButton,
      minusButton,
      asterisk,
      divide,
      plusMinus,
      timesDot,
      multiplication,
      slashDivide,
      sqrt,
      fraction,
      exponent,
      subscriptBase,
      mixedSqrt,
      mixedFraction,
      lessEqual,
      greaterEqual,
      brackets,
      parentheses,
      strictGreater,
      strictLess,
      distance,
      degree,
      piSymbol,
      imaginaryUnit,
      sine,
      arcsine,
      eulerNumber,
      cosine,
      arccosine,
      theta,
      infinity,
      tangent,
      arctangent,
      logSymbol,
      cotangent,
    ],
  },
  {
    label: <CustomImage src={Grupo6133} width={16} height={16} />,
    key: 'UNIT',
    name: 'Units',
    buttons: [
      mm2,
      cm2,
      m2,
      km2,
      si_ug,
      si_mg,
      si_g,
      si_kg,
      si_m,
      si_km,
      si_us,
      si_ms,
      si_s,
      si_ml,
      si_l,
      si_per_ms,
      si_per_ms2,
      si_mm3,
      si_cm3,
      si_m3,
      si_km3,
      si_kgm3,
      si_gcm3,
      us_in2,
      us_oz,
      us_lb,
      us_in,
      us_ft,
      us_mi,
      us_fl_oz,
      us_pt,
      si_um,
      us_gal,
      si_mm,
      si_cm,
      si_cm_sec,
      si_km_sec,
      us_mi2,
      us_ft2,
      us_second,
      us_minutes,
      us_hour,
    ],
  },
  {
    label: <CustomImage src={Grupo6135} {...tabIconSize} />,
    name: 'Symbols',
    key: 'SYMBOLS',
    buttons: [
      plusButton,
      timesDot,
      asterisk,
      minusButton,
      divide,
      slash,
      plusMinus,
      equalSymbol,
      notEqual,
      similarity,
      equivalence,
      approximation,
      simeq,
      congruent,
      strictGreater,
      strictLess,
      greaterEqual,
      lessEqual,
      lneq,
      gnep,
      infinity,
      strictSubset,
      strictSuperset,
      subset,
      superset,
      belongsTo,
      notBelongsTo,
      union,
      intersection,
      square,
      triangle,
      parallelogram,
      perp,
      parallel,
      mathbb_q,
      mathbb_w,
      mathbb_z,
      mathbb_c,
      mathbb_r,
      theta,
      angle,
      m_angle,
      o_dot,
      nparallel,
      ni_symbole,
      not_ni_symbole,
      forall,
      diamond,
      star,
      clubsuit,
      diamondsuit,
      spadesuit,
      heartsuit,
      // backslash,
      flat,
      natural,
      sharp,
    ],
  },
  {
    label: <CustomImage src={Grupo6136} {...tabIconSize} />,
    name: 'Arrows',
    key: 'ARROW',
    buttons: [
      leftarrow,
      rightarrow,
      uparrow,
      downarrow,
      longleftrightarrow,
      rightleftharpoons,
      lceil,
      rceil,
      big_rightarrow,
      v_dot,
      l_dots,
      d_dots,
      therefore,
      because,
      v_two_dots,
    ],
  },
  {
    label: <CustomImage src={Grupo6137} {...tabIconSize} />,
    name: 'Greek',
    key: 'GREEK',
    buttons: [
      alpha,
      beta,
      gamma,
      delta,
      varepsilon,
      zeta,
      eta,
      theta,
      vartheta,
      iota,
      kappa,
      lambda,
      mu,
      nu,
      xi,
      greek_o,
      piSymbol,
      varpi,
      rho,
      varsigma,
      sigma,
      tau,
      upsilon,
      varphi,
      phi,
      chi,
      psi,
      omega,
      upper_alpha,
      upper_beta,
      upper_gamma,
      upper_delta,
      upper_epsilon,
      upper_zeta,
      upper_eta,
      upper_theta,
      upper_iota,
      upper_kappa,
      upper_lambda,
      upper_mu,
      upper_nu,
      upper_xi,
      upper_omicron,
      upper_pi,
      upper_rho,
      upper_sigma,
      upper_tau,
      upper_upsilon,
      upper_phi,
      upper_chi,
      upper_psi,
      upper_omega,
      mathbb_r,
    ],
  },
  {
    label: <CustomImage src={Grupo6138} {...tabIconSize} />,
    name: 'Matrices',
    key: 'MATRIX',
    buttons: [
      bmatrix_v_one,
      bmatrix_h_one,
      bmatrix,
      bmatrix_three,
      vmatrix,
      shift_matrix,
      shift_enter_matrix,
      left_matrix,
      right_matrix,
      // sq_matrix,
      // plus_matrix,
    ],
  },
  {
    label: <CustomImage src={Grupo6140} {...tabIconSize} />,
    name: 'Decorations',
    key: 'DECORATIONS',
    buttons: [
      xrightarrow,
      overline,
      overline_r_arrow,
      overline_l_r_arrow,
      over_arc,
      under_sim,
      parentheses,
      brackets,
      braces,
      distance,
      left_bracket,
      right_bracket,
    ],
  },
  {
    label: <CustomImage src={Grupo6141} {...tabIconSize} />,
    name: 'Big Operators',
    key: 'BIG_OPERATOR',
    buttons: [
      sum_symbol,
      infinity,
      strictSubset,
      strictSuperset,
      subset,
      superset,
      notBelongsTo,
      ni_symbole,
      no_subset,
      union,
      intersection,
      empty_set,
      exist_set,
      forall,
      circle_plus,
    ],
  },
  {
    label: <CustomImage src={Grupo6142} {...tabIconSize} />,
    name: 'Calculus',
    key: 'CALCULUS',
    buttons: [
      derivative,
      derivative_alpha,
      integral,
      limit,
      // frac_H,
      // mathrm_H,
      // overset_H,
      // logSymbol,
      log_under,
      ln_left,
      sine,
      cosine,
      tangent,
      cotangent,
      arcsine,
      arccosine,
      arcsecant,
      arccosecant,
      secant,
      cosecant,
      nabla,
      delta_value,
      nabla_times,
      delta_multiple,
      integral_single,
      // integral_double,
      closed_contour,
      // closed_surface,
    ],
  },
]
