/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconNewFeatureIndicator = (props) => (
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 38 24"
    width="38"
    height="24"
    {...props}
  >
    <path
      d="M8 6.5H5.07208C5.02903 6.5 4.99082 6.52754 4.97721 6.56838L4.5 8L0.764355 7.16986C0.562173 7.12493 0.433398 7.37922 0.589267 7.51561L4 10.5L2.6535 10.9488C2.58298 10.9723 2.56185 11.0618 2.61441 11.1144L4 12.5L1.94522 14.1438C1.79759 14.2619 1.8811 14.5 2.07016 14.5H3.71922C4.17809 14.5 4.57807 14.8123 4.68937 15.2575L4.98545 16.4418C4.9944 16.4776 5.02238 16.5056 5.05821 16.5146L7 17L5.79076 19.0154C5.6791 19.2015 5.84134 19.4317 6.05416 19.3892L10.5 18.5L11.5 20L14.5 19L15.8987 21.7974C15.9525 21.905 16.0884 21.9411 16.1885 21.8743L19 20L21.2273 23.1182C21.3436 23.281 21.5945 23.248 21.6648 23.0606L23 19.5L25.9362 19.9894C25.975 19.9958 26.014 19.9789 26.0359 19.9462L27 18.5L30.126 20.2863C30.2926 20.3815 30.5 20.2612 30.5 20.0692V16.5H32.9C32.9552 16.5 33 16.4552 33 16.4V15L36.3684 15.7485C36.6311 15.8069 36.7879 15.466 36.5727 15.3045L33.5 13L35.3869 11.5848C35.4421 11.5434 35.4398 11.4599 35.3824 11.4216L34 10.5L34.4758 9.07246C34.4901 9.02968 34.474 8.98265 34.4364 8.95763L33 8L36.2883 4.71173C36.4726 4.52741 36.2871 4.21935 36.038 4.29601L30.5 6L30.0228 4.56838C30.0092 4.52754 29.971 4.5 29.9279 4.5H27V1.90451C27 1.71866 26.8044 1.59779 26.6382 1.6809L23 3.5L21.0402 2.52008C21.0146 2.50731 20.9848 2.50607 20.9583 2.51668L18.5 3.5L16.6854 0.324465C16.6062 0.185773 16.4043 0.191375 16.3329 0.33425L14.5 4L12.0612 3.02449C12.0241 3.00963 11.9817 3.01834 11.9534 3.04663L10.5 4.5L8.42678 2.42678C8.26929 2.26929 8 2.38083 8 2.60355V6.5Z"
      fill="#DF0000"
    />
    <path
      d="M13.56 8C13.72 8 13.85 8.05333 13.95 8.16C14.05 8.26667 14.1 8.4 14.1 8.56V14.39C14.1 14.5633 14.04 14.71 13.92 14.83C13.8067 14.9433 13.6633 15 13.49 15C13.4033 15 13.3133 14.9867 13.22 14.96C13.1333 14.9267 13.0667 14.8833 13.02 14.83L9.09 9.84L9.35 9.68V14.44C9.35 14.6 9.29667 14.7333 9.19 14.84C9.09 14.9467 8.95667 15 8.79 15C8.63 15 8.5 14.9467 8.4 14.84C8.3 14.7333 8.25 14.6 8.25 14.44V8.61C8.25 8.43667 8.30667 8.29333 8.42 8.18C8.54 8.06 8.68667 8 8.86 8C8.95333 8 9.05 8.02 9.15 8.06C9.25 8.09333 9.32333 8.14667 9.37 8.22L13.18 13.08L13.01 13.2V8.56C13.01 8.4 13.06 8.26667 13.16 8.16C13.26 8.05333 13.3933 8 13.56 8ZM16.2135 8H19.5635C19.7368 8 19.8802 8.05667 19.9935 8.17C20.1135 8.27667 20.1735 8.41667 20.1735 8.59C20.1735 8.75667 20.1135 8.89333 19.9935 9C19.8802 9.1 19.7368 9.15 19.5635 9.15H16.7635L16.8535 8.98V10.93L16.7735 10.85H19.1135C19.2868 10.85 19.4302 10.9067 19.5435 11.02C19.6635 11.1267 19.7235 11.2667 19.7235 11.44C19.7235 11.6067 19.6635 11.7433 19.5435 11.85C19.4302 11.95 19.2868 12 19.1135 12H16.8035L16.8535 11.92V13.94L16.7735 13.85H19.5635C19.7368 13.85 19.8802 13.91 19.9935 14.03C20.1135 14.1433 20.1735 14.2767 20.1735 14.43C20.1735 14.5967 20.1135 14.7333 19.9935 14.84C19.8802 14.9467 19.7368 15 19.5635 15H16.2135C16.0402 15 15.8935 14.9433 15.7735 14.83C15.6602 14.71 15.6035 14.5633 15.6035 14.39V8.61C15.6035 8.43667 15.6602 8.29333 15.7735 8.18C15.8935 8.06 16.0402 8 16.2135 8ZM29.1962 7.97C29.3495 7.97 29.4962 8.03 29.6362 8.15C29.7762 8.26333 29.8462 8.42 29.8462 8.62C29.8462 8.68 29.8362 8.74667 29.8162 8.82L27.8462 14.62C27.8062 14.74 27.7328 14.8333 27.6262 14.9C27.5262 14.96 27.4195 14.9933 27.3062 15C27.1928 15 27.0795 14.9667 26.9662 14.9C26.8595 14.8333 26.7762 14.7367 26.7162 14.61L25.2362 11.25L25.3262 11.31L23.8662 14.61C23.8062 14.7367 23.7195 14.8333 23.6062 14.9C23.4995 14.9667 23.3895 15 23.2762 15C23.1695 14.9933 23.0628 14.96 22.9562 14.9C22.8495 14.8333 22.7762 14.74 22.7362 14.62L20.7662 8.82C20.7462 8.74667 20.7362 8.68 20.7362 8.62C20.7362 8.42 20.8062 8.26333 20.9462 8.15C21.0928 8.03 21.2428 7.97 21.3962 7.97C21.5228 7.97 21.6395 8.00333 21.7462 8.07C21.8595 8.13667 21.9362 8.23333 21.9762 8.36L23.5662 13.18L23.3462 13.17L24.7662 9.76C24.8195 9.64 24.8962 9.54667 24.9962 9.48C25.0962 9.40667 25.2095 9.37333 25.3362 9.38C25.4628 9.37333 25.5762 9.40667 25.6762 9.48C25.7762 9.54667 25.8495 9.64 25.8962 9.76L27.1962 13.02L27.0362 13.12L28.6062 8.36C28.6462 8.23333 28.7228 8.13667 28.8362 8.07C28.9495 8.00333 29.0695 7.97 29.1962 7.97Z"
      fill="white"
    />
  </SVG>
)

export default withIconStyles(IconNewFeatureIndicator)