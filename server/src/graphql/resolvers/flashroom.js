const { authenticated, authorized } = require("../../functions/auth");

export default {
  Query: {
    getrooms: async (_, __, { rooms }) => {
      console.log("ALL ROOMS: ", JSON.stringify(rooms, null, 4));
      return rooms;
    },
  },
  Mutation: {
    createroom: authenticated(async (_, __, { user, rooms }) => {
      let newroom = { number: rooms.length + 1, users: [user], admin: user.id };
      rooms.push(newroom);
      console.log("NEW ROOM CREATED: number ", rooms.length);
      return newroom;
    }),
    // joinroom: authenticated()
  },
};
