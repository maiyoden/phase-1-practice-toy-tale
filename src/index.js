let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const newToyForm = document.getElementById('new-toy-form');
  const toyCollection = document.getElementById('toy-collection');

  // Toggle the visibility of the toy form
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch all toys on page load
  fetchToys();

  // Handle adding a new toy
  newToyForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const toyName = document.getElementById('toy-name').value;
    const toyImage = document.getElementById('toy-image').value;

    const newToy = {
      name: toyName,
      image: toyImage,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
    .then(response => response.json())
    .then(toy => {
      createToyCard(toy); // Add the new toy to the DOM
      newToyForm.reset(); // Reset the form
      toyFormContainer.style.display = "none"; // Hide the form
    })
    .catch(error => console.error('Error adding new toy:', error));
});

// Function to fetch and display toys
function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        createToyCard(toy);
      });
    })
    .catch(error => console.error('Error fetching toys:', error));
}

// Function to create a toy card
function createToyCard(toy) {
  const card = document.createElement('div');
  card.className = 'card';

  const h2 = document.createElement('h2');
  h2.textContent = toy.name;

  const img = document.createElement('img');
  img.src = toy.image;
  img.className = 'toy-avatar';

  const p = document.createElement('p');
  p.textContent = `${toy.likes} Likes`;

  const likeBtn = document.createElement('button');
  likeBtn.className = 'like-btn';
  likeBtn.id = toy.id;
  likeBtn.textContent = 'Like ❤️';
  likeBtn.addEventListener('click', () => {
    updateLikes(toy.id, toy.likes);
  });

  card.appendChild(h2);
  card.appendChild(img);
  card.appendChild(p);
  card.appendChild(likeBtn);
  toyCollection.appendChild(card);
}

// Function to update likes
function updateLikes(toyId, currentLikes) {
  const newLikes = currentLikes + 1;

  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ likes: newLikes })
  })
  .then(response => response.json())
  .then(updatedToy => {
    // Update the likes in the DOM
    const card = document.getElementById(toyId).parentElement;
    const p = card.querySelector('p');
    p.textContent = `${updatedToy.likes} Likes`;
  })
  .catch(error => console.error('Error updating likes:', error));
}