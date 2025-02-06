const socket = io('http://localhost:3000');

let currentRoom = "";

// Function to update room options dynamically
function updateRoomOptions() {
    const roomSelector = document.getElementById("roomSelector");

    // New room options
    const newRooms = [
        { value: "devops", text: "DevOps" },
        { value: "cloud computing", text: "Cloud Computing" },
        { value: "covid-19", text: "COVID-19" },
        { value: "sports", text: "Sports" },
        { value: "nodejs", text: "NodeJS" }
    ];

    // Clear existing options
    roomSelector.innerHTML = "";

    // Add new options
    newRooms.forEach(room => {
        let option = document.createElement("option");
        option.value = room.value;
        option.textContent = room.text;
        roomSelector.appendChild(option);
    });
}

// Update room options when the page loads
document.addEventListener("DOMContentLoaded", updateRoomOptions);

// Attach event listener to update rooms when clicking the dropdown
document.getElementById("roomSelector").addEventListener("focus", updateRoomOptions);

// Join Room
document.getElementById('joinRoomBtn').addEventListener('click', () => {
    const room = document.getElementById('roomSelector').value;
    const username = localStorage.getItem('username');

    if (username && room) {
        socket.emit('joinRoom', { username, room });

        // Update UI
        currentRoom = room;
        document.getElementById('chatBox').style.display = 'block';
        document.getElementById('currentRoom').innerText = `Room: ${room}`;
        document.querySelector('.room-selection').style.display = 'none';

        // Auto-focus message input for better UX
        document.getElementById('messageInput').focus();
    } else {
        alert('Please login and select a room');
    }
});

// Receive Messages from Server and Display Them
socket.on('message', (message) => {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.innerText = `${message.from_user}: ${message.message}`;
    messagesDiv.appendChild(messageElement);

    // Auto-scroll to latest message
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Send Message
document.getElementById('sendMessageBtn').addEventListener('click', () => {
    const message = document.getElementById('messageInput').value.trim();
    const username = localStorage.getItem('username');

    if (message === "") {
        alert("Message cannot be empty!");
        return;
    }

    if (message && currentRoom) {
        // Emit message event to server
        socket.emit('chatMessage', { from_user: username, room: currentRoom, message });

        // Append own message immediately to chat window
        const messagesDiv = document.getElementById('messages');
        const messageElement = document.createElement('div');
        messageElement.innerText = `You: ${message}`;
        messageElement.style.fontWeight = "bold";
        messagesDiv.appendChild(messageElement);

        // Auto-scroll to latest message
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // Clear input field
        document.getElementById('messageInput').value = '';
        document.getElementById('sendMessageBtn').disabled = true; // Disable send button after sending
    }
});

// Disable send button when no message is typed
document.getElementById('messageInput').addEventListener('input', function () {
    document.getElementById('sendMessageBtn').disabled = this.value.trim() === "";
});

// Leave Room
document.getElementById('leaveRoomBtn').addEventListener('click', () => {
    if (currentRoom) {
        const username = localStorage.getItem('username');

        // Emit leave event to server
        socket.emit('leaveRoom', { username, room: currentRoom });

        // Reset UI
        document.getElementById('chatBox').style.display = 'none';
        document.getElementById('messages').innerHTML = ''; // Clear messages
        document.getElementById('currentRoom').innerText = '';
        document.querySelector('.room-selection').style.display = 'block';
        currentRoom = ""; // Reset current room
    }
});

// LOGOUT FUNCTION
document.getElementById('logoutBtn').addEventListener('click', () => {
    const username = localStorage.getItem('username');

    // Inform server that user is logging out
    socket.emit('logout', { username });

    // Clear user session
    localStorage.removeItem('username');
    localStorage.removeItem('token');

    // Redirect to login page
    window.location.href = "login.html";
});
