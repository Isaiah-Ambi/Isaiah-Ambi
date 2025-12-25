const random = (min: number, max: number): number => {
  return Math.round(Math.random() * (max - min)) + min;
};

const getKeyFrames = (
  name: string,
  glitchPercentageDuration: number,
  steps: number = 3,
  tick: number = 0.1
): string => {
  const percentageStep = 100 / steps;

  const keyframes: {
    keys: number[];
    css: Record<string, string | number>;
  }[] = [];

  // First keyframe
  const baseKeys = [0];

  for (let i = 1; i < steps; i++) {
    const p = i * percentageStep;
    baseKeys.push(p);
    baseKeys.push(p + glitchPercentageDuration);
  }

  // Last keyframe
  baseKeys.push(100);

  keyframes.push({
    keys: baseKeys,
    css: {
      transform: "none",
      filter: "hue-rotate(0) drop-shadow(0 0 0 transparent)" // Hack to force animation in Safari
    }
  });

  for (let i = 1; i < steps; i++) {
    const p = i * percentageStep;

    // Blue / red shadow
    const color =
      Math.random() > 0.5 ? "rgb(255 0 0 / 0.1)" : "rgb(0 0 255 / 0.1)";
    const shadowX = random(-4, 4);
    const shadowY = random(-4, 4);

    keyframes.push({
      keys: [p + tick, p + glitchPercentageDuration - tick],
      css: {
        transform: `translateX(var(--glitch-x-${i}))`,
        filter: `hue-rotate(var(--glitch-hue-${i})) drop-shadow(${shadowX}px ${shadowY}px 0 ${color})`
      }
    });
  }

  const css = keyframes
    .map((keyframe) => {
      const keys = keyframe.keys
        .map((key) => `${key.toFixed(2)}%`)
        .join(",\n  ");

      const content = Object.entries(keyframe.css)
        .map(([key, value]) => `  ${key}: ${value};`)
        .join("\n  ");

      return [keys, "{", content, "}"].join("\n  ");
    })
    .join("\n\n  ");

  return `@keyframes ${name} {\n  ${css}\n}`;
};

const getStripHTML = (top: number, stripHeight: number): string => {
  const duration = random(5, 10);
  const name = `glitch-${duration}`;

  return `<div 
  class="strip" 
  style="
    --glitch-x-1: ${random(-10, 10)}em;
    --glitch-hue-1: ${random(-50, 50)}deg;
    --glitch-x-2: ${random(-10, 10)}em;
    --glitch-hue-2: ${random(-50, 50)}deg;

    background-position: 0 -${top}em;
    height: ${stripHeight}em; 
    animation-name: ${name};
    animation-duration: ${duration * 1000}ms; 
    animation-delay: ${random(0, 2)}s;
  "
></div>`;
};

const getGlitchHTML = (height: number): string[] => {
  let i = 0;
  const html: string[] = [];

  while (1) {
    const stripHeight = random(1, 6);

    if (i + stripHeight < height) {
      const strip = getStripHTML(i, stripHeight);
      html.push(strip);
    } else {
      // Last strip
      const strip = getStripHTML(i, height - i);
      html.push(strip);
      break;
    }

    i = i + stripHeight;
  }

  return html;
};

/*

If you want to generate new CSS/HTML dinamically,
uncomment the code below.

*/

// const html = getGlitchHTML(62);

// // HTML
// const $glitch = document.querySelector(".bard") as HTMLElement;
// $glitch.innerHTML = html.join("\n");

// // CSS
// const css = [5,6,7,8,9,10].map((n) => {
//   const glitchDurationMS = 500;
//   const glitchPercentageDuration = (glitchDurationMS * 100) / (n * 1000);

//   return getKeyFrames(`glitch-${n}`, glitchPercentageDuration);
// });

// // Add generated CSS to the page
// const $style = document.createElement("style");
// $style.innerHTML = css.join("\n");
// document.head.appendChild($style);

// // ----- Debug -------------- //
// // Not used for the animation //

// const $code = document.querySelector(".code");

// const escape = (html) => {
//   return html
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#039;");
// };

// $code.innerHTML = `
//   <div class="column">
//     <div class="heading">HTML</div>
//     <pre>${escape(html.join("\n\n"))}</pre>
//   </div>

//   <div class="column">
//     <div class="heading">CSS</div>
//     <pre>${css.join("\n\n")}</pre>
//   </div>
// `;
