let scrollMaxY = window.scrollMaxY || (document.documentElement.scrollHeight - document.documentElement.clientHeight);

let last_known_scroll_position = 0;
let ticking = false;

let tile1 = document.createElement("img");
tile1.setAttribute("id", "tile1");
tile1.setAttribute("src", "./images/bg_tile1.png");
tile1.setAttribute("style", "position: absolute; top: 100px; left: 16px; z-index: 0;");
tile1.width = 250;
tile1.height = 50;
document.body.appendChild(tile1);

let tile2 = document.createElement("img");
tile2.setAttribute("id", "tile2");
tile2.setAttribute("src", "./images/bg_tile2.png");
tile2.setAttribute("style", "position: absolute; top: 100px; right: 50px; z-index: 0;");
document.body.appendChild(tile2);


function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function changeColor(m_colorVal) {
  let m_color_delta = (m_colorVal/scrollMaxY*65)+25;
  document.body.style.backgroundColor = hslToHex(151, 65, 100-m_color_delta);
}

window.addEventListener('scroll', function(e) {
  last_known_scroll_position = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(function() {
      changeColor(last_known_scroll_position);
      ticking = false;
    });

    ticking = true;
  }
});

document.getElementById("title_c").style.top = (window.screen.height/2-130).toString() + "px";
