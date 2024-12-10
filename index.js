document.addEventListener('DOMContentLoaded', function() {
    const content = document.getElementById('content');

   
    document.getElementById('nav-home').addEventListener('click', function (e) {
        e.preventDefault(); 
        loadHome();
    });

    document.getElementById('nav-search').addEventListener('click', function (e) {
        e.preventDefault(); 
        loadSearch();
    });

    loadHome();


    function loadHome() {
        content.innerHTML = `
            <h1>Welcome to Johan's Cocktail Wiki!</h1>
            <div id="random-cocktail">
                <p>Laddar...</p>
            </div>
            <button id="new-cocktail">Generate new cocktail</button>
        `;
        fetchRandomCocktail();

        document.getElementById('new-cocktail').addEventListener('click', fetchRandomCocktail);
    }

    function loadSearch() {
        content.innerHTML = `
            <h1>Search for Cocktails</h1>
            <form id="searchForm">
                <input type="text" id="cocktailName" placeholder="Enter cocktail name" required>
                <button type="submit">Search</button>
            </form>
            <ul id="cocktailList"></ul>
        `;

        document.getElementById('searchForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const cocktailName = document.getElementById('cocktailName').value.trim();
            const cocktailList = document.getElementById('cocktailList');
            cocktailList.innerHTML = '';

            if (!cocktailName) {
                alert('Please enter a cocktail name.');
                return;
            }

            fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`)
                .then(res => res.json())
                .then(data => {
                    if (data.drinks) {
                        data.drinks.forEach(drink => {
                            const listItem = document.createElement('li');
                            listItem.textContent = drink.strDrink;
                            listItem.className = 'cocktail-item';
                            listItem.addEventListener('click', () => renderDetails(drink.idDrink));
                            cocktailList.appendChild(listItem);
                        });
                    } else {
                        cocktailList.innerHTML = '<li>No cocktails found.</li>';
                }
            })
            .catch(() => {
                cocktailList.innerHTML = '<li>Error fetching cocktail data. Please try again later.</li>';
            });
    });
    
}


function fetchRandomCocktail() {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
    .then(response => response.json())
    .then(data => {
        const drink = data.drinks[0];

        const randomCocktailDiv = document.getElementById('random-cocktail');
        randomCocktailDiv.innerHTML = ''; 

        const title = document.createElement('h2');
        title.textContent = drink.strDrink; 
        randomCocktailDiv.appendChild(title); 

        const image = document.createElement('img');
        image.src = drink.strDrinkThumb;
        image.alt = drink.strDrink;
        image.style.maxWidth = '300px';
        randomCocktailDiv.appendChild(image);

        const button = document.createElement('button'); 
        button.textContent = 'See more';
        button.id = 'see-more'; 
        randomCocktailDiv.appendChild(button); 

        button.onclick = function () {
            renderDetails(drink.idDrink);

        };
    });
}

function renderDetails(cocktailId) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailId}`)
    .then(response => response.json())
    .then(data => {
        const cocktail = data.drinks[0]; 

        const content = document.getElementById('content');
        content.innerHTML = ''; 
        
        const title = document.createElement('h1');
        title.textContent = cocktail.strDrink;
        content.appendChild(title);

        const image = document.createElement('img');
        image.src = cocktail.strDrinkThumb;
        image.alt = 'Picture of ' + cocktail.strDrink;
        content.appendChild(image);

        const category = document.createElement('p');
        category.textContent = 'Category: ' + cocktail.strCategory;
        content.appendChild(category);

        const tags = document.createElement('p');
        tags.textContent = 'Tags: ' + (cocktail.strTags || 'No tag');
        content.appendChild(tags);

        const glass = document.createElement('p');
        glass.textContent = 'Served in: ' + cocktail.strGlass;
        content.appendChild(glass);

        const instructions = document.createElement('p');
        instructions.textContent = cocktail.strInstructions;
        content.appendChild(instructions);

        const ingredientsTitle = document.createElement('h3');
        ingredientsTitle.textContent = 'Ingredients:';
        content.appendChild(ingredientsTitle);

        const ingredientsList = document.createElement('ul');
        ingredientsList.innerHTML = renderIngredients(cocktail).join('');
        content.appendChild(ingredientsList);

        const backButton = document.createElement('button');
        backButton.textContent = 'Go back';
        backButton.addEventListener('click', function() {
            window.location.href = 'index.html'; 
        });
        content.appendChild(backButton);
    });
}

function renderIngredients(cocktail) {
    const Ingredients = [];
    for (let i = 1; i <= 15; i++) {
        const Ingredient = cocktail[`strIngredient${i}`];
        const measure = cocktail[`strMeasure${i}`];
        if (Ingredient) {
            Ingredients.push(`<li>${Ingredient} - ${measure || 'No amount specified'}</li>`);

        }
    }
    return Ingredients;
}
});