const ingridientsInput = document.querySelector(".ingridientsInput");
const btn = document.querySelector(".btn");
const recipeResult = document.querySelector(".recipeResult");
const favContainer = document.querySelector(".cart");
const sectionTitle = document.querySelector(".section-title");

const apiKey = "3576aeab154d40dc853d17deeb286329";

let favourites = [];

btn.addEventListener("click", () => {
  const ingredients = ingridientsInput.value.trim();
  fetchRecipes(ingredients);
});

const fetchRecipes = async (ingredients) => {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=10&apiKey=${apiKey}`
    );
    const recipes = await response.json();
    sectionTitle.textContent = "Searched Results";
    displayRecipes(recipes);
  } catch (error) {
    console.log(error);
  }
};

const displayRecipes = (recipes) => {
  recipeResult.innerHTML = "";
  if (recipes.length == 0) {
    recipeResult.innerHTML += `<p class="error">No Recipes found. Try again later</p>`;
    return;
  }
  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("card");
    recipeCard.innerHTML = `
              <div class="img">
                <img src="${recipe.image}" alt=""/>
              </div>
              <p>${recipe.title}</p>
              <div class="card-actions">
                <button class="btn view-btn" data-id="${recipe.id}">View Recipe</button>
                <button class="btn fav-btn" data-id="${recipe.id}" data-title="${recipe.title}" data-image="${recipe.image}">Add to Favourite</button>
              </div>
            `;
    recipeResult.appendChild(recipeCard);
  });

  // Add listeners
  document.querySelectorAll(".view-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const recipeId = e.target.dataset.id;
      viewRecipe(recipeId);
    })
  );

  document.querySelectorAll(".fav-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const { id, title, image } = e.target.dataset;
      addToFavourites({ id, title, image });
    })
  );
};

const viewRecipe = async (id) => {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
    );
    const recipe = await response.json();

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
              <div class="modal-content">
                <span class="close">&times;</span>
                <h2>${recipe.title}</h2>
                <img src="${recipe.image}" alt="${
      recipe.title
    }" style="width:100%; border-radius:10px;"/>
                <h3>Ingredients:</h3>
                <ul>
                  ${recipe.extendedIngredients
                    .map((ing) => `<li>${ing.original}</li>`)
                    .join("")}
                </ul>
                <h3>Instructions:</h3>
                <p>${recipe.instructions || "No instructions provided."}</p>
              </div>
            `;
    document.body.appendChild(modal);

    modal
      .querySelector(".close")
      .addEventListener("click", () => modal.remove());
  } catch (error) {
    console.error(error);
  }
};

const addToFavourites = (recipe) => {
  if (!favourites.some((item) => item.id === recipe.id)) {
    favourites.push(recipe);
    renderFavourites();
  } else {
    alert("Already in favourites!");
  }
};

const removeFromFavourites = (id) => {
  favourites = favourites.filter((item) => item.id !== id);
  renderFavourites();
};

const renderFavourites = () => {
  if (favourites.length === 0) {
    favContainer.innerHTML = `
            <h2>Your Favourites</h2>
            <p style="text-align:center;color:gray;">No favourites yet</p>
          `;
    return;
  }

  favContainer.innerHTML = `
          <h2>Your Favourites</h2>
          ${favourites
            .map(
              (item) => `
              <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" width="50" height="50"/>
                <span style="flex:1;">${item.title}</span>
                <button class="remove-btn" data-id="${item.id}">❌</button>
              </div>
            `
            )
            .join("")}
        `;

  // Attach remove listeners
  document.querySelectorAll(".remove-btn").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      removeFromFavourites(id);
    })
  );
};
