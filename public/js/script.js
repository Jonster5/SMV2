function expand(a) {
    let article = document.getElementById(a);
    let a_h = a + "_h";
    article.style.width = "540px";
    document.getElementById(a_h).setAttribute("style", "display: inline-block;");
}

function reset(a) {
    let article = document.getElementById(a);
    let a_h = a + "_h";
    article.style.width = "270px";
    document.getElementById(a_h).setAttribute("style", "display: none;");
}

function buttons(wo) {
    switch (wo) {
        case 1:
            location.assign("/tutorials");
            break;
        case 2:
            location.assign("/codepebble");
            break;
        case 3:
            location.assign("/games");
            break;
    }
}