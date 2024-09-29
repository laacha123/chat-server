// Create the CSS styles and append to the document head

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
body {
    font-family: "Inter", sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}
.chat-icon {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #007aff;
    color: white;
    border-radius: 50%;
    padding: 10px;
    cursor: pointer;
    font-size: 24px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s;
    width: 50px;
    height: 50px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.chat-icon img {
    transform: rotateY(0deg);
    width: 25px;
    transition: .5s;
}
.chat-icon img.chat-icon-n {
    width: 30px;
}
.chat-icon-n {
    display: inline-flex;
}
.chat-icon-h {
    display: none;
}
.chat-icon-togggle .chat-icon-n {
    display: none;
}
.chat-icon-togggle .chat-icon-h {
    display: inline-flex;
}
.chat-box {
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 400px;
    height: 400px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    display: none;
    flex-direction: column;
    overflow: hidden;
    z-index: 123;
}
.chat-header {
    background-color: #0063cf;
    color: white;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.chat-header h3 {
    margin: 0;
    color: #fff;
    font-size: 20px;
    line-height: 23px;
    font-weight: 400;
}
.close-chat {
    cursor: pointer;
    font-size: 16px;
    background: #fff;
    width: 25px;
    height: 25px;
    color: var(--secondary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-weight: bold;
    line-height: 20px;
    display: none;
}
.close-chat:hover {
    background: var(--secondary);
    color: #fff;
}
.chat-content {
    padding: 10px;
    height: 280px;
    overflow-y: auto;
    border-bottom: 1px solid #ddd;
    flex-grow: 1;
}
.message {
    margin-bottom: 10px;
}
.message {
    text-align: right;
}
.message > div {
    display: inline-block;
    padding: 10px;
    border-radius: 13px;
    font-size: 16px;
    line-height: 26px;
    background: #b9d4ff;
}
.message.bot_message {
    text-align: left;
}
.message.bot_message > div {
    background: navajowhite;
}
.chat-input {
    display: flex;
    padding: 10px;
    background: none;
    border: none;
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
}
.chat-input input {
    flex: 1;
    padding: 10px;
    font-size: 15px;
    line-height: 20px;
    border: 1px solid #ccc;
    margin-right: 0;
    height: auto;
    border-radius: 25px 0 0 25px;
    border-right: none;
}
.chat-input input:focus {
    outline: none;
}
.chat-input button {
    padding: 10px 20px;
    border-radius: 0 25px 25px 0;
    font-size: 15px;
    line-height: 20px;
    background-color: var(--primary);
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
    height: auto;
    font-weight: 600;
}
.chat-input button:hover {
    background-color: var(--secondary);
}
@media (max-width: 550px) {
    .chat-box {
        right: 10px;
        width: 300px;
    }
    .message > div {
        font-size: 13px;
        line-height: 20px;
    }
}
`;

// Append styles to the head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Create chat box HTML
const chatBoxHTML = `
<div class="chat-icon" id="chatIcon">
    <img class="chat-icon-n" id="chatIcon-n" src="https://wordsystech.com/webdesign/wp-content/themes/wordsys/assets/images/chatico.svg"/>
    <img class="chat-icon-h" id="chatIcon-h" src="https://wordsystech.com/webdesign/wp-content/themes/wordsys/assets/images/chatcross.svg"/>
</div>
<div class="chat-box" id="chatBox">
    <div class="chat-header">
        <h3>Wordsys Chat</h3>
        <span class="close-chat" id="closeChat">x</span>
    </div>
    <div class="chat-content" id="chatContent">
        <!-- Chat messages will appear here -->
    </div>
    <div class="chat-input">
        <input type="text" id="userInput" placeholder="Type your message...">
        <button id="sendBtn">Send</button>
    </div>
</div>
`;

// When the DOM is fully loaded, configure the chat
document.addEventListener('DOMContentLoaded', function() {
    const chatBoxContainer = document.createElement("div");
    chatBoxContainer.innerHTML = chatBoxHTML;
    document.body.appendChild(chatBoxContainer);

    let isChatInitialized = localStorage.getItem('chatInitialized') === 'true';
    let botName = localStorage.getItem('botName');

    document.getElementById('chatIcon-n').addEventListener('click', function () {
        document.getElementById('chatBox').style.display = 'block';
        document.getElementById('chatIcon').classList.add('chat-icon-togggle');

        if (!isChatInitialized) {
            socket.emit('user_message', { message: 'initiate_chat' });
            localStorage.setItem('chatInitialized', 'true');
            isChatInitialized = true;
        }
    });

    document.getElementById('chatIcon-h').addEventListener('click', function () {
        document.getElementById('chatBox').style.display = 'none';
        document.getElementById('chatIcon').classList.remove('chat-icon-togggle');
    });

    const socket = io('https://va.wordsystech.com', {
        withCredentials: true
    });

    socket.on('bot_message', function(data) {
        if (data.bot_name) {
            botName = data.bot_name;
            localStorage.setItem('botName', botName);
        }
        displayMessage(botName || 'Bot', data.message);
    });

    document.getElementById('sendBtn').addEventListener('click', function() {
        sendMessage();
    });

    document.getElementById('userInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const userInput = document.getElementById('userInput').value.trim();
        if (userInput) {
            displayMessage('You', userInput);
            socket.emit('user_message', { message: userInput, bot_name: botName });
            document.getElementById('userInput').value = '';
        }
    }

    function displayMessage(sender, message) {
        const chatContent = document.getElementById('chatContent');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender === 'You' ? 'user_message' : 'bot_message');
        messageElement.innerHTML = `<div><strong>${sender}:</strong> ${message}</div>`;
        chatContent.appendChild(messageElement);
        chatContent.scrollTop = chatContent.scrollHeight;
    }
});
