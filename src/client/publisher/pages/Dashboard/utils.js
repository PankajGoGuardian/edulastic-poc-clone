import { sum, reduce } from "lodash";

const defs = (
  <defs>
    <linearGradient
      id="publisherDashboardItembankIconColor"
      x1="0"
      y1="0"
      x2="100%"
      y2="100%"
      gradientTransform="rotate(135)"
    >
      <stop offset="0%" stopColor="#009BFFCC" stopOpacity={1} />
      <stop offset="100%" stopColor="#009BFFA5" stopOpacity={1} />
    </linearGradient>
    <linearGradient
      id="publisherDashboardTestsIconColor"
      x1="0"
      y1="0"
      x2="100%"
      y2="100%"
      gradientTransform="rotate(174)"
    >
      <stop offset="0%" stopColor="#00FFED6C" stopOpacity={1} />
      <stop offset="100%" stopColor="#00FFEDD3" stopOpacity={1} />
    </linearGradient>
    <linearGradient
      id="publisherDashboardPlaylistIconColor"
      x1="0"
      y1="0"
      x2="100%"
      y2="100%"
      gradientTransform="rotate(135)"
    >
      <stop offset="0%" stopColor="#AB2EFE9A" stopOpacity={1} />
      <stop offset="100%" stopColor="#AB2EFE80" stopOpacity={1} />
    </linearGradient>
  </defs>
);

export const getCollectionsList = collections => {
  return collections.map(collection => {
    const itemBankTotal = sum(Object.values(collection.metrics.TestItems));
    const testTotal = sum(Object.values(collection.metrics.Tests));
    const playlistTotal = sum(Object.values(collection.metrics.PlayLists));
    const totalIssues = reduce(collection.metrics, (result, value) => result + value.issues, 0);
    const chartData = [
      { name: "itembank", value: itemBankTotal, fill: "url('#publisherDashboardItembankIconColor')" },
      { name: "tests", value: testTotal, fill: "url('#publisherDashboardTestsIconColor')" },
      { name: "playlist", value: playlistTotal, fill: "url('#publisherDashboardPlaylistIconColor')" }
    ];
    return {
      ...collection,
      totalIssues,
      chartData,
      defs
    };
  });
};
