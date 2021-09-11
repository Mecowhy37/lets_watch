import { PubSub } from "graphql-subscriptions";
const { authenticated, authorized } = require("../../functions/auth");

const pubSub = new PubSub();
const USER_JOINED = "USER_JOINED";

export default {
  Query: {
    getrooms: async (_, __, { rooms }) => {
      console.log("ALL ROOMS: ", JSON.stringify(rooms, null, 4));
      return rooms;
    },
  },
  Mutation: {
    createroom: authenticated(async (_, __, { user, roomIDs }) => {
      let newroom = { number: rooms.length + 1, users: [user] };
      rooms.push(newroom);
      console.log("NEW ROOM CREATED: number ", rooms.length);
      return newroom;
    }),
    joinroom: authenticated(async (_, { roomID }, { user, roomIDs }) => {
      if (!roomIDs.includes(roomID)) {
        throw new Error("this room doesnt exist");
      }
      try {
        targetRoom.users.push(user);
        pubSub.publish(USER_JOINED, { userJoined: user });
        console.log(targetRoom);
        return user;
      } catch (err) {
        throw new Error(err);
      }
    }),
  },
  Subscription: {
    userJoined: {
      subscribe: authenticated(async (_, { roomID }, { user, rooms }) => {
        const targetRoom = rooms.find((el) => `${el.number}` === roomID);
        if (!targetRoom) {
          throw new Error(`Room with ID: ${roomID} does not exist`);
        }
        const userPresent = targetRoom.users.find((us) => us.id === user.id);
        if (!userPresent) {
          throw new Error(`user: ${user.username} is not present in this room`);
        }
        return pubSub.asyncIterator([USER_JOINED]);
      }),
      //resolve function availialbe for mapping the published events
    },
  },
};
