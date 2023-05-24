/* eslint-disable react/prop-types */
import React from 'react'
import withIconStyles from './HOC/withIconStyles'
import SVG from './common/SVG'

const IconPerformanceTrendAddOn = (props) => (
  <SVG
    width="92"
    height="81"
    viewBox="0 0 92 81"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M46.0075 0.515038L42.4824 1.45993L6.92029 10.994L3.39511 11.9389C2.34912 12.2436 1.46308 12.944 0.925085 13.8913C0.387088 14.8387 0.239505 15.9584 0.513675 17.0128L13.4166 69.0267C13.5347 69.547 13.7557 70.0385 14.0666 70.4721C14.3775 70.9058 14.7719 71.2729 15.2268 71.5519C15.6816 71.8309 16.1876 72.0161 16.7151 72.0966C17.2425 72.1771 17.7808 72.1513 18.2982 72.0208H18.3058L60.9013 60.6023H60.909C61.9549 60.2973 62.8407 59.5967 63.3784 58.6492C63.9161 57.7017 64.0634 56.5819 63.7889 55.5276L50.8891 3.5099C50.771 2.9895 50.5501 2.49797 50.2393 2.06422C49.9284 1.63047 49.534 1.26328 49.0791 0.984231C48.6243 0.705183 48.1182 0.519917 47.5907 0.43934C47.0632 0.358764 46.5249 0.384502 46.0075 0.515038Z"
      fill="white"
    />
    <path
      d="M47.0078 4.98875e-05C47.9964 0.0124396 48.9524 0.355638 49.7232 0.974867C50.4939 1.5941 51.0351 2.45367 51.2602 3.4164L64.1631 55.431C64.4594 56.5826 64.2962 57.8042 63.708 58.8375C63.1197 59.8709 62.1526 60.6348 61.0111 60.9679H61.0035L18.3995 72.3863C18.0408 72.4823 17.6711 72.5309 17.2998 72.5312C16.3112 72.5188 15.3552 72.1756 14.5844 71.5564C13.8136 70.9371 13.2725 70.0776 13.0474 69.1148L0.144499 17.1002C-0.151842 15.9487 0.0113713 14.727 0.599619 13.6937C1.18787 12.6604 2.155 11.8964 3.29645 11.5634L45.905 0.139523C46.2649 0.0451391 46.6357 -0.00174958 47.0078 4.98875e-05ZM17.2967 71.7694C17.601 71.7692 17.904 71.7293 18.198 71.6507H18.2049L60.8088 60.2322C61.7568 59.9518 62.5587 59.3138 63.0449 58.4531C63.5312 57.5923 63.6636 56.5762 63.4144 55.6196L50.5115 3.60569C50.3275 2.80894 49.882 2.09678 49.2459 1.58284C48.6099 1.06891 47.82 0.782822 47.0024 0.770226C46.6981 0.770457 46.3952 0.810388 46.1012 0.889008L3.49263 12.3121C2.54463 12.5924 1.74277 13.2304 1.25654 14.0912C0.77032 14.9519 0.637833 15.968 0.887079 16.9247L13.79 68.9386C13.9748 69.7341 14.4204 70.4449 15.0558 70.9579C15.6913 71.4709 16.4801 71.7566 17.2967 71.7694Z"
      fill="#E5E5E5"
    />
    <path
      d="M54.2648 5.46944L50.7397 6.41433L15.1776 15.9484L11.6524 16.8933C10.6064 17.198 9.72041 17.8984 9.18241 18.8457C8.64441 19.7931 8.49683 20.9128 8.771 21.9672L21.6739 73.9811C21.792 74.5014 22.013 74.9929 22.3239 75.4265C22.6348 75.8602 23.0292 76.2273 23.4841 76.5063C23.9389 76.7853 24.4449 76.9705 24.9724 77.051C25.4999 77.1315 26.0381 77.1057 26.5555 76.9752H26.5631L69.1587 65.5567H69.1663C70.2122 65.2517 71.098 64.5511 71.6357 63.6036C72.1734 62.6561 72.3207 61.5363 72.0462 60.482L59.1464 8.4643C59.0284 7.9439 58.8074 7.45236 58.4966 7.01862C58.1858 6.58487 57.7913 6.21768 57.3365 5.93863C56.8816 5.65958 56.3756 5.47432 55.8481 5.39374C55.3206 5.31316 54.7822 5.3389 54.2648 5.46944Z"
      fill="white"
    />
    <path
      d="M55.2651 4.95444C56.2537 4.96683 57.2097 5.31003 57.9805 5.92926C58.7513 6.54849 59.2924 7.40806 59.5175 8.37079L72.4204 60.3854C72.7168 61.5369 72.5535 62.7586 71.9653 63.7919C71.377 64.8252 70.4099 65.5892 69.2685 65.9223H69.2608L26.6568 77.3407C26.2981 77.4367 25.9284 77.4853 25.5571 77.4856C24.5685 77.4732 23.6125 77.13 22.8417 76.5108C22.071 75.8915 21.5298 75.032 21.3047 74.0692L8.40182 22.0546C8.10548 20.9031 8.2687 19.6814 8.85694 18.6481C9.44519 17.6148 10.4123 16.8508 11.5538 16.5178L54.1623 5.09391C54.5223 4.99953 54.893 4.95264 55.2651 4.95444ZM25.5541 76.7238C25.8584 76.7236 26.1613 76.6837 26.4553 76.605H26.4622L69.0661 65.1866C70.0141 64.9062 70.816 64.2682 71.3022 63.4075C71.7885 62.5467 71.921 61.5306 71.6717 60.574L58.7688 8.56008C58.5848 7.76333 58.1393 7.05117 57.5032 6.53724C56.8672 6.0233 56.0774 5.73721 55.2597 5.72462C54.9555 5.72485 54.6525 5.76478 54.3585 5.8434L11.75 17.2665C10.8019 17.5468 10.0001 18.1848 9.51387 19.0456C9.02764 19.9063 8.89516 20.9224 9.1444 21.8791L22.0473 73.893C22.2321 74.6885 22.6777 75.3993 23.3132 75.9123C23.9486 76.4253 24.7375 76.711 25.5541 76.7238Z"
      fill="#E5E5E5"
    />
    <path
      d="M52.9738 22.4247L31.4251 27.9815C31.1863 28.0383 30.9347 27.9991 30.7244 27.8724C30.5142 27.7457 30.3621 27.5415 30.3007 27.3038C30.2394 27.0661 30.2738 26.8139 30.3964 26.6012C30.5191 26.3886 30.7203 26.2326 30.9568 26.1668L52.5048 20.61C52.6248 20.5766 52.7503 20.5675 52.8739 20.5831C52.9975 20.5988 53.1167 20.6389 53.2246 20.7011C53.3325 20.7634 53.427 20.8466 53.5023 20.9457C53.5777 21.0449 53.6326 21.1581 53.6637 21.2788C53.6948 21.3994 53.7016 21.525 53.6836 21.6483C53.6656 21.7716 53.6232 21.89 53.5589 21.9967C53.4946 22.1034 53.4097 22.1962 53.3091 22.2697C53.2085 22.3432 53.0942 22.3959 52.973 22.4247H52.9738Z"
      fill="#F2F2F2"
    />
    <path
      d="M57.6323 24.6157L32.343 31.138C32.1042 31.1948 31.8527 31.1556 31.6424 31.0289C31.4322 30.9022 31.28 30.6981 31.2187 30.4604C31.1574 30.2227 31.1917 29.9704 31.3144 29.7578C31.4371 29.5452 31.6383 29.3892 31.8748 29.3233L57.1641 22.801C57.2841 22.7676 57.4096 22.7584 57.5332 22.7741C57.6568 22.7897 57.776 22.8299 57.8839 22.8921C57.9918 22.9544 58.0862 23.0375 58.1616 23.1367C58.237 23.2359 58.2919 23.3491 58.323 23.4697C58.3541 23.5904 58.3609 23.716 58.3429 23.8393C58.3249 23.9625 58.2825 24.081 58.2182 24.1877C58.1539 24.2944 58.0689 24.3872 57.9683 24.4607C57.8677 24.5342 57.7535 24.5869 57.6323 24.6157Z"
      fill="#F2F2F2"
    />
    <path
      d="M56.6836 36.6856L35.138 42.2423C34.8991 42.2991 34.6476 42.2599 34.4373 42.1332C34.2271 42.0065 34.0749 41.8023 34.0136 41.5646C33.9523 41.3269 33.9866 41.0747 34.1093 40.8621C34.232 40.6495 34.4332 40.4934 34.6697 40.4276L56.2123 34.8709C56.4512 34.8141 56.7027 34.8532 56.913 34.98C57.1232 35.1067 57.2753 35.3108 57.3367 35.5485C57.398 35.7862 57.3636 36.0385 57.2409 36.2511C57.1183 36.4637 56.9171 36.6197 56.6806 36.6856H56.6836Z"
      fill="#F2F2F2"
    />
    <path
      d="M61.353 38.8804L36.0637 45.4027C35.8249 45.4595 35.5733 45.4203 35.3631 45.2936C35.1529 45.1669 35.0007 44.9628 34.9394 44.7251C34.8781 44.4874 34.9124 44.2351 35.0351 44.0225C35.1578 43.8099 35.359 43.6539 35.5955 43.588L60.8847 37.0657C61.1236 37.0089 61.3752 37.0481 61.5854 37.1748C61.7956 37.3015 61.9478 37.5056 62.0091 37.7433C62.0704 37.981 62.0361 38.2333 61.9134 38.4459C61.7907 38.6585 61.5895 38.8145 61.353 38.8804Z"
      fill="#F2F2F2"
    />
    <path
      d="M60.3925 50.9449L38.8445 56.5016C38.6057 56.5584 38.3541 56.5193 38.1439 56.3925C37.9336 56.2658 37.7815 56.0617 37.7202 55.824C37.6588 55.5863 37.6932 55.334 37.8159 55.1214C37.9386 54.9088 38.1398 54.7528 38.3763 54.6869L59.9242 49.1302C60.0443 49.0968 60.1697 49.0876 60.2933 49.1033C60.4169 49.1189 60.5362 49.159 60.6441 49.2213C60.752 49.2836 60.8464 49.3667 60.9218 49.4659C60.9972 49.5651 61.052 49.6783 61.0832 49.7989C61.1143 49.9195 61.121 50.0452 61.1031 50.1685C61.0851 50.2917 61.0427 50.4102 60.9784 50.5169C60.9141 50.6236 60.8291 50.7164 60.7285 50.7899C60.6279 50.8634 60.5137 50.9161 60.3925 50.9449Z"
      fill="#F2F2F2"
    />
    <path
      d="M65.0726 53.1512L39.7834 59.6735C39.6633 59.7069 39.5379 59.7161 39.4143 59.7004C39.2907 59.6848 39.1714 59.6447 39.0635 59.5824C38.9556 59.5201 38.8612 59.437 38.7858 59.3378C38.7104 59.2386 38.6556 59.1254 38.6244 59.0048C38.5933 58.8842 38.5866 58.7585 38.6046 58.6352C38.6226 58.512 38.6649 58.3935 38.7292 58.2868C38.7935 58.1801 38.8785 58.0873 38.9791 58.0138C39.0797 57.9403 39.1939 57.8876 39.3151 57.8588L64.6044 51.3365C64.7244 51.3031 64.8499 51.2939 64.9735 51.3095C65.0971 51.3252 65.2163 51.3653 65.3242 51.4276C65.4321 51.4898 65.5265 51.573 65.6019 51.6722C65.6773 51.7714 65.7322 51.8846 65.7633 52.0052C65.7944 52.1258 65.8012 52.2515 65.7832 52.3747C65.7652 52.498 65.7228 52.6165 65.6585 52.7232C65.5942 52.8299 65.5093 52.9227 65.4087 52.9962C65.3081 53.0697 65.1938 53.1224 65.0726 53.1512Z"
      fill="#F2F2F2"
    />
    <path
      d="M27.0161 33.9229L19.3902 35.8893C19.2749 35.9189 19.1525 35.9016 19.05 35.8411C18.9474 35.7806 18.873 35.682 18.843 35.5667L17.0927 28.7785C17.0631 28.6631 17.0805 28.5408 17.1409 28.4382C17.2014 28.3357 17.3001 28.2613 17.4153 28.2313L25.0412 26.2649C25.1565 26.2353 25.2789 26.2526 25.3815 26.3131C25.484 26.3736 25.5584 26.4723 25.5884 26.5875L27.3387 33.3757C27.3683 33.4911 27.3509 33.6134 27.2905 33.716C27.23 33.8186 27.1313 33.893 27.0161 33.9229Z"
      fill="#E6E6E6"
    />
    <path
      d="M30.6972 48.2006L23.0714 50.1671C22.956 50.1966 22.8337 50.1793 22.7311 50.1188C22.6286 50.0583 22.5541 49.9597 22.5242 49.8444L20.7739 43.0562C20.7443 42.9408 20.7616 42.8185 20.8221 42.7159C20.8826 42.6133 20.9813 42.5389 21.0965 42.509L28.7224 40.5426C28.8377 40.513 28.9601 40.5303 29.0626 40.5908C29.1652 40.6513 29.2396 40.75 29.2695 40.8652L31.0199 47.6535C31.0494 47.7688 31.0321 47.8911 30.9716 47.9937C30.9111 48.0963 30.8125 48.1707 30.6972 48.2006Z"
      fill="#E6E6E6"
    />
    <path
      d="M34.3779 62.4791L26.752 64.4455C26.6367 64.4751 26.5143 64.4577 26.4118 64.3973C26.3092 64.3368 26.2348 64.2381 26.2049 64.1229L24.4545 57.3346C24.425 57.2193 24.4423 57.0969 24.5028 56.9944C24.5633 56.8918 24.6619 56.8174 24.7772 56.7874L32.403 54.821C32.5184 54.7914 32.6407 54.8088 32.7433 54.8693C32.8459 54.9297 32.9203 55.0284 32.9502 55.1436L34.7005 61.9319C34.7301 62.0472 34.7128 62.1696 34.6523 62.2721C34.5918 62.3747 34.4931 62.4491 34.3779 62.4791Z"
      fill="#E6E6E6"
    />
    <path
      d="M86.6461 20.9304H42.6405C41.5781 20.9316 40.5596 21.3541 39.8083 22.1054C39.0571 22.8566 38.6345 23.8752 38.6333 24.9376V76.6097C38.6345 77.6721 39.0571 78.6906 39.8083 79.4418C40.5596 80.1931 41.5781 80.6156 42.6405 80.6168H86.6461C87.7085 80.6156 88.727 80.1931 89.4783 79.4418C90.2295 78.6906 90.6521 77.6721 90.6533 76.6097V24.9376C90.6521 23.8752 90.2295 22.8566 89.4783 22.1054C88.727 21.3541 87.7085 20.9316 86.6461 20.9304Z"
      fill="white"
    />
    <path
      d="M42.6396 20.5472H86.646C87.8094 20.5504 88.9242 21.014 89.7468 21.8367C90.5695 22.6593 91.0331 23.7742 91.0364 24.9376V76.6097C91.0331 77.7731 90.5695 78.8879 89.7468 79.7105C88.9242 80.5332 87.8094 80.9968 86.646 81H42.6404C41.477 80.9968 40.3621 80.5332 39.5395 79.7105C38.7168 78.8879 38.2532 77.7731 38.25 76.6097V24.9376C38.2532 23.7743 38.7167 22.6596 39.5392 21.8369C40.3617 21.0143 41.4763 20.5506 42.6396 20.5472ZM86.646 80.2337C87.6064 80.2308 88.5266 79.848 89.2057 79.1688C89.8847 78.4896 90.2674 77.5693 90.27 76.6089V24.9376C90.2672 23.9771 89.8843 23.0569 89.2052 22.3778C88.526 21.6988 87.6056 21.3162 86.6452 21.3135H42.6404C41.6798 21.3162 40.7594 21.6989 40.0802 22.3781C39.401 23.0573 39.0182 23.9778 39.0156 24.9383V76.6097C39.0184 77.5701 39.4012 78.4903 40.0804 79.1694C40.7596 79.8484 41.68 80.231 42.6404 80.2337H86.646Z"
      fill="#E5E5E5"
    />
    <path
      d="M80.0228 48.1937H57.7698C57.5212 48.1937 57.2828 48.095 57.107 47.9192C56.9313 47.7434 56.8325 47.5051 56.8325 47.2565C56.8325 47.0079 56.9313 46.7695 57.107 46.5937C57.2828 46.418 57.5212 46.3193 57.7698 46.3193H80.0228C80.2713 46.3193 80.5097 46.418 80.6855 46.5937C80.8613 46.7695 80.96 47.0079 80.96 47.2565C80.96 47.5051 80.8613 47.7434 80.6855 47.9192C80.5097 48.095 80.2713 48.1937 80.0228 48.1937Z"
      fill="#E6E6E6"
    />
    <path
      d="M83.889 51.4714H57.7698C57.5212 51.4714 57.2828 51.3726 57.107 51.1968C56.9313 51.0211 56.8325 50.7827 56.8325 50.5341C56.8325 50.2856 56.9313 50.0472 57.107 49.8714C57.2828 49.6956 57.5212 49.5969 57.7698 49.5969H83.889C84.1376 49.5969 84.3759 49.6956 84.5517 49.8714C84.7274 50.0472 84.8262 50.2856 84.8262 50.5341C84.8262 50.7827 84.7274 51.0211 84.5517 51.1968C84.3759 51.3726 84.1376 51.4714 83.889 51.4714Z"
      fill="#E6E6E6"
    />
    <path
      d="M80.0228 62.8806H57.7698C57.5212 62.8806 57.2828 62.7819 57.107 62.6061C56.9313 62.4303 56.8325 62.192 56.8325 61.9434C56.8325 61.6949 56.9313 61.4565 57.107 61.2807C57.2828 61.1049 57.5212 61.0062 57.7698 61.0062H80.0228C80.2713 61.0062 80.5097 61.1049 80.6855 61.2807C80.8613 61.4565 80.96 61.6949 80.96 61.9434C80.96 62.192 80.8613 62.4303 80.6855 62.6061C80.5097 62.7819 80.2713 62.8806 80.0228 62.8806Z"
      fill="#E6E6E6"
    />
    <path
      d="M83.889 66.1567H57.7698C57.5212 66.1567 57.2828 66.058 57.107 65.8822C56.9313 65.7065 56.8325 65.4681 56.8325 65.2195C56.8325 64.971 56.9313 64.7326 57.107 64.5568C57.2828 64.381 57.5212 64.2823 57.7698 64.2823H83.889C84.1376 64.2823 84.3759 64.381 84.5517 64.5568C84.7274 64.7326 84.8262 64.971 84.8262 65.2195C84.8262 65.4681 84.7274 65.7065 84.5517 65.8822C84.3759 66.058 84.1376 66.1567 83.889 66.1567Z"
      fill="#E6E6E6"
    />
    <path
      d="M51.3216 52.8745H43.4466C43.3276 52.8743 43.2135 52.8269 43.1293 52.7428C43.0451 52.6586 42.9978 52.5445 42.9976 52.4255V45.4188C42.9978 45.2998 43.0451 45.1857 43.1293 45.1015C43.2135 45.0173 43.3276 44.9699 43.4466 44.9697H51.3216C51.4406 44.9699 51.5547 45.0173 51.6389 45.1015C51.7231 45.1857 51.7705 45.2998 51.7707 45.4188V52.4285C51.7696 52.547 51.7219 52.6604 51.6378 52.7439C51.5537 52.8274 51.4401 52.8743 51.3216 52.8745Z"
      fill="#E6E6E6"
    />
    <path
      d="M51.3216 67.6051H43.4466C43.3276 67.6049 43.2135 67.5576 43.1293 67.4734C43.0451 67.3892 42.9978 67.2751 42.9976 67.1561V60.1463C42.9978 60.0273 43.0451 59.9132 43.1293 59.829C43.2135 59.7448 43.3276 59.6975 43.4466 59.6973H51.3216C51.4406 59.6975 51.5547 59.7448 51.6389 59.829C51.7231 59.9132 51.7705 60.0273 51.7707 60.1463V67.1561C51.7705 67.2751 51.7231 67.3892 51.6389 67.4734C51.5547 67.5576 51.4406 67.6049 51.3216 67.6051Z"
      fill="#E6E6E6"
    />
    <path
      d="M80.0479 31.8461H63.6414C63.3928 31.8461 63.1544 31.7474 62.9786 31.5716C62.8029 31.3959 62.7041 31.1575 62.7041 30.9089C62.7041 30.6603 62.8029 30.4219 62.9786 30.2462C63.1544 30.0704 63.3928 29.9717 63.6414 29.9717H80.0479C80.2965 29.9717 80.5349 30.0704 80.7106 30.2462C80.8864 30.4219 80.9852 30.6603 80.9852 30.9089C80.9852 31.1575 80.8864 31.3959 80.7106 31.5716C80.5349 31.7474 80.2965 31.8461 80.0479 31.8461Z"
      fill="#CCCCCC"
    />
    <path
      d="M83.9134 35.1222H63.6414C63.3928 35.1222 63.1544 35.0235 62.9786 34.8477C62.8029 34.672 62.7041 34.4336 62.7041 34.185C62.7041 33.9364 62.8029 33.698 62.9786 33.5223C63.1544 33.3465 63.3928 33.2478 63.6414 33.2478H83.9134C84.1619 33.2478 84.4003 33.3465 84.5761 33.5223C84.7518 33.698 84.8506 33.9364 84.8506 34.185C84.8506 34.4336 84.7518 34.672 84.5761 34.8477C84.4003 35.0235 84.1619 35.1222 83.9134 35.1222Z"
      fill="#CCCCCC"
    />
    <path
      d="M55.0253 38.4619H43.393C43.29 38.4485 43.1963 38.3955 43.1318 38.314C43.0672 38.2326 43.037 38.1293 43.0474 38.0259V26.5783C43.037 26.4749 43.0672 26.3716 43.1318 26.2901C43.1963 26.2087 43.29 26.1557 43.393 26.1423H55.0253C55.1283 26.1557 55.2221 26.2087 55.2866 26.2901C55.3511 26.3716 55.3814 26.4749 55.3709 26.5783V38.0259C55.3814 38.1293 55.3511 38.2326 55.2866 38.314C55.2221 38.3955 55.1283 38.4485 55.0253 38.4619Z"
      fill="#53B095"
    />
    <path
      d="M46.7733 39.1264H45.1256L47.6363 31.8536H49.6178L52.1249 39.1264H50.4772L48.6555 33.5156H48.5986L46.7733 39.1264ZM46.6704 36.2677H50.5624V37.468H46.6704V36.2677Z"
      fill="white"
    />
    <path
      d="M47.6505 55.5917V50.5633H48.9218V55.5917H47.6505ZM45.7719 53.7131V52.4418H50.8003V53.7131H45.7719Z"
      fill="white"
    />
  </SVG>
)

export default withIconStyles(IconPerformanceTrendAddOn)
