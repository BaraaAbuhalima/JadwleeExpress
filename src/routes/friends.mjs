import { Router } from "express";
import { checkIsAuthenticatedMiddleware } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import {
  acceptFriend,
  addFriend,
  removeFriend,
} from "../utils/friends_helper.mjs";
import httpError from "../utils/http-error.mjs";
import { createErrorResponse } from "../utils/Errors.mjs";
const router = Router();

router.get(
  "/api/user/friends/all",
  checkIsAuthenticatedMiddleware,
  async (request, response) => {
    const user = request.user;
    // ///////Needs Optimized Query////////////////////

    const filteredFriends = [];

    Object.keys(user.friends).forEach((id) => {
      if (user.friends[id] === "F") {
        filteredFriends.push(id);
      }
    });
    const friends = await Promise.all(
      filteredFriends.map(async (id) => {
        const findUser = await User.findById(id);
        return {
          username: findUser.username,
          displayName: findUser.displayName,
          userNumber: findUser.userNumber,
        };
      })
    );
    console.log(friends);
    return response.status(200).send(friends);
  }
);
router.get(
  "/api/user/friends/pending",
  checkIsAuthenticatedMiddleware,
  async (request, response) => {
    const user = request.user;
    // ///////Needs Optimized Query////////////////////

    const filteredFriends = [];

    Object.keys(user.friends).forEach((id) => {
      if (user.friends[id] === "P") {
        filteredFriends.push(id);
      }
    });
    const friends = await Promise.all(
      filteredFriends.map(async (id) => {
        const findUser = await User.findById(id);
        return {
          username: findUser.username,
          displayName: findUser.displayName,
          userNumber: findUser.userNumber,
        };
      })
    );
    console.log(friends);
    return response.status(200).send(friends);
  }
);
router.get(
  "/api/user/friends/requests",
  checkIsAuthenticatedMiddleware,
  async (request, response) => {
    const user = request.user;
    // ///////Needs Optimized Query////////////////////

    const filteredFriends = [];

    Object.keys(user.friends).forEach((id) => {
      if (user.friends[id] === "R") {
        filteredFriends.push(id);
      }
    });
    const friends = await Promise.all(
      filteredFriends.map(async (id) => {
        const findUser = await User.findById(id);
        return {
          username: findUser.username,
          displayName: findUser.displayName,
          userNumber: findUser.userNumber,
        };
      })
    );
    console.log(friends);
    return response.status(200).send(friends);
  }
);
router.post(
  "/api/user/friends/add/:userNumber",
  checkIsAuthenticatedMiddleware,
  async (request, response) => {
    const findUser = await User.findOne({
      userNumber: request.params.userNumber,
    });
    ///////////////////

    const errors = new httpError(
      "User not found",
      400,
      400,
      "User not found",
      "",
      ""
    );

    ////////////////
    if (!findUser) {
      return response.status(400).send({
        messageCode: 400,
        errors: [errors],
      });
    }
    const friendStatus = request.user.friends[findUser.id];

    if (
      findUser.id == request.user.id ||
      friendStatus === "F" ||
      friendStatus === "R" ||
      friendStatus === "P"
    ) {
      errors.title = errors.details =
        "Invalid request: You may already be friends with this user, or you have sent a friend request to this user, or they have sent you a request.";
      return response.status(400).send({
        messageCode: 400,
        errors: [errors],
      });
    }

    await addFriend(request.user._id, findUser._id);
    response
      .status(200)
      .send(["Friend Request was sent successfully to " + findUser.username]);
  }
);
router.post(
  "/api/user/removeFriend/:userNumber",
  checkIsAuthenticatedMiddleware,
  async (request, response) => {
    const findUser = await User.findOne({
      userNumber: request.params.userNumber,
    });

    if (!findUser) {
      return response
        .status(400)
        .send(createErrorResponse(400, "User not found"));
    }
    if (
      !request.user.friends[findUser.id] ||
      request.user.friends[findUser.id].startsWith("O")
    ) {
      return response
        .status(400)
        .send(
          createErrorResponse(
            400,
            "You are not friend with " + findUser.username
          )
        );
    }
    await removeFriend(request.user, findUser);
    response.status(200).send([findUser.username + " removed Successfully"]);
  }
);
router.post(
  "/api/user/friend/accept/:userNumber",
  checkIsAuthenticatedMiddleware,
  async (request, response) => {
    const findUser = await User.findOne({
      userNumber: request.params.userNumber,
    });
    if (!findUser) {
      return response
        .status(400)
        .send(createErrorResponse(400, "User not found"));
    }
    const friendStatus = request.user.friends[findUser.id];
    console.log(friendStatus);
    if (friendStatus !== "R") {
      return response
        .status(400)
        .send(createErrorResponse(400, "Invalid Request"));
    }

    await acceptFriend(request.user._id, findUser._id);
    response.status(200).send(["You are now friends" + findUser.username]);
  }
);
export default router;
