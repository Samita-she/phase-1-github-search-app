document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("search-form");
    const resultsDiv = document.getElementById("results");

    // Function to fetch and display users
    async function fetchUsers(query) {
        const url = `https://api.github.com/search/users?q=${query}`;
        const headers = {
            Accept: "application/vnd.github.v3+json",
        };

        try {
            const response = await fetch(url, { headers });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();

            // Clear previous results
            resultsDiv.innerHTML = "";

            // Display user results
            data.items.forEach((user) => {
                const userCard = document.createElement("div");

                userCard.innerHTML = `
          <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50">
          <p><a href="${user.html_url}" target="_blank">${user.login}</a></p>
          <button data-username="${user.login}">View Repositories</button>
        `;

                resultsDiv.appendChild(userCard);
            });
        } catch (error) {
            console.error(error);
            resultsDiv.innerHTML = `<p>Error fetching users. Please try again later.</p>`;
        }
    }

    // Function to fetch and display repositories for a user
    async function fetchRepos(username) {
        const url = `https://api.github.com/users/${username}/repos`;
        const headers = {
            Accept: "application/vnd.github.v3+json",
        };

        try {
            const response = await fetch(url, { headers });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const repos = await response.json();

            // Clear previous results
            resultsDiv.innerHTML = `<h2>Repositories for ${username}</h2>`;

            repos.forEach((repo) => {
                const repoCard = document.createElement("div");

                repoCard.innerHTML = `
          <p><a href="${repo.html_url}" target="_blank">${repo.name}</a></p>
        `;

                resultsDiv.appendChild(repoCard);
            });
        } catch (error) {
            console.error(error);
            resultsDiv.innerHTML = `<p>Error fetching repositories. Please try again later.</p>`;
        }
    }

    // Event listener for form submission
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = document.getElementById("search-input").value;
        fetchUsers(query);
    });

    // Event listener for repository buttons
    resultsDiv.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") {
            const username = event.target.getAttribute("data-username");
            fetchRepos(username);
        }
    });
});
