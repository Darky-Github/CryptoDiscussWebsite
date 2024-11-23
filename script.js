document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("discussionForm");
  const discussionList = document.getElementById("discussionList");

  // Load discussions for the specific page
  function loadDiscussions() {
    const pageKey = window.location.pathname.split("/").pop().replace(".html", "");
    const discussions = JSON.parse(localStorage.getItem(`discussions_${pageKey}`)) || [];
    discussionList.innerHTML = ""; // Clear existing content

    discussions.forEach((discussion, index) => {
      const discussionElement = document.createElement("div");
      discussionElement.className = "discussion";

      discussionElement.innerHTML = `
        <h4>${discussion.username}</h4>
        <p>${discussion.message}</p>
        <div class="actions">
          <button class="like" data-index="${index}">Like (${discussion.likes})</button>
          <button class="dislike" data-index="${index}">Dislike (${discussion.dislikes})</button>
          <button class="reply" data-index="${index}">Reply</button>
        </div>
        <div class="replies">
          ${discussion.replies
            .map(
              (reply) =>
                `<div class="reply-item">
                  <strong>${reply.username}:</strong> ${reply.message}
                </div>`
            )
            .join("")}
        </div>
      `;

      discussionList.appendChild(discussionElement);
    });

    attachEventListeners(); // Re-attach listeners for dynamic buttons
  }

  // Handle new comment submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = form.username.value.trim();
    const message = form.message.value.trim();

    if (!username || !message) {
      alert("Please fill in both fields.");
      return;
    }

    const pageKey = window.location.pathname.split("/").pop().replace(".html", "");
    const discussions = JSON.parse(localStorage.getItem(`discussions_${pageKey}`)) || [];
    discussions.push({ username, message, likes: 0, dislikes: 0, replies: [] });
    localStorage.setItem(`discussions_${pageKey}`, JSON.stringify(discussions));

    form.reset();
    loadDiscussions(); // Refresh the discussion list
  });

  // Add listeners for likes, dislikes, and replies
  function attachEventListeners() {
    document.querySelectorAll(".like").forEach((btn) => {
      btn.addEventListener("click", () => handleLike(btn.dataset.index));
    });

    document.querySelectorAll(".dislike").forEach((btn) => {
      btn.addEventListener("click", () => handleDislike(btn.dataset.index));
    });

    document.querySelectorAll(".reply").forEach((btn) => {
      btn.addEventListener("click", () => handleReply(btn.dataset.index));
    });
  }

  // Handle like button click
  function handleLike(index) {
    const pageKey = window.location.pathname.split("/").pop().replace(".html", "");
    const discussions = JSON.parse(localStorage.getItem(`discussions_${pageKey}`)) || [];
    discussions[index].likes++;
    localStorage.setItem(`discussions_${pageKey}`, JSON.stringify(discussions));
    loadDiscussions();
  }

  // Handle dislike button click
  function handleDislike(index) {
    const pageKey = window.location.pathname.split("/").pop().replace(".html", "");
    const discussions = JSON.parse(localStorage.getItem(`discussions_${pageKey}`)) || [];
    discussions[index].dislikes++;
    localStorage.setItem(`discussions_${pageKey}`, JSON.stringify(discussions));
    loadDiscussions();
  }

  // Handle reply button click
  function handleReply(index) {
    const replyMessage = prompt("Enter your reply:");
    if (!replyMessage) return;

    const username = prompt("Enter your name:") || "Anonymous";
    const pageKey = window.location.pathname.split("/").pop().replace(".html", "");
    const discussions = JSON.parse(localStorage.getItem(`discussions_${pageKey}`)) || [];
    discussions[index].replies.push({ username, message: replyMessage });
    localStorage.setItem(`discussions_${pageKey}`, JSON.stringify(discussions));
    loadDiscussions();
  }

  loadDiscussions(); // Initial load of discussions
});
