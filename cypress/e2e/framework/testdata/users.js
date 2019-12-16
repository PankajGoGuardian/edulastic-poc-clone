import faker from "faker";
import { build } from "test-data-bot";

const getUsers = (numberOfUsers = 1) => {
  const users = [];
  for (let u = 1; u <= numberOfUsers; u++) {
    const fName = faker.name.firstName();
    const lName = faker.name.lastName();
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}.${u}@snapwiz.com`;
    const user = build("User").fields({
      fName,
      lName,
      email,
      username: email,
      password: "snapwiz"
    });
    users.push(user());
  }
  return users;
};

export { getUsers };
