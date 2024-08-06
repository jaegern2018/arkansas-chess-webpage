async function screenForScript(text) {
    // To prevent script injection.
    // Permitting other html however.
    // There's probably ways to work around this, its just a better-than-nothing precaution
    // Nobody should be touching the files being pulled anyway, and if they did have access, they could just modify this one instead, so...
    return text.replace(/script/, 'scr&zwsp;ipt');
}

async function fillWithContent(query, path, loading_msg = "Loading content", err_msg = "Failed to fetch content; please check your internet connection or contact the site administrator.") {
    const elements = document.querySelectorAll(query);
    for (const element of elements) {
        if (element == null) {
            console.warn(`Failed to find "${query}"; skipping`);
            return;
        }
        element.innerText = loading_msg;
        try {
            let data = await fetch(`data/${path}`);
            if (data.ok) {
                element.innerHTML = await screenForScript(await data.text());
            }
            else {
                element.innerText = err_msg;
                console.error(`Failed to fetch data/${path}: status code ${data.status}`);
            }
        }
        catch (err) {
            element.innerText = err_msg;
            console.error(err);
        }
    }
}

addEventListener("DOMContentLoaded", (event) => {
    const urlPath = document.location.pathname;
    const parsedPath = urlPath.replace("/", "-").replace(/\.html/, "").slice(1);
    // All
    fillWithContent("title", `${parsedPath}-page-title.txt`);
    // index page
    fillWithContent("#index-main", "index-main.txt");
    // about page
    fillWithContent("#about-main", "about-main.txt");
    // calendar page
    fillWithContent("#calendar-main", "calendar-main.txt");
    fillWithContent("#calendar-gcal-embed", "calendar-gcal-embed.txt");
    // membership-page
    fillWithContent("#membership-main", "membership-main.txt");
});
