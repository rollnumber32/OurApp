import axios from "axios";
import DOMPurify from "dompurify";

export default class Search {
  constructor() {
    this.injectHTML();
    this.search = document.querySelector(".search");
    this.overlay = document.querySelector(".search-overlay");
    this.close = document.querySelector(".close-search");
    this.inputField = document.querySelector("#search-field");
    this.resultsArea = document.querySelector(".search-results");
    this.typingWaitTimer;
    this.previousValue = "";
    this.events();
  }

  events() {
    this.inputField.addEventListener("keyup", () => this.keyPressHandler());
    this.close.addEventListener("click", () => {
      this.closeOverlay();
    });
    this.search.addEventListener("click", (e) => {
      e.preventDefault();
      this.openOverlay();
    });
  }

  keyPressHandler() {
    const value = this.inputField.value;

    if (value == "") {
      clearTimeout(this.typingWaitTimer);
      this.hideResultArea();
    } else if (value != this.previousValue) {
      clearTimeout(this.typingWaitTimer);
      this.hideResultArea();
      this.typingWaitTimer = setTimeout(() => this.sendRequest(), 750);
    }
  }

  sendRequest() {
    axios
      .post("/search", { searchTerm: this.inputField.value })
      .then((res) => {
        this.renderResultsHTML(res.data);
      })
      .catch(() => {
        alert("Failure");
      });
  }

  renderResultsHTML(posts) {
    if (posts.length) {
      this.resultsArea.innerHTML = DOMPurify.sanitize(
        `
        <div class="flex flex-col gap-2"><div>${
          posts.length
        } item(s) found.</div>
          ${posts
            .map((post) => {
              return `<a style="width: 720px" class="border inline-block p-4 bg-white" href="post/${post._id}">${post.title}</a>`;
            })
            .join("")}
        </div>`
      );
    } else {
      this.resultsArea.innerHTML = DOMPurify.sanitize(
        `<div>Sorry, no results found.</div>`
      );
    }

    this.showResultArea();
  }

  showResultArea() {
    this.resultsArea.classList.remove("invisible");
  }

  hideResultArea() {
    this.resultsArea.classList.add("invisible");
  }

  openOverlay() {
    this.overlay.classList.remove("invisible");
  }

  closeOverlay() {
    this.overlay.classList.add("invisible");
  }

  injectHTML() {
    document.body.insertAdjacentHTML(
      "beforeend",
      `<div
        class="search-overlay flex flex-col gap-8 items-center p-16 absolute top-0 left-0 bg-gray-200 invisible"
        style="width: 100vw; height: 100vh;"
      >
        <div class="close-search cursor-pointer absolute right-8 top-8">
          Close
        </div>
        <input
          class="h-16 px-4"
          style="width: 720px"
          type="text"
          id="search-field"
          placeholder="What are you interested in?"
        />
        <div class="flex">
          <div class="search-results invisible">ksjmk</div>
        </div>
      </div>`
    );
  }
}
