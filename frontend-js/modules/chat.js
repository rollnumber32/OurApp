import DOMPurify from "dompurify";

export default class Chat {
  constructor() {
    this.openedYet = false;
    this.chatWrapper = document.querySelector("#chat-wrapper");
    this.open = document.querySelector(".open-chat");
    this.injectHTML();
    this.chatLog = document.querySelector("#chat");
    this.chatField = document.querySelector("#chatField");
    this.chatForm = document.querySelector("#chatForm");
    this.close = document.querySelector(".close-chat");
    this.events();
  }

  events() {
    this.chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.sendMessageToServer();
    });
    this.open.addEventListener("click", () => this.showChat());
    this.close.addEventListener("click", () => this.hideChat());
  }

  sendMessageToServer() {
    this.socket.emit("chatMessageFromBrowser", {
      message: this.chatField.value,
    });
    this.chatLog.insertAdjacentHTML(
      "beforeend",
      DOMPurify.sanitize(`
      <div class="flex gap-2">
        <div class="chat-message">
          <div class="chat-message-inner">
            <a href="/profile/${this.username}"></a>
            ${this.chatField.value}
          </div>
        </div>
        <a href="/profile/${this.username}"><img class="rounded-full h-6" src=${this.avatar}/></a>
      </div>
    `)
    );
    this.chatLog.scrollTop = this.chatLog.scrollHeight;
    this.chatField.value = "";
    this.chatField.focus();
  }

  openConnection() {
    this.socket = io();
    this.socket.on("welcome", (data) => {
      this.username = data.username;
      this.avatar = data.avatar;
    });
    this.socket.on("chatMessageFromServer", (data) => {
      this.displayMessageFromServer(data);
    });
  }

  showChat() {
    if (!this.openedYet) {
      this.openConnection();
    }
    this.openedYet = true;
    this.chatWrapper.classList.remove("invisible");
    this.chatField.focus();
  }

  hideChat() {
    this.chatWrapper.classList.add("invisible");
  }

  displayMessageFromServer(data) {
    this.chatLog.insertAdjacentHTML(
      "beforeend",
      DOMPurify.sanitize(`
      <div class="flex gap-2">
        <a href="/profile/${data.username}"><img class="rounded-full h-6" src=${data.avatar}/></a>
        <div class="chat-message">
          <div class="chat-message-inner">
            <a href="/profile/${data.username}"><strong>${data.username}:</strong></a>
            ${data.message}
          </div>
        </div>
      </div>
    `)
    );
    this.chatLog.scrollTop = this.chatLog.scrollHeight;
  }

  injectHTML() {
    this.chatWrapper.innerHTML = `
    <div class="bg-blue-600 w-full text-white">
      <div class="flex justify-between px-2">
        <span>Chat</span><span class="close-chat cursor-pointer">Close</span>
      </div>
    </div>
    <div id="chat" class="p-2 w-96 bg-white flex flex-col gap-2 overflow-scroll"></div>

    <form id="chatForm" class="absolute bottom-0">
      <input type="text" class="w-96 border-none p-1" id="chatField" placeholder="Type a message..." autocomplete="off"/>
    </form>
    `;
  }
}
