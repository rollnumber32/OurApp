import Chat from "./modules/chat";
import Search from "./modules/search";

if (document.querySelector("#chat-wrapper")) {
  new Chat();
}

if (document.querySelector(".search")) {
  new Search();
}
