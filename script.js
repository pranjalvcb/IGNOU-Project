const form = document.getElementById('item-form');
const itemsContainer = document.getElementById('items-container');
const filterType = document.getElementById('filter-type');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const messages = document.getElementById('messages');

let items = JSON.parse(localStorage.getItem('items')) || [];  // Retrieve items from local storage
let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];  // Retrieve chat history from local storage

// Function to display items
function displayItems(filter = "All") {
  itemsContainer.innerHTML = '';

  const filteredItems = items.filter(item => filter === "All" || item.type === filter);

  if (filteredItems.length === 0) {
    itemsContainer.innerHTML = '<p>No items found.</p>';
    return;
  }

  filteredItems.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('item-card');
    card.innerHTML = `
      <h3>${item.name} (${item.type})</h3>
      <p><strong>Description:</strong> ${item.description}</p>
      <p><strong>Date:</strong> ${item.date}</p>
      <p><strong>Location:</strong> ${item.location}</p>
      <p><strong>Contact:</strong> ${item.contact}</p>
      ${item.photo ? `<img src="${item.photo}" alt="${item.name} photo">` : ''}
      <button class="chat-button" data-contact="${item.contact}">Chat</button>
    `;
    itemsContainer.appendChild(card);
  });

  // Add event listeners to chat buttons
  document.querySelectorAll('.chat-button').forEach(button => {
    button.addEventListener('click', (e) => startChat(e.target.dataset.contact));
  });
}

// Handle form submission
form.addEventListener('submit', event => {
  event.preventDefault();

  const photoInput = document.getElementById('item-photo');
  const newItem = {
    type: document.getElementById('item-type').value,
    name: document.getElementById('item-name').value,
    description: document.getElementById('item-description').value,
    date: document.getElementById('item-date').value,
    location: document.getElementById('item-location').value,
    contact: document.getElementById('item-contact').value,
    photo: photoInput.files[0] ? URL.createObjectURL(photoInput.files[0]) : null,
  };

  // Add the new item to the items array
  items.push(newItem);
  // Save the items array to local storage
  localStorage.setItem('items', JSON.stringify(items));

  form.reset();
  displayItems(filterType.value);
});

// Handle filter changes
filterType.addEventListener('change', () => {
  displayItems(filterType.value);
});

// Start Chat
function startChat(contact) {
  chatInput.placeholder = `Chatting with ${contact}`;
  chatHistory = [];
  displayChat();
}

// Send Chat Message
chatSend.addEventListener('click', () => {
  if (chatInput.value.trim() === "") return;

  chatHistory.push(chatInput.value.trim());
  chatInput.value = "";

  // Save the chat history to local storage
  localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

  displayChat();
});

// Display Chat Messages
function displayChat() {
  messages.innerHTML = chatHistory
    .map(message => `<div class="message">${message}</div>`)
    .join("");
}

// Initial display of items and chat history
displayItems(filterType.value);
displayChat();
