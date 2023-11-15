const socketClient = io()

const username = document.getElementById("username");
const chatForm = document.getElementById("chatForm");
const chatMessage = document.getElementById("chatMessage");
const chat = document.getElementById("chat");

// const chat_id = document.getElementById("chat_id");

Swal.fire({
    title: "Bienvenidx!",
    html:
        '<br><label>Name</label>'+
        '<input id="swal-input1" class="swal2-input">' +
        '<br><label>Email</label>'+
        '<input id="swal-input2" class="swal2-input">' +
        '<br><label>Password</label>'+
        '<input id="swal-input3" class="swal2-input">',
    focusConfirm: false,
    preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('swal-input3').value
        ]
      }
    
}).then(input => {
    user = input.value
    username.innerText = input.value[0]
    socketClient.emit("newUser", user)
})
socketClient.on('newUserBroadcast', (user) => {
    Toastify({
        text: `${user.name} se ha conectado`,
        duration: 5000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
});

chatForm.onsubmit = (e) => {
    e.preventDefault();
    // let aux = chat_id.textContent.split(':')
    // const cid = aux[1].trim()

    // handlebars check
    const cid = chatForm.dataset.chat
    socketClient.emit("message", {message: chatMessage.value, id: cid});
}

socketClient.on('chat', (messages) => {
    const chatMsg = messages.chats.map( (msg) => `<p>${msg.autor.name}: ${msg.content}</p>` ).join(" ");
    chat.innerHTML = chatMsg;
})