let colors = ["red", "grey", "green", "yellow", "pink", "blue", "violet", "orange", "black", "magenta"];
const items = [
  {
    name: "bell",
    icon: "bell-o"
  },
  {
    name: "snow",
    icon: "snowflake-o"
  },
  {
    name: "car",
    icon: "car"
  },
  {
    name: "ball",
    icon: "futbol-o"
  },
  {
    name: "camera",
    icon: "camera"
  },
  {
    name: "magnet",
    icon: "magnet"
  },
  {
    name: "book",
    icon: "book"
  },
  {
    name: "eraser",
    icon: "eraser"
  },
  {
    name: "bug",
    icon: "bug"
  },
  {
    name: "bike",
    icon: "motorcycle"
  }
];

/**
 * generate "count" number of fake names and details!
 * @param {number} count
 */
export const createFakeData = count => {
  const students = [];
  let i = 0;
  while (i < count) {
    const index = i % 10;
    students.push({
      fakeFirstName: colors[index],
      fakeLastName: items[index].name,
      icon: items[index].icon
    });

    i++;
    if (i % 10 === 0) {
      colors = [...colors.slice(1), colors[0]];
    }
  }

  return students;
};
