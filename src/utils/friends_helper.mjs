import { User } from "../mongoose/schemas/user.mjs";

export const addFriend = async (firstFriendID, secondFriendID) => {
  try {
    await User.updateOne(
      { _id: firstFriendID },
      { $set: { [`friends.${secondFriendID}`]: "P" } }
    );
    await User.updateOne(
      { _id: secondFriendID },
      { $set: { [`friends.${firstFriendID}`]: "R" } }
    );
  } catch (err) {
    console.log(err);
  }
};
export const acceptFriend = async (firstFriendID, secondFriendID) => {
  try {
    await User.updateOne(
      { _id: firstFriendID },
      { $set: { [`friends.${secondFriendID}`]: "F" } }
    );
    await User.updateOne(
      { _id: secondFriendID },
      { $set: { [`friends.${firstFriendID}`]: "F" } }
    );
  } catch (err) {
    console.log(err);
  }
};
export const removeFriend = async (firstFriend, secondFriend) => {
  const firstFriendStatus = firstFriend.friends[secondFriend._id];
  const secondFriendStatus = secondFriend.friends[firstFriend._id];
  try {
    await User.updateOne(
      { _id: firstFriend._id },
      {
        $set: {
          [`friends.${secondFriend._id}`]: "O" + (firstFriendStatus || ""),
        },
      }
    );
    await User.updateOne(
      { _id: secondFriend.id },
      {
        $set: {
          [`friends.${firstFriend._id}`]: "O" + (secondFriendStatus || ""),
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
};
export const filterFriends = async (user, criteria, fields) => {
  // ///////Needs Optimized Query////////////////////
  const filteredFriends = [];

  Object.keys(user.friends).forEach((id) => {
    if (user.friends[id] === criteria) {
      filteredFriends.push(id);
    }
  });

  const friends = await Promise.all(
    filteredFriends.map(async (id) => {
      const findUser = await User.findById(id);
      return fields.reduce((acc, ele) => {
        acc[ele] = findUser[ele];
        return acc;
      }, {});
    })
  );
  return friends;
};
