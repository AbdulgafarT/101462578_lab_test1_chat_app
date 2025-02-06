module.exports.setupSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("New user connected");

        // Join Room
        socket.on("joinRoom", ({ username, room }) => {
            socket.join(room);
            io.to(room).emit("message", { from_user: "System", message: `${username} has joined the room.` });
        });

        // Chat Message - Broadcast to Everyone in Room (Including Sender)
        socket.on("chatMessage", ({ from_user, room, message }) => {
            io.to(room).emit("message", { from_user, message });
        });

        // Leave Room
        socket.on("leaveRoom", ({ username, room }) => {
            socket.leave(room);
            io.to(room).emit("message", { from_user: "System", message: `${username} has left the room.` });
        });

        // Handle User Logout
        socket.on("logout", ({ username }) => {
            console.log(`${username} has logged out`);
        });

        // Disconnect
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};
