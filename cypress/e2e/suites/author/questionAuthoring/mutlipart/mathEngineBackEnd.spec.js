const testdata = [
  ['M_3', '0.5', '\\frac{1}{2}', 'literal', 'false'],
  ['M_4', '-\\frac{1}{2}', '-\\frac{1}{2}', 'literal', 'true'],
  ['M_5', '-\\frac{1}{2}', '\\frac{-1}{2}', 'literal', 'false'],
  ['M_10', '1x+2', 'x+2', 'literal', 'false'],
  ['M_13', '.5', '0.5', 'literal', 'true'],
  ['M_17', '(2)', '2', 'literal', 'true'],
  ['M_19', '0.5', '0.5', 'literal:inverseResult', 'false'],
  ['M_20', '\\frac{1}{2}', '0.5', 'literal:inverseResult', 'true'],
  ['M_23', '4/2', '2', 'literal:inverseResult', 'true'],
  ['M_26', '0.5', '0.5', 'literal:ignoreTrailingZeros', 'true'],
  ['M_27', '0.500001', '0.5', 'literal:ignoreTrailingZeros', 'false'],
  ['M_30', '1,1+1', '1.1+1', "literal:setDecimalSeparator=','", 'true'],
  ['M_31', '2,1', '1.1+1', "literal:setDecimalSeparator=','", 'false'],
  [
    'M_36',
    '1 000 000',
    '1000000',
    "literal:setThousandsSeparator=[' ']",
    'true',
  ],
  [
    'M_37',
    '1 000 + x',
    '1000 + x',
    "literal:setThousandsSeparator=[',']",
    'false',
  ],
  ['M_40', 'x+y*z', '(x+y) \\times z', 'symbolic', 'false'],
  ['M_44', '\\frac{1}{10', '0.1', 'symbolic', 'false'],
  ['M_46', '\\frac{1}{10}', '0.1', 'symbolic', 'true'],
  ['M_51', '10,1\\%', '0,101', "symbolic:setDecimalSeparator=','", 'true'],
  [
    'M_55',
    '1, 2, 3',
    '1, 2, 3',
    "symbolic:setDecimalSeparator=','",
    'Parsing_Error',
  ],
  [
    'M_60',
    '\\frac{1}{1,000}',
    '0.001',
    "symbolic:setThousandsSeparator=[',']",
    'true',
  ],
  ['M_63', '30\\%+4.2=4.5', '0.3 + 4.2 = 4.5', 'symbolic:compareSides', 'true'],
  ['M_65', '3+3=7', '4 + 3 = 7', 'symbolic:compareSides', 'false'],
  ['M_69', 'x^2+xy+3x+3y', '', 'isExpanded', 'true'],
  ['M_71', '(x+3)(x+y)', '', 'isExpanded', 'false'],
  [
    'M_74',
    'x^2+xy+3,0x+3,0y',
    '',
    "isExpanded:setDecimalSeparator=','",
    'true',
  ],
  ['M_76', '(x+3,0)(x+y)', '', "isExpanded:setDecimalSeparator=','", 'false'],
  ['M_78', 'x^2+3,000x', '', "isExpanded:setThousandsSeparator=[',']", 'true'],
  [
    'M_80',
    '3 000y+3 000x+xy+x^2',
    '',
    "isExpanded:setThousandsSeparator=[' ']",
    'true',
  ],
  ['M_88', 'x^2+3x', '', 'isFactorised', 'false'],
  ['M_89', 'x(x-3)+2', '', 'isFactorised', 'false'],
  ['M_91', '(x+3)(x+y)', '', 'isFactorised', 'true'],
  ['M_95', '(x+y)(x+3)', '', "isFactorised:setDecimalSeparator=','", 'true'],
  [
    'M_99',
    'x(x-3)+2,000',
    '',
    "isFactorised:setThousandsSeparator=[' ']",
    'false',
  ],
  ['M_103', 'x^2+3x', '', 'isFactorised:inverseResult', 'true'],
  ['M_106', '(x+3)(x+y)', '', 'isFactorised:inverseResult', 'false'],
  ['M_107', '4x+1', '', 'isSimplified', 'true'],
  ['M_113', '4x+2,1+1,1', '', "isSimplified:setDecimalSeparator=','", 'false'],
  [
    'M_118',
    '4x+2+1,000',
    '',
    "isSimplified:setThousandsSeparator=[',']",
    'false',
  ],
  ['M_124', 'x(x)', '', 'isSimplified:inverseResult', 'true'],
  ['M_127', '1', '', 'isTrue', 'true'],
  ['M_128', '5>1', '', 'isTrue', 'true'],
  ['M_129', 'x', '', 'isTrue', 'true'],
  ['M_130', '1=2', '', 'isTrue', 'false'],
  ['M_131', '5<1', '', 'isTrue', 'false'],
  ['M_152', '1, 2, 3', '1, 2, 3', 'stringMatch', 'true'],
  [
    'M_162',
    '1, 2,  3',
    '1, 2, 3',
    'stringMatch:treatMultipleSpacesAsOne',
    'true',
  ],
  ['M_163', 'a', 'a', 'stringMatch:treatMultipleSpacesAsOne', 'false'],
  ['M_164', '\\dot', '\\cdot', 'stringMatch:treatMultipleSpacesAsOne', 'false'],
  [
    'M_165',
    '\\times',
    '\\cdot',
    'stringMatch:treatMultipleSpacesAsOne',
    'false',
  ],
  ['M_166', '*', '*', 'stringMatch:treatMultipleSpacesAsOne', 'true'],
  ['M_188', '10', '10', 'value:tolerance=1.6', 'true'],
  ['M_189', '11.6', '10', 'value:tolerance=1.6', 'true'],
  ['M_192', '11.7', '10', 'value:tolerance=1.6', 'false'],
  ['M_193', '11.7', '10', 'value:tolerance=1.6,inverseResult', 'true'],
  ['M_194', '8.4', '10', 'value:tolerance=1.6,inverseResult', 'false'],
  ['M_195', '2.165', '', 'syntax:isDecimal=3', 'true'],
  ['M_196', '3.14', '', 'syntax:isDecimal=3', 'false'],
  ['M_197', '1', '', 'syntax:isDecimal=3', 'false'],
  ['M_200', '-1/2', '', 'syntax:isSimpleFraction', 'true'],
  ['M_202', '-\\frac{1}{2}', '', 'syntax:isSimpleFraction', 'true'],
  ['M_204', '1\\frac{1}{2}', '', 'syntax:isSimpleFraction', 'false'],
  ['M_205', '1 1/2', '1 1/2', 'symbolic:isMixedFraction', 'true'],
  [
    'M_206',
    '1 \\frac{1}{2}',
    '1 \\frac{1}{2}',
    'symbolic:isMixedFraction',
    'true',
  ],
  [
    'M_208',
    '1\\frac{-1}{2}',
    '1\\frac{-1}{2}',
    'symbolic:isMixedFraction',
    'false',
  ],
  [
    'M_209',
    '1.0\\frac{1}{2}',
    '1.0\\frac{1}{2}',
    'symbolic:isMixedFraction',
    'false',
  ],
  ['M_210', 'e^x', '', 'syntax:isExponent', 'true'],
  ['M_212', '3.5^x', '', 'syntax:isExponent', 'true'],
  ['M_213', 'x^5', '', 'syntax:isExponent', 'false'],
  ['M_214', 'x^x', '', 'syntax:isExponent', 'false'],
  ['M_215', 'Ax+By=C', '', 'syntax:isStandardForm=linear', 'true'],
  ['M_216', '5x + 3y = 4', '', 'syntax:isStandardForm=linear', 'true'],
  ['M_217', '-x + y = 1', '', 'syntax:isStandardForm=linear', 'true'],
  [
    'M_218',
    '1\\frac{1}{2}x+\\frac{3}{5}y=1',
    '',
    'syntax:isStandardForm=linear',
    'true',
  ],
  ['M_220', 'Ax^2+Bx+C=0', '', 'syntax:isStandardForm=quadratic', 'true'],
  ['M_222', '5x^2 + 3x = 4', '', 'syntax:isStandardForm=quadratic', 'false'],
  [
    'M_224',
    '1.1x^2 + 3.3x + 4 = 0',
    '',
    'syntax:isStandardForm=quadratic',
    'true',
  ],
  ['M_225', 'y=ax+b', '', 'syntax:isSlopeInterceptForm', 'true'],
  ['M_226', 'y = -x + 1', '', 'syntax:isSlopeInterceptForm', 'true'],
  ['M_228', 'x+y=0', '', 'syntax:isSlopeInterceptForm', 'false'],
  ['M_229', 'x=y', '', 'syntax:isSlopeInterceptForm', 'false'],
  ['M_230', '(y-1)=2(x+3)', '', 'syntax:isPointSlopeForm', 'true'],
  ['M_231', 'y = -x + 1', '', 'syntax:isPointSlopeForm', 'false'],
  ['M_233', 'x+y=0', '', 'syntax:isPointSlopeForm', 'false'],
  ['M_234', '3y-1=x', '', 'syntax:isPointSlopeForm', 'false'],
  ['M_239', '[1.0, 2.0)', '[1, 2)', 'literal', 'false'],
  ['M_245', '10', '10', 'value:significantDecimalPlaces=3', 'true'],
  ['M_248', '9.9995', '10', 'value:significantDecimalPlaces=3', 'true'],
  ['M_250', '10.001', '10', 'value:significantDecimalPlaces=3', 'false'],
  ['M_251', '9.9994', '10', 'value:significantDecimalPlaces=3', 'false'],
  ['M_253', 'x+12', 'x+2', 'literal:ignoreCoefficientOfOne', 'false'],
  ['M_255', '1\\times x+2', 'x+2', 'literal:ignoreCoefficientOfOne', 'true'],
  ['M_262', '1+x+x+x^2', 'x^2+2x+1', 'literal:ignoreOrder', 'false'],
  ['M_280', 'x(x+3/12)', 'x^2 + x/4', 'symbolic;isSimplified', 'false'],
  ['M_285', '7/4', '1 3/4', 'symbolic:isMixedFraction,isSimplified', 'false'],
  ['M_289', '3+3=6', '4 + 3 = 7', 'symbolic', 'true'],
  ['M_291', '10+1/2', '10.5', 'symbolic', 'true'],
  ['M_304', '-3,3', '3,-3', 'setEvaluation', 'true'],
  ['M_305', '-6,-3,3', '3,-3', 'setEvaluation', 'false'],
  ['M_306', '-6,-3,3', '3,6,-3', 'setEvaluation', 'false'],
  ['M_331', '-2\\frac{1}{2}', '-5/2', 'symbolic', 'true'],
  [
    'M_333',
    '2\\frac{1}{2}',
    '\\frac{5}{2}',
    'symbolic:isMixedFraction',
    'true',
  ],
  ['M_337', '1000.000', '1000', 'literal:ignoreTrailingZeros', 'true'],
  ['M_342', '3x+y', 'x+x+x+y', 'symbolic;isSimplified', 'true'],
  ['M_344', '\\left(2\\right)', '2', 'literal', 'true'],
  ['M_345', '\\left(2\\right)', '3', 'literal', 'false'],
  ['M_346', 'x\\left(x+3\\right)', '', 'isExpanded', 'false'],
  ['M_353', '\\ln e^x', 'x', 'symbolic:allowEulersNumber', 'true'],
  [
    'M_356',
    '\\ln e^x = 1',
    'x-1 = 0',
    'symbolic:allowEulersNumber,compareSides',
    'false',
  ],
  [
    'M_357',
    '\\log 10 + \\ln e^x = 0',
    '1 = -x',
    'symbolic:allowEulersNumber',
    'true',
  ],
  ['M_401', '{x | x<2}', '(-\\infty,2)', 'literal', 'false'],
  ['M_413', '\\frac{1}{2}', '\\frac{3}{6}', 'symbolic:isSimplified', 'true'],
  ['M_420', '1e-2', '0.01', 'literal', 'false'],
  ['M_425', 'x+1 < y', 'x-y+1<0', 'symbolic', 'true'],
  ['M_431', 'x+1 < y', 'x+1>y', 'symbolic:compareSides', 'false'],
  [
    'M_444',
    '1, 2, 3 ',
    '1, 2, 3',
    'stringMatch:ignoreLeadingAndTrailingSpaces',
    'true',
  ],
  [
    'M_445',
    '1, 2,  3',
    '1, 2, 3',
    'stringMatch:treatMultipleSpacesAsOne',
    'true',
  ],
  ['M_447', 'x^2-4x+4', '', 'isFactorised:integerType', 'false'],
  ['M_448', 'x^2+1.5x+4.4', '', 'isFactorised:realType', 'false'],
  ['M_449', '[1, 2)', '[1, 2)', 'symbolic', 'true'],
  ['M_451', '[1.1, 2.2)', '[1.1, 2.2)', 'symbolic', 'true'],
  ['M_458', '[1.1, 2.2)', '[1.1, 2.2)', 'literal', 'true'],
  ['M_460', '1\\frac{-1}{2}', '', 'syntax:isMixedFraction', 'false'],
  ['M_461', '1 1/2', '', 'syntax:isMixedFraction', 'true'],
  ['M_462', '-1/2', '', 'syntax:isSimpleFraction', 'true'],
  ['M_465', '1000', '1 000', "value:setThousandsSeparator=' '", 'true'],
  ['M_466', '1000', '1,000', "value:setThousandsSeparator=','", 'true'],
  ['M_467', '1.2', '', 'isRationalized', 'false'],
  ['M_471', '1/-2', '', 'isRationalized', 'false'],
  ['M_472', '-1/-2', '', 'isRationalized', 'false'],
  ['M_474', '5', '', 'isRationalized', 'true'],
  ['M_475', '2/1^{0.5}', '', 'isRationalized', 'false'],
  ['M_477', '2^{0.7}/2', '', 'isRationalized', 'true'],
  ['M_479', '2/\\sqrt{2}', '', 'isRationalized', 'false'],
  ['M_486', '\\$128', '\\$128', 'symbolic', 'true'],
  ['M_489', 'y>x', 'y=x', 'symbolic', 'false'],
  ['M_491', 'y=x+3', 'y<x+3', 'symbolic:compareSides', 'false'],
  ['M_494', '128^{\\circ}', '128^{\\circ}', 'symbolic', 'true'],
  ['M_496', '6/10', '\\frac{3}{5}', 'symbolic', 'true'],
  ['M_498', 'y>x', 'y<x', 'symbolic', 'false'],
  ['M_499', 'y \\ge x', 'y \\le x', 'symbolic', 'false'],
  ['M_501', 'x^2+3x', 'x^2+3x', 'symbolic:isExpanded', 'true'],
  ['M_512', '*', '*', 'stringMatch:treatMultipleSpacesAsOne', 'true'],
  [
    'M_525',
    '\\frac{d}{dx}e^{-x^2}',
    '-2xe^{-x^2}',
    'symbolic:allowEulersNumber',
    'true',
  ],
  [
    'M_528',
    '\\frac{d}{dx}\\left(\\frac{x+1}{x+2}\\right)',
    '\\frac{(x+2)-(x+1)}{(x+2)^2}',
    'symbolic',
    'true',
  ],
  [
    'M_530',
    '\\frac{d}{dx}\\left(\\frac{x+1}{x+2}\\right)',
    '\\frac{1}{x^2+4x+4}',
    'symbolic',
    'true',
  ],
  ['M_532', '\\int \\frac{1}{x}dx', '\\ln(x)', 'symbolic', 'true'],
  [
    'M_533',
    '\\int \\frac{x}{x^2+1}dx',
    '\\frac{1}{2}\\ln(x^2+1)',
    'symbolic',
    'true',
  ],
  ['M_537', '\\int\\ln(x)dx', 'x(\\ln(x)-1)', 'symbolic', 'true'],
  ['M_539', '\\int\\ln(x)dx', 'x\\ln(x)-x', 'symbolic', 'true'],
  ['M_541', '\\int_2^{+\\infty}\\frac{1}{x^2}dx', '1/2', 'symbolic', 'true'],
  ['M_543', '\\int_2^{+\\infty}\\frac{1}{x^2}dx', '0.5', 'symbolic', 'true'],
  [
    'M_545',
    '\\sum_{n=1}^{\\infty} \\frac{1}{n}',
    '\\infty',
    'symbolic',
    'true',
  ],
  [
    'M_547',
    '\\lim_{x\\to\\infty}\\cfrac{2x^3-x^2+1}{5x^3+x-8}',
    '2/5',
    'symbolic',
    'true',
  ],
  [
    'M_549',
    '\\lim_{x\\to\\infty}\\cfrac{2x^3-x^2+1}{5x^3+x-8}',
    '0.4',
    'symbolic',
    'true',
  ],
  [
    'M_551',
    '\\lim_{x\\to 2^+}\\cfrac{-3x+4x^2}{(-2+x)^7}',
    '+\\infty',
    'symbolic',
    'true',
  ],
  ['M_571', '5', '', 'syntax:integerType', 'true'],
  ['M_573', '5', '', 'syntax:numberType', 'true'],
  ['M_577', '6', '', 'syntax:variableType', 'false'],
  ['M_579', '1.3 \\times 10^{-2}', '', 'syntax:scientificType', 'true'],
  ['M_580', '10 \\times 10^2', '', 'syntax:scientificType', 'false'],
  ['M_588', 'x\\ge 12', 'x \\ge 12', 'symbolic', 'true'],
  ['M_589', 'x\\geq 12', 'x \\ge 12', 'symbolic', 'true'],
  ['M_590', 'x\\leq 12', 'x \\leq 12', 'symbolic', 'true'],
  ['M_591', 'x\\leq 12', 'x \\le 12', 'symbolic', 'true'],
  [
    'M_605',
    '1.001,0',
    '1.000,0',
    "symbolic:setThousandsSeparator=['.'],setDecimalSeparator=[',']",
    'false',
  ],
  [
    'M_607',
    '1,000.60',
    '1000.50',
    "symbolic:setThousandsSeparator=['.'],setDecimalSeparator=[',']",
    'false',
  ],
  [
    'M_609',
    '1.000',
    '1',
    "symbolic:setThousandsSeparator=['.'],setDecimalSeparator=[',']",
    'false',
  ],
  [
    'M_610',
    '1.000',
    '1',
    "symbolic:setThousandsSeparator=[','],setDecimalSeparator=['.']",
    'true',
  ],
  ['M_642', '234,1', '(1,234)', 'symbolic:interpretAsList', 'false'],
  ['M_646', '234,1,567', '{1,234,567}', 'symbolic', 'true'],
  ['M_649', '234,567,0', '0,234,567', 'symbolic:interpretAsList', 'false'],
  ['M_681', '2,x + 1,3', '(x + 1,2,3)', 'symbolic:interpretAsSet', 'true'],
  ['M_686', '(x,y),(w,z)', '{(x,y),(w,z)}', 'symbolic', 'true'],
  ['M_700', '(5,4]', '[5,4]', 'symbolic', 'Interval incorrectly defined'],
  ['M_707', '{2,3}', '(2, 3)', 'symbolic', 'false'],
  ['M_727', '3 2 1', '6', 'symbolic', 'false'],
  ['M_783', '(2 , 3 )', '(  2  ,  3  )', 'symbolic', 'true'],
  ['M_802', '2/\\sqrt{9}', '2/3', 'symbolic:isRationalized', 'false'],
  ['M_809', '2/5', '2/5', 'symbolic:isRationalized,inverseResult', 'false'],
  ['M_823', '\\frac{1}{2}', '\\frac{1}{2}', 'symbolic:isRational', 'true'],
  ['M_835', '90°', '90°', 'value', 'true'],
  [
    'M_837',
    '24 square centimeters',
    '24  \\textit{square} \\textit{centimeters}',
    'value',
    'true',
  ],
  ['M_849', '3 x', '3x', 'value', 'true'],
  ['M_851', '1,1 1', '1', 'value', 'false'],
  ['M_852', '2*3', '6', 'value', 'true'],
  ['M_855', '2,1,3', '(1,2,3)', 'value', 'false'],
  ['M_857', '1', '(1,2,3)', 'value', 'false'],
  ['M_859', '1,2,3', '(1 ,2,3 )', 'value', 'true'],
  ['M_861', '1,2,3', '( 1 ,2,3 )', 'value', 'true'],
  ['M_865', '1 ,  2,3', '(1,2,3)', 'value', 'true'],
  ['M_872', '1,2', '1,2', 'value:interpretAsList', 'true'],
  ['M_873', '1,2', '{1,2}', 'value:interpretAsList', 'true'],
  ['M_874', '2,1', '{1,2}', 'value:interpretAsList', 'false'],
  ['M_878', '1,234', '(1,234)', 'value:interpretAsList', 'true'],
  ['M_879', '234,1', '(1,234)', 'value:interpretAsList', 'false'],
  ['M_881', '234,1', '(1,234)', 'value:interpretAsSet', 'true'],
  ['M_884', '234,1,567', '1,234,567', 'value:interpretAsList', 'false'],
  ['M_887', '0,234,567', '0,234,567', 'value:interpretAsList', 'true'],
  ['M_889', '0,1,2', '{0,1,2}', 'value', 'true'],
  ['M_891', '0 1,2', '{0,1,2}', 'value', 'false'],
  ['M_893', '0,2,1', '{0,1,2}', 'value', 'true'],
  ['M_895', '0,2,1', '{0,1,2', 'value', 'Parentheses_Error'],
  ['M_897', '{0,2,1', '{0,1,2}', 'value', 'false'],
  ['M_899', '0 2 1', '{0,1,2}', 'value', 'false'],
  ['M_901', '-1', '{-1}', 'value', 'true'],
  ['M_903', '-1,2', '{-1,1}', 'value', 'false'],
  ['M_905', '-1,2', '(-1,2)', 'value:interpretAsSet', 'true'],
  ['M_907', '1,2,1', '(1,2,1)', 'value:interpretAsSet', 'true'],
  ['M_908', '1,1,2,1', '(1,2,1)', 'value:interpretAsSet', 'false'],
  ['M_910', '1,1,2,1', '(1,1,2,1)', 'value:interpretAsList', 'true'],
  ['M_912', 'x,2', '(x,2)', 'value:interpretAsSet', 'true'],
  ['M_913', 'x+1,2', '(x+1,2)', 'value:interpretAsSet', 'true'],
  ['M_915', '2,x + 1', '(x+1,2)', 'value:interpretAsSet', 'true'],
  ['M_918', '2,x + 1,3', '(x + 1,2,3)', 'value:interpretAsSet', 'true'],
  ['M_921', 'x + 1,2,3', '{x + 1,3,2}', 'value:interpretAsList', 'false'],
  ['M_922', 'x + 1,2 3', '{x + 1,3,2}', 'value:interpretAsList', 'false'],
  ['M_924', '(x,y),(w,z)', '{(x,y),(w,z)}', 'value', 'true'],
  ['M_926', '(x,y), (w,z)', '{(x,y), (w ,z)}', 'value', 'true'],
  ['M_927', '(x,y) (w,z)', '{(x,y), (w ,z)}', 'value', 'false'],
  ['M_928', '(w,z),(x,y)', '((x,y),(w,z))', 'value', 'false'],
  ['M_930', '+-(x,y),(w,z)', '{(x,y),(w,z)}', 'value:interpretAsSet', 'true'],
  ['M_935', '[4,5)', '[4,5)', 'value', 'true'],
  ['M_940', '2,5', '[5,4]', 'value:interpretAsSet', 'false'],
  ['M_946', '(5,4,3)', '(5,4,3)', 'value', 'true'],
  ['M_948', '(5,4,3)', '(5,4,3)', 'value', 'true'],
  ['M_952', '(3, 2, 4)', '{2, 3, 4}', 'value:interpretAsSet', 'true'],
  ['M_970', '1,2,3', '( 1 ,  2,3 )', 'value', 'true'],
  ['M_985', '(1,2)', '(1,2)', 'value:interpretAsSet', 'true'],
  ['M_986', '(1,2)', '(2,1)', 'value:interpretAsList', 'false'],
  ['M_989', '(1,1+x,3)', '(1,1+x,3)', 'value', 'true'],
  ['M_992', '{{1,2}, {3,4}}', '{{1,2}, {3,4}}', 'value', 'true'],
  ['M_1003', '1,23,000', '1,234,000', 'value', 'false'],
  ['M_1005', ',234,000', ',234,000', 'value', 'Parsing_Error'],
  ['M_1006', ',234,000,', ',234,000,', 'value', 'Parsing_Error'],
  ['M_1007', '110,234', '234,110', 'value:interpretAsSet', 'true'],
  ['M_1008', '234,00', '234,00', 'value', 'Parsing_Error'],
  ['M_1009', '234,1', '234,1', 'value:interpretAsList', 'true'],
  ['M_1014', '{2,3}', '( 2 ,  3  )', 'value', 'false'],
  ['M_1016', '{2,3}', '(  2  ,  3  )', 'value', 'false'],
  ['M_1019', '(2 , 3)', '(  2  ,  3  )', 'value', 'true'],
  ['M_1099', '2\\pi\\theta', '2\\pi\\theta', 'literal', 'true'],
  ['M_1130', 'none ', 'none', 'literal', 'true'],
  [
    'M_1338',
    '\\left(\\sqrt{\\left\\{85\\right\\}},0\\right),\\left(-\\sqrt{\\left\\{85\\right\\}},0\\right)',
    '\\left(\\sqrt{\\left\\{85\\right\\}},0\\right),\\left(-\\sqrt{\\left\\{85\\right\\}},0\\right)',
    'symbolic:interpretAsSet',
    'true',
  ],
  [
    'M_1339',
    '\\left(\\sqrt{85},0\\right),\\left(-\\sqrt{85},0\\right)',
    '\\left(\\sqrt{85},0\\right),\\left(-\\sqrt{85},0\\right)',
    'symbolic:interpretAsSet',
    'true',
  ],
  [
    'M_1340',
    '\\left(9,0\\right),\\left(-9,0\\right)',
    '\\left(9,0\\right),\\left(-9,0\\right)',
    'symbolic:interpretAsSet',
    'true',
  ],
  [
    'M_1341',
    '\\left(85,0\\right),\\left(-85,0\\right)',
    '\\left(85,0\\right),\\left(-85,0)',
    'symbolic:interpretAsSet',
    'true',
  ],
  [
    'M_1342',
    'y=\\frac{4x}{81},y=-\\frac{4x}{81}',
    'y=\\frac{4x}{81},y=-\\frac{4x}{81}',
    'symbolic:interpretAsSet',
    'true',
  ],
  [
    'M_1343',
    '\\frac{4x}{81},-\\frac{4x}{81}',
    '\\frac{4x}{81},-\\frac{4x}{81}',
    'symbolic:interpretAsSet',
    'true',
  ],
  [
    'M_1345',
    '\\frac{1}{2},-\\frac{1}{2}',
    '\\frac{1}{2},-\\frac{1}{2}',
    'symbolic:interpretAsSet',
    'true',
  ],
  ['M_1374', '(3,4),(2,3)', '{(2,3),(3,4),(-1,0)}', 'symbolic', 'false'],
  ['M_1375', '(-1,0),(3,4),(2,3)', '{(2,3),(3,4),(-1,0)}', 'symbolic', 'true'],
  [
    'M_1380',
    '(0,1),(-1,0],(3,4),(2,3)',
    '{(0,1),(2,3),(3,4),(-1,0]}',
    'symbolic',
    'true',
  ],
  [
    'M_1381',
    '(0,1),(-1,0],(3,4),(2,3)',
    '((0,1),(2,3),(3,4),(-1,0])',
    'symbolic',
    'false',
  ],
  [
    'M_1659',
    '4\\cdot(94/100)^x',
    '4(1-6/100)^x',
    'symbolic:isSimplified',
    'false',
  ],
  [
    'M_1660',
    '4\\cdot(47/50)^x',
    '4(1-6/100)^x',
    'symbolic:isSimplified',
    'true',
  ],
]

const results = []

const envUrl = 'https://edulastic-poc.snapwiz.net'
// const envUrl = "https://v2.edulastic.com";

describe('math test case', () => {
  testdata.forEach((testcase, i) => {
    const [ID, input, expected, checks, result] = testcase
    const payLoadbody = { input, expected, checks }
    it(`testing case ${i + 1}-${ID}`, () => {
      console.log('test case = ', testcase)
      cy.request({
        url: `${envUrl}/math-api/evaluate`,
        method: 'POST',
        body: payLoadbody,
        headers: {
          'Content-Type': 'application/json',
          'cache-control': 'no-cache',
        },
        failOnStatusCode: false,
      }).then(({ body, status }) => {
        const afterrun = testcase
        testcase.push(body.result)
        results.push(afterrun)
        console.log('result', status, body)
        expect(status).to.eq(200)
        expect(body.result).to.eq(result)
      })
    })
  })
})

describe('save', () => {
  it('write result', () => {
    console.log('results', JSON.stringify(results))
    cy.writeFile(
      'cypress/fixtures/mathengine/back-end-test-result.txt',
      results
    )
  })
})
