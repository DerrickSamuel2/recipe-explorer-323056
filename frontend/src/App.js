import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

/**
 * Small, frontend-only dataset for the app.
 * Notes:
 * - Images are embedded as lightweight inline SVG data URIs to avoid external assets.
 * - Fields are intentionally simple (no backend required).
 */
const recipesSeed = [
  {
    id: "lemon-herb-salmon",
    title: "Lemon Herb Salmon",
    description:
      "Bright, flaky salmon with a lemon-herb butter and a quick side of greens.",
    timeMinutes: 20,
    servings: 2,
    difficulty: "Easy",
    tags: ["Dinner", "Seafood", "High Protein"],
    ingredients: [
      "2 salmon fillets",
      "1 lemon (zest + juice)",
      "1 tbsp olive oil",
      "1 tbsp butter",
      "2 cloves garlic, minced",
      "1 tbsp chopped parsley",
      "Salt & pepper",
      "2 cups baby spinach",
    ],
    steps: [
      "Pat salmon dry; season with salt and pepper.",
      "Heat olive oil in a skillet over medium-high heat. Sear salmon skin-side down 3–4 minutes.",
      "Flip salmon, add butter, garlic, lemon zest and juice; spoon sauce over salmon until cooked through.",
      "Toss spinach briefly in the pan until just wilted.",
      "Finish with parsley and extra lemon to taste.",
    ],
  },
  {
    id: "chickpea-avocado-salad",
    title: "Chickpea Avocado Salad",
    description:
      "Creamy avocado, crisp veggies, and a zesty lime dressing—perfect for lunch.",
    timeMinutes: 15,
    servings: 2,
    difficulty: "Easy",
    tags: ["Lunch", "Vegetarian", "Gluten-Free"],
    ingredients: [
      "1 can chickpeas, rinsed",
      "1 ripe avocado, diced",
      "1 cup cherry tomatoes, halved",
      "1/2 cucumber, diced",
      "1/4 red onion, thinly sliced",
      "1 lime (juice)",
      "2 tbsp olive oil",
      "Salt & pepper",
      "Optional: feta, cilantro",
    ],
    steps: [
      "Combine chickpeas, tomatoes, cucumber, onion, and avocado in a bowl.",
      "Whisk lime juice, olive oil, salt, and pepper.",
      "Gently toss with dressing; top with feta/cilantro if using.",
      "Serve immediately or chill for 10 minutes for best flavor.",
    ],
  },
  {
    id: "blueberry-oat-pancakes",
    title: "Blueberry Oat Pancakes",
    description:
      "Fluffy pancakes with oats and blueberries—quick weekend comfort.",
    timeMinutes: 25,
    servings: 3,
    difficulty: "Medium",
    tags: ["Breakfast", "Sweet", "Family Friendly"],
    ingredients: [
      "1 cup rolled oats",
      "1 cup milk (dairy or oat)",
      "1 egg",
      "1 tbsp maple syrup",
      "1 tsp baking powder",
      "1/2 tsp cinnamon",
      "Pinch of salt",
      "1 cup blueberries",
      "Butter or oil for the pan",
    ],
    steps: [
      "Blend oats into a coarse flour (or leave whole for texture).",
      "Whisk milk, egg, and maple syrup. Add oats, baking powder, cinnamon, and salt.",
      "Fold in blueberries.",
      "Cook 1/4-cup scoops on a lightly oiled skillet until bubbles form; flip and cook through.",
      "Serve with yogurt, extra berries, and syrup.",
    ],
  },
  {
    id: "spicy-miso-noodles",
    title: "Spicy Miso Noodles",
    description:
      "Savory, spicy, and satisfying noodles with miso, sesame, and crunchy toppings.",
    timeMinutes: 18,
    servings: 2,
    difficulty: "Easy",
    tags: ["Dinner", "Quick", "Vegan"],
    ingredients: [
      "6 oz noodles (ramen, udon, or soba)",
      "1 tbsp white miso",
      "1 tbsp soy sauce",
      "1 tbsp sesame oil",
      "1 tbsp rice vinegar",
      "1 tsp chili paste (to taste)",
      "1 tsp honey or sugar (optional)",
      "2 scallions, sliced",
      "Sesame seeds",
      "Optional: shredded carrots, cucumbers",
    ],
    steps: [
      "Cook noodles according to package; reserve 1/4 cup cooking water and drain.",
      "Whisk miso, soy sauce, sesame oil, vinegar, chili paste, and sweetener if using.",
      "Toss noodles with sauce; loosen with reserved water as needed.",
      "Top with scallions, sesame, and crunchy veggies.",
    ],
  },
  {
    id: "tomato-basil-soup",
    title: "Roasted Tomato Basil Soup",
    description:
      "Rich roasted tomatoes blended smooth with basil for a cozy bowl any day.",
    timeMinutes: 40,
    servings: 4,
    difficulty: "Medium",
    tags: ["Soup", "Vegetarian", "Comfort Food"],
    ingredients: [
      "2 lbs tomatoes, halved",
      "1 onion, sliced",
      "4 cloves garlic",
      "2 tbsp olive oil",
      "2 cups vegetable broth",
      "1/2 cup fresh basil",
      "Salt & pepper",
      "Optional: cream or coconut milk",
    ],
    steps: [
      "Roast tomatoes, onion, and garlic at 425°F (220°C) with olive oil, salt, and pepper for ~25 minutes.",
      "Blend roasted vegetables with broth until smooth (careful with hot liquids).",
      "Simmer 10 minutes; stir in basil and optional cream.",
      "Adjust seasoning and serve with crusty bread.",
    ],
  },
];

/**
 * Generate a compact inline SVG placeholder image based on recipe title.
 * This avoids needing image assets while still looking polished.
 */
function makeRecipeImageDataUri(title, accentHex) {
  const safeTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").slice(0, 28);
  const bg = "#ffffff";
  const soft = "#f1f5f9";
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${accentHex}" stop-opacity="0.18"/>
      <stop offset="1" stop-color="${soft}" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="750" rx="36" fill="url(#g)"/>
  <rect x="64" y="64" width="1072" height="622" rx="28" fill="${bg}" fill-opacity="0.92"/>
  <circle cx="180" cy="200" r="44" fill="${accentHex}" fill-opacity="0.22"/>
  <circle cx="240" cy="240" r="18" fill="${accentHex}" fill-opacity="0.22"/>
  <circle cx="290" cy="200" r="24" fill="${accentHex}" fill-opacity="0.22"/>
  <text x="120" y="420" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial"
        font-size="54" font-weight="700" fill="#0f172a">${safeTitle}</text>
  <text x="120" y="485" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial"
        font-size="28" font-weight="500" fill="#334155">Recipe Explorer</text>
  <text x="120" y="560" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial"
        font-size="22" font-weight="500" fill="#64748b">Frontend-only demo data • No backend</text>
</svg>`.trim();
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function formatMinutes(minutes) {
  if (!Number.isFinite(minutes)) return "";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function includesQuery(text, query) {
  return text.toLowerCase().includes(query.toLowerCase());
}

// PUBLIC_INTERFACE
function App() {
  const [query, setQuery] = useState("");
  const [activeRecipeId, setActiveRecipeId] = useState(null);

  // Ensure the app stays in light theme (per request).
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  const recipes = useMemo(() => {
    const accents = ["#3b82f6", "#06b6d4", "#6366f1", "#0ea5e9", "#14b8a6"];
    return recipesSeed.map((r, idx) => ({
      ...r,
      accent: accents[idx % accents.length],
      imageDataUri: makeRecipeImageDataUri(r.title, accents[idx % accents.length]),
      searchBlob: [
        r.title,
        r.description,
        r.difficulty,
        r.tags.join(" "),
        r.ingredients.join(" "),
      ].join(" • "),
    }));
  }, []);

  const filtered = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return recipes;
    return recipes.filter((r) => includesQuery(r.searchBlob, trimmed));
  }, [query, recipes]);

  const activeRecipe = useMemo(() => {
    if (!activeRecipeId) return null;
    return recipes.find((r) => r.id === activeRecipeId) || null;
  }, [activeRecipeId, recipes]);

  function openRecipe(recipeId) {
    setActiveRecipeId(recipeId);
    // Keep keyboard focus near top for accessibility when switching views
    requestAnimationFrame(() => {
      const el = document.getElementById("main");
      if (el) el.focus();
    });
  }

  function goHome() {
    setActiveRecipeId(null);
    requestAnimationFrame(() => {
      const el = document.getElementById("search");
      if (el) el.focus();
    });
  }

  return (
    <div className="App">
      <a className="skipLink" href="#main">
        Skip to content
      </a>

      <header className="topbar">
        <div className="container topbarInner">
          <div className="brand" role="banner" aria-label="Recipe Explorer">
            <div className="brandMark" aria-hidden="true">
              <span className="brandDot brandDotPrimary" />
              <span className="brandDot brandDotSuccess" />
            </div>
            <div className="brandText">
              <div className="brandTitle">Recipe Explorer</div>
              <div className="brandSubtitle">Browse • Search • Cook</div>
            </div>
          </div>

          <div className="searchWrap">
            <label className="srOnly" htmlFor="search">
              Search recipes
            </label>
            <div className="searchControl">
              <span className="searchIcon" aria-hidden="true">
                ⌕
              </span>
              <input
                id="search"
                className="searchInput"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, tag, or ingredient…"
                autoComplete="off"
              />
              {query.trim().length > 0 ? (
                <button
                  type="button"
                  className="btn btnGhost btnSmall"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>

          <div className="topbarActions">
            {activeRecipe ? (
              <button type="button" className="btn btnSecondary" onClick={goHome}>
                ← Back to results
              </button>
            ) : (
              <div className="pill" aria-label="Recipe count">
                <span className="pillStrong">{filtered.length}</span>{" "}
                <span className="pillMuted">recipes</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main
        id="main"
        className="main"
        tabIndex={-1}
        aria-label={activeRecipe ? "Recipe details" : "Recipe results"}
      >
        <div className="container">
          {activeRecipe ? (
            <RecipeDetails recipe={activeRecipe} onBack={goHome} />
          ) : (
            <RecipeResults
              query={query}
              recipes={filtered}
              totalCount={recipes.length}
              onOpenRecipe={openRecipe}
            />
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container footerInner">
          <div className="footerText">
            Frontend-only demo • Built with React • Data is local and static
          </div>
        </div>
      </footer>
    </div>
  );
}

function RecipeResults({ query, recipes, totalCount, onOpenRecipe }) {
  const hasQuery = query.trim().length > 0;

  return (
    <section className="results">
      <div className="resultsHeader">
        <div>
          <h1 className="h1">Discover recipes</h1>
          <p className="subtle">
            {hasQuery ? (
              <>
                Showing <strong>{recipes.length}</strong> result(s) for{" "}
                <span className="queryPill">“{query.trim()}”</span>
              </>
            ) : (
              <>
                Browse <strong>{totalCount}</strong> curated recipes. Use search to
                filter by ingredient, tag, or title.
              </>
            )}
          </p>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="emptyState" role="status" aria-live="polite">
          <div className="emptyTitle">No matches found</div>
          <div className="emptyText">
            Try a different keyword like <strong>tomato</strong>,{" "}
            <strong>vegan</strong>, or <strong>salmon</strong>.
          </div>
        </div>
      ) : (
        <div className="grid" role="list" aria-label="Recipe list">
          {recipes.map((r) => (
            <article key={r.id} className="card" role="listitem">
              <div className="cardMedia" style={{ "--accent": r.accent }}>
                <img className="cardImage" src={r.imageDataUri} alt="" />
                <div className="cardBadges">
                  {r.tags.slice(0, 2).map((t) => (
                    <span key={t} className="badge">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="cardBody">
                <h2 className="cardTitle">{r.title}</h2>
                <p className="cardDesc">{r.description}</p>

                <div className="metaRow" aria-label="Recipe metadata">
                  <span className="metaItem">
                    <span className="metaLabel">Time</span>
                    <span className="metaValue">{formatMinutes(r.timeMinutes)}</span>
                  </span>
                  <span className="metaItem">
                    <span className="metaLabel">Serves</span>
                    <span className="metaValue">{r.servings}</span>
                  </span>
                  <span className="metaItem">
                    <span className="metaLabel">Level</span>
                    <span className="metaValue">{r.difficulty}</span>
                  </span>
                </div>

                <div className="cardActions">
                  <button
                    type="button"
                    className="btn btnPrimary"
                    onClick={() => onOpenRecipe(r.id)}
                    aria-label={`Open recipe: ${r.title}`}
                  >
                    View recipe
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function RecipeDetails({ recipe, onBack }) {
  return (
    <article className="details">
      <div className="detailsTop">
        <div className="detailsMedia" style={{ "--accent": recipe.accent }}>
          <img className="detailsImage" src={recipe.imageDataUri} alt="" />
        </div>

        <div className="detailsIntro">
          <div className="detailsNav">
            <button type="button" className="btn btnGhost" onClick={onBack}>
              ← Back
            </button>
          </div>

          <h1 className="detailsTitle">{recipe.title}</h1>
          <p className="detailsDesc">{recipe.description}</p>

          <div className="detailsMeta" aria-label="Recipe metadata">
            <div className="metaChip">
              <span className="metaChipLabel">Time</span>
              <span className="metaChipValue">{formatMinutes(recipe.timeMinutes)}</span>
            </div>
            <div className="metaChip">
              <span className="metaChipLabel">Servings</span>
              <span className="metaChipValue">{recipe.servings}</span>
            </div>
            <div className="metaChip">
              <span className="metaChipLabel">Difficulty</span>
              <span className="metaChipValue">{recipe.difficulty}</span>
            </div>
          </div>

          <div className="tagRow" aria-label="Tags">
            {recipe.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="detailsGrid">
        <section className="panel" aria-label="Ingredients">
          <h2 className="h2">Ingredients</h2>
          <ul className="list">
            {recipe.ingredients.map((ing) => (
              <li key={ing} className="listItem">
                <span className="bullet" aria-hidden="true" />
                <span>{ing}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel" aria-label="Steps">
          <h2 className="h2">Steps</h2>
          <ol className="steps">
            {recipe.steps.map((step) => (
              <li key={step} className="stepItem">
                <div className="stepIndex" aria-hidden="true" />
                <div className="stepText">{step}</div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}

export default App;
