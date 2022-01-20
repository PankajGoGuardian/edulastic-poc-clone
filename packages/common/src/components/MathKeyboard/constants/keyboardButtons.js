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
import Group2479 from '../assets/trigonometry/2479.svg'

import { CustomImage } from './CustomImage'

import * as buttons from './buttons'

const { keyboardMethods } = mathConstant

const OPERATORS = [
  buttons.plusButton,
  buttons.minusButton,
  buttons.asterisk,
  buttons.divide,
]

// keypad mode buttons

const BASIC = [
  buttons.plusButton,
  buttons.minusButton,
  buttons.multiplication,
  buttons.divide,
  buttons.strictLess,
  buttons.strictGreater,
  buttons.parentheses,
  buttons.brackets,
  buttons.fraction,
  buttons.mixedFraction,
  buttons.exponentBase,
  buttons.distance,
]

const BASIC_WO_NUMBER = [
  buttons.fraction,
  buttons.mixedFraction,
  buttons.sqrt,
  buttons.mixedSqrtTree,
  buttons.exponent,
  buttons.piSymbol,
]

const INTERMEDIATE = [
  buttons.divide,
  buttons.multiplication,
  buttons.plusMinus,
  buttons.infinity,
  buttons.greaterEqual,
  buttons.lessEqual,
  buttons.strictGreater,
  buttons.strictLess,
  buttons.parentheses_start,
  buttons.brackets_start,
  buttons.logSymbol,
  buttons.piSymbol,
  buttons.parentheses_end,
  buttons.brackets_end,
  buttons.distance,
  buttons.theta,
  buttons.mixedSqrt,
  buttons.fraction,
  buttons.mixedFraction,
  buttons.exponent,
  buttons.sqrt,
  buttons.degree,
  buttons.eulerNumber,
  // parentheses,
  // brackets,
]

const INTERMEDIATE_WO_NUMBER = [
  buttons.multiplication,
  buttons.plusMinus,
  buttons.greaterEqual,
  buttons.lessEqual,
  buttons.strictLess,
  buttons.strictGreater,
  buttons.divide,
  buttons.equalSymbol,
  buttons.parentheses_start,
  buttons.parentheses_end,
  buttons.brackets_start,
  buttons.brackets_end,
  buttons.piSymbol,
  buttons.infinity,
  buttons.logSymbol,
  buttons.distance,
  buttons.degree,
  buttons.mixedSqrt,
  buttons.fraction,
  buttons.mixedFraction,
  buttons.exponent,
  buttons.sqrt,
  buttons.parentheses,
  buttons.brackets,
]
/**
 * Note: Buttons from ADVANCED_MATRICES are used to form BASIC_MATRICES | EV-23620
 * Thus any changes in ADVANCED_MATRICES needs updations in BASIC_MATRICES as well.
 */
export const ADVANCED_MATRICES = [
  buttons.fraction,
  buttons.exponent,
  buttons.sqrt,
  buttons.vmatrix,
  buttons.bmatrix,
  buttons.bmatrix_three,
  buttons.shift_matrix,
  buttons.shift_enter_matrix,
]

const BASIC_MATRICES = [
  buttons.plusButton,
  buttons.minusButton,
  buttons.multiplication,
  buttons.divide,
  buttons.bmatrix_three,
  buttons.strictLess,
  buttons.strictGreater,
  buttons.parentheses,
  buttons.brackets,
  buttons.shift_matrix,
  buttons.fraction,
  buttons.mixedFraction,
  buttons.exponentBase,
  buttons.distance,
  buttons.shift_enter_matrix,
]

const ADVANCED_TRIGNOMETRY = [
  // buttons.imaginaryUnit,
  // buttons.e_number,
  buttons.degree,
  buttons.piSymbol,
  buttons.exponent,
  buttons.fraction,
  buttons.distance,
  buttons.sqrt,
  buttons.sine,
  buttons.cosine,
  buttons.secant,
  buttons.cosecant,
  buttons.tangent,
  buttons.cotangent,
  buttons.arcsine,
  buttons.arccosine,
  buttons.arcsecant,
  buttons.arccosecant,
  buttons.arctangent,
  buttons.arccot,
  buttons.sinh,
  buttons.cosh,
  buttons.sech,
  buttons.csch,
  buttons.tanh,
  buttons.coth,
  buttons.inverse_sinh,
  buttons.inverse_cosh,
  buttons.inverse_sech,
  buttons.inverse_csch,
  buttons.inverse_tanh,
  buttons.inverse_coth,
  buttons.perp,
  buttons.parallel,
  buttons.angle,
  buttons.m_angle,
]

const GEOMETRY = [
  buttons.perp,
  buttons.angle,
  buttons.triangle,
  buttons.degree,
  buttons.parallel,
  buttons.m_angle,
  buttons.o_dot,
  buttons.theta,
  buttons.nparallel,
  buttons.similarity,
  buttons.parallelogram,
  buttons.equivalence,
  buttons.under_sim,
  buttons.congruent,
  buttons.over_arc,
  buttons.piSymbol,
  buttons.overline,
  buttons.overline_r_arrow,
  buttons.overline_l_r_arrow,
  buttons.square,
]

const UNITS_SI = [
  buttons.mm2,
  buttons.cm2,
  buttons.m2,
  buttons.km2,
  buttons.si_ug,
  buttons.si_mg,
  buttons.si_g,
  buttons.si_kg,
  buttons.si_um,
  buttons.si_mm,
  buttons.si_cm,
  buttons.si_m,
  buttons.si_km,
  buttons.si_us,
  buttons.si_ms,
  buttons.si_s,
  buttons.si_ml,
  buttons.si_l,
  buttons.si_per_ms,
  buttons.si_cm_sec,
  buttons.si_km_sec,
  buttons.si_per_ms2,
  buttons.si_mm3,
  buttons.si_cm3,
  buttons.si_m3,
  buttons.si_km3,
  buttons.si_kgm3,
  buttons.si_gcm3,
]

const UNITS_US = [
  buttons.us_in2,
  buttons.us_mi2,
  buttons.us_ft2,
  buttons.us_feet,
  buttons.us_oz,
  buttons.us_lb,
  buttons.us_in,
  buttons.us_ft,
  buttons.us_mi,
  buttons.us_fl_oz,
  buttons.us_pt,
  buttons.us_gal,
  buttons.us_second,
  buttons.us_minutes,
  buttons.us_hour,
  buttons.us_sq_mi,
  buttons.us_yard,
  buttons.us_acre,
  buttons.us_cup,
  buttons.us_qt,
  buttons.us_tbsp,
  buttons.us_ton,
  buttons.us_tsp,
  buttons.us_mph,
  buttons.us_fps,
  buttons.us_ft_2,
  buttons.us_in_3,
  buttons.us_mi_3,
  buttons.us_ft_3,
]

const NUMBERS_ONLY = [
  buttons.one,
  buttons.two,
  buttons.three,
  buttons.four,
  buttons.five,
  buttons.six,
  buttons.seven,
  buttons.eight,
  buttons.nine,
  buttons.zero,
]

const CHEMISTRY = [
  buttons.mathrm,
  buttons.mathrm_under,
  buttons.mathrm_both,
  buttons.mathrm_both_l,
  buttons.degree,
  buttons.mathrm_braces,
  buttons.mathrm_parentheses,
  buttons.mathrm_brackets,
  buttons.leftarrow,
  buttons.rightarrow,
  buttons.uparrow,
  buttons.downarrow,
  buttons.longleftrightarrow,
  buttons.rightleftharpoons,
  buttons.rightleftarrows,
  buttons.triangle,
  buttons.n_a,
  buttons.k_b,
  buttons.mathrm_mol,
  buttons.gmliter,
  buttons.gmol,
  buttons.minusButton,
  buttons.equalSymbol,
  buttons.equivalence,
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
  ...CHEMISTRY.map((btn) => ({ ...btn, types: [keyboardMethods.CHEMISTRY] })),
  ...UNITS_SI.map((btn) => ({ ...btn, types: [keyboardMethods.UNITS_SI] })),
  ...UNITS_US.map((btn) => ({ ...btn, types: [keyboardMethods.UNITS_US] })),
  ...BASIC_MATRICES.map((btn) => ({
    ...btn,
    types: [keyboardMethods.BASIC_MATRICES],
  })),
]

export const TAB_BUTTONS = [
  {
    label: <CustomImage src={Grupo6134} width={33} height={24} />,
    name: 'General',
    key: 'GENERAL',
    buttons: [
      buttons.plusButton,
      buttons.minusButton,
      buttons.asterisk,
      buttons.divide,
      buttons.plusMinus,
      buttons.timesDot,
      buttons.multiplication,
      buttons.slashDivide,
      buttons.sqrt,
      buttons.fraction,
      buttons.exponent,
      buttons.subscriptBase,
      buttons.mixedSqrt,
      buttons.mixedFraction,
      buttons.lessEqual,
      buttons.greaterEqual,
      buttons.brackets,
      buttons.parentheses,
      buttons.strictGreater,
      buttons.strictLess,
      buttons.percent,
      buttons.piSymbol,
      buttons.imaginaryUnit,
      buttons.eulerNumber,
      buttons.theta,
      buttons.infinity,
      buttons.mixedSqrtTree,
      buttons.fog,
      // buttons.sq_matrix,
      // buttons.plus_matrix,
      // buttons.line_matrix,
      // buttons.minus_matrix,
      // buttons.time_matrix,
    ],
  },
  {
    label: <CustomImage src={Grupo6133} width={16.45} height={16} />,
    key: 'UNIT',
    name: 'Units',
    buttons: [
      buttons.mm2,
      buttons.cm2,
      buttons.m2,
      buttons.km2,
      buttons.si_ug,
      buttons.si_mg,
      buttons.si_g,
      buttons.si_kg,
      buttons.si_m,
      buttons.si_km,
      buttons.si_us,
      buttons.si_ms,
      buttons.si_s,
      buttons.si_ml,
      buttons.si_l,
      buttons.si_per_ms,
      buttons.si_per_ms2,
      buttons.si_mm3,
      buttons.si_cm3,
      buttons.si_m3,
      buttons.si_km3,
      buttons.si_kgm3,
      buttons.si_gcm3,
      buttons.us_in2,
      buttons.us_oz,
      buttons.us_lb,
      buttons.us_in,
      buttons.us_ft,
      buttons.us_mi,
      buttons.us_fl_oz,
      buttons.us_pt,
      buttons.si_um,
      buttons.us_gal,
      buttons.si_mm,
      buttons.si_cm,
      buttons.si_cm_sec,
      buttons.si_km_sec,
      buttons.us_mi2,
      buttons.us_ft2,
      buttons.us_second,
      buttons.us_minutes,
      buttons.us_hour,
      buttons.us_acre,
      buttons.bytes,
      buttons.megabyte,
      buttons.gigabit,
      buttons.mol,
      buttons.gmliter,
      buttons.gmol,
    ],
  },
  {
    label: <CustomImage src={Group2479} width={20} height={12} />,
    key: 'TRIGNOMETRY',
    name: 'Trignometry',
    buttons: [...ADVANCED_TRIGNOMETRY],
  },
  {
    label: <CustomImage src={Grupo6135} width={24} height={12} />,
    name: 'Symbols',
    key: 'SYMBOLS',
    buttons: [
      buttons.plusButton,
      buttons.timesDot,
      buttons.asterisk,
      buttons.minusButton,
      buttons.divide,
      buttons.slash,
      buttons.plusMinus,
      buttons.equalSymbol,
      buttons.notEqual,
      buttons.similarity,
      buttons.equivalence,
      buttons.approximation,
      buttons.simeq,
      buttons.congruent,
      buttons.strictGreater,
      buttons.strictLess,
      buttons.greaterEqual,
      buttons.lessEqual,
      buttons.lneq,
      buttons.gnep,
      buttons.infinity,
      buttons.strictSubset,
      buttons.strictSuperset,
      buttons.subset,
      buttons.superset,
      buttons.belongsTo,
      buttons.notBelongsTo,
      buttons.union,
      buttons.intersection,
      buttons.square,
      buttons.triangle,
      buttons.parallelogram,
      buttons.perp,
      buttons.parallel,
      buttons.mathbb_q,
      buttons.mathbb_w,
      buttons.mathbb_z,
      buttons.mathbb_c,
      buttons.mathbb_r,
      buttons.theta,
      buttons.angle,
      buttons.m_angle,
      buttons.o_dot,
      buttons.nparallel,
      buttons.ni_symbole,
      buttons.not_ni_symbole,
      buttons.forall,
      buttons.diamond,
      buttons.star,
      buttons.clubsuit,
      buttons.diamondsuit,
      buttons.spadesuit,
      buttons.heartsuit,
      // backslash,
      buttons.flat,
      buttons.natural,
      buttons.sharp,
    ],
  },
  {
    label: <CustomImage src={Grupo6136} width={30.55} height={12} />,
    name: 'Arrows and Logical Operators',
    key: 'ARROW',
    buttons: [
      buttons.leftarrow,
      buttons.longleftrightarrow,
      buttons.rightarrow,
      buttons.uparrow,
      buttons.downarrow,
      buttons.neg,
      buttons.lceil,
      buttons.rceil,
      buttons.rightleftharpoons,
      buttons.big_rightarrow,
      buttons.vdash,
      buttons.equivalence,
      buttons.nleftrightarrow,
      buttons.nrightarrow,
      buttons.circ,
      buttons.circle_plus,
      buttons.v_dot,
      buttons.l_dots,
      buttons.d_dots,
      buttons.therefore,
      buttons.because,
      buttons.v_two_dots,
      buttons.vee,
      buttons.wedge,
      buttons.barwedge,
      buttons.barvee,
    ],
  },
  {
    label: <CustomImage src={Grupo6137} width={24.8} height={12} />,
    name: 'Greek',
    key: 'GREEK',
    buttons: [
      buttons.alpha,
      buttons.beta,
      buttons.gamma,
      buttons.delta,
      buttons.varepsilon,
      buttons.zeta,
      buttons.eta,
      buttons.theta,
      buttons.vartheta,
      buttons.iota,
      buttons.kappa,
      buttons.lambda,
      buttons.mu,
      buttons.nu,
      buttons.xi,
      buttons.greek_o,
      buttons.piSymbol,
      buttons.varpi,
      buttons.rho,
      buttons.varsigma,
      buttons.sigma,
      buttons.tau,
      buttons.upsilon,
      buttons.varphi,
      buttons.phi,
      buttons.chi,
      buttons.psi,
      buttons.omega,
      buttons.upper_alpha,
      buttons.upper_beta,
      buttons.upper_gamma,
      buttons.upper_delta,
      buttons.upper_epsilon,
      buttons.upper_zeta,
      buttons.upper_eta,
      buttons.upper_theta,
      buttons.upper_iota,
      buttons.upper_kappa,
      buttons.upper_lambda,
      buttons.upper_mu,
      buttons.upper_nu,
      buttons.upper_xi,
      buttons.upper_omicron,
      buttons.upper_pi,
      buttons.upper_rho,
      buttons.upper_sigma,
      buttons.upper_tau,
      buttons.upper_upsilon,
      buttons.upper_phi,
      buttons.upper_chi,
      buttons.upper_psi,
      buttons.upper_omega,
      // buttons.mathbb_r,
    ],
  },
  {
    label: <CustomImage src={Grupo6138} width={46.8} height={23.7} />,
    name: 'Matrices, Piecewise Functions and Systems of Equations',
    key: 'MATRIX',
    buttons: [
      buttons.bmatrix_v_one,
      buttons.bmatrix_h_one,
      buttons.bmatrix,
      buttons.bmatrix_three,
      buttons.vmatrix,
      buttons.right_matrix,
      buttons.left_matrix,
      buttons.left_matrix_two,
      // buttons.sq_matrix,
      // buttons.plus_matrix,
      buttons.shift_matrix,
      buttons.shift_enter_matrix,
    ],
  },
  {
    label: <CustomImage src={Grupo6140} width={34} height={20} />,
    name: 'Sets, Intervals and other Structures',
    key: 'DECORATIONS',
    buttons: [
      buttons.xrightarrow,
      buttons.overline,
      buttons.overline_r_arrow,
      buttons.overline_l_r_arrow,
      buttons.over_arc,
      buttons.hat,
      buttons.under_sim,
      buttons.parentheses_start,
      buttons.parentheses_end,
      buttons.brackets_start,
      buttons.brackets_end,
      buttons.parentheses,
      buttons.brackets,
      buttons.braces,
      buttons.distance,
      buttons.left_bracket,
      buttons.right_bracket,
    ],
  },
  {
    label: <CustomImage src={Grupo6141} width={27.5} height={15.6} />,
    name: 'Sets',
    key: 'BIG_OPERATOR',
    buttons: [
      buttons.infinity,
      buttons.strictSubset,
      buttons.strictSuperset,
      buttons.subset,
      buttons.superset,
      buttons.notBelongsTo,
      buttons.ni_symbole,
      buttons.not_ni_symbole,
      buttons.no_subset_eq,
      buttons.no_subset,
      buttons.union,
      buttons.intersection,
      buttons.empty_set,
      buttons.exist_set,
      buttons.forall,
      buttons.mathbb_r,
      buttons.mathbb_c,
      buttons.mathbb_q,
      buttons.mathbb_z,
      buttons.mathbb_n,
      buttons.mathbb_u, // TODO: update icon
      buttons.backslash,
      buttons.braces,
      // buttons.circle_plus,
    ],
  },
  {
    label: <CustomImage src={Grupo6142} width={6.68} height={18} />,
    name: 'Advanced',
    key: 'CALCULUS',
    buttons: [
      buttons.derivative,
      buttons.derivative_alpha,
      buttons.integral,
      buttons.integral_single,
      // buttons.integral_double,
      buttons.limit,
      buttons.sum_symbol,
      buttons.sum,
      buttons.sum_bottom,
      buttons.sum_upper,
      buttons.nabla,
      buttons.delta_value,
      buttons.nabla_times,
      buttons.delta_multiple,
      buttons.closed_contour,
      buttons.closed_surface,
      buttons.prod_symbol,
      buttons.prod,
      buttons.prod_bottom,
      buttons.prod_upper,
      buttons.fog,
    ],
  },
]
