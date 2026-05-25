// InputManager: handles keyboard, gamepad, and touch input for Bato game
// Exposes a singleton `Input` with properties: left, right, up, down, jump, attack, dash, perk, pause

const Input = (function () {
  const state = {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    attack: false,
    dash: false,
    perk: false,
    pause: false,
    // Touch controls (virtual buttons)
    touch: {
      left: false,
      right: false,
      jump: false,
      attack: false,
      dash: false,
      perk: false,
    },
  };

  // Keyboard handling
  window.addEventListener('keydown', e => {
    switch (e.code) {
      case 'ArrowLeft': case 'KeyA': state.left = true; break;
      case 'ArrowRight': case 'KeyD': state.right = true; break;
      case 'ArrowUp': case 'KeyW': state.up = true; break;
      case 'ArrowDown': case 'KeyS': state.down = true; break;
      case 'Space': state.jump = true; break;
      case 'KeyJ': state.attack = true; break;
      case 'KeyK': state.dash = true; break;
      case 'KeyL': state.perk = true; break;
      case 'Escape': state.pause = true; break;
    }
  });
  window.addEventListener('keyup', e => {
    switch (e.code) {
      case 'ArrowLeft': case 'KeyA': state.left = false; break;
      case 'ArrowRight': case 'KeyD': state.right = false; break;
      case 'ArrowUp': case 'KeyW': state.up = false; break;
      case 'ArrowDown': case 'KeyS': state.down = false; break;
      case 'Space': state.jump = false; break;
      case 'KeyJ': state.attack = false; break;
      case 'KeyK': state.dash = false; break;
      case 'KeyL': state.perk = false; break;
      case 'Escape': state.pause = false; break;
    }
  });

  // Gamepad handling (simple poll)
  function pollGamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    if (!pads) return;
    const gp = pads[0];
    if (!gp) return;
    // Map typical Xbox layout
    state.left = gp.axes[0] < -0.5 || gp.buttons[14]?.pressed;
    state.right = gp.axes[0] > 0.5 || gp.buttons[15]?.pressed;
    state.up = gp.axes[1] < -0.5 || gp.buttons[12]?.pressed;
    state.down = gp.axes[1] > 0.5 || gp.buttons[13]?.pressed;
    state.jump = gp.buttons[0]?.pressed; // A
    state.attack = gp.buttons[2]?.pressed; // X
    state.dash = gp.buttons[1]?.pressed; // B
    state.perk = gp.buttons[3]?.pressed; // Y
    state.pause = gp.buttons[9]?.pressed; // Start
  }
  setInterval(pollGamepad, 100);

  // Basic touch UI (four quadrant virtual d‑pad + three action buttons)
  function createTouchControls() {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = 0;
    container.style.top = 0;
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);

    const btnSize = '12vw';
    const opacity = '0.3';
    const makeBtn = (label, left, bottom, onDown, onUp) => {
      const btn = document.createElement('div');
      btn.innerText = label;
      btn.style.position = 'absolute';
      btn.style.left = left;
      btn.style.bottom = bottom;
      btn.style.width = btnSize;
      btn.style.height = btnSize;
      btn.style.background = 'rgba(0,0,0,' + opacity + ')';
      btn.style.borderRadius = '50%';
      btn.style.display = 'flex';
      btn.style.alignItems = 'center';
      btn.style.justifyContent = 'center';
      btn.style.fontSize = '3vw';
      btn.style.color = '#fff';
      btn.style.userSelect = 'none';
      btn.style.touchAction = 'none';
      btn.style.pointerEvents = 'auto';
      btn.addEventListener('pointerdown', e => { e.preventDefault(); onDown(); });
      btn.addEventListener('pointerup', e => { e.preventDefault(); onUp(); });
      btn.addEventListener('pointerleave', e => { e.preventDefault(); onUp(); });
      container.appendChild(btn);
    };
    // D‑pad
    makeBtn('←', '5vw', '20vh', () => state.touch.left = true, () => state.touch.left = false);
    makeBtn('→', '25vw', '20vh', () => state.touch.right = true, () => state.touch.right = false);
    makeBtn('↑', '15vw', '30vh', () => state.touch.up = true, () => state.touch.up = false);
    makeBtn('↓', '15vw', '10vh', () => state.touch.down = true, () => state.touch.down = false);
    // Action buttons
    makeBtn('A', '80vw', '25vh', () => state.touch.jump = true, () => state.touch.jump = false);
    makeBtn('B', '70vw', '15vh', () => state.touch.attack = true, () => state.touch.attack = false);
    makeBtn('C', '70vw', '35vh', () => state.touch.dash = true, () => state.touch.dash = false);
    makeBtn('P', '80vw', '5vh', () => state.touch.perk = true, () => state.touch.perk = false);
  }
  if ('ontouchstart' in window) createTouchControls();

  // Public API merges physical and touch states
  return {
    get left() { return state.left || state.touch.left; },
    get right() { return state.right || state.touch.right; },
    get up() { return state.up || state.touch.up; },
    get down() { return state.down || state.touch.down; },
    get jump() { return state.jump || state.touch.jump; },
    get attack() { return state.attack || state.touch.attack; },
    get dash() { return state.dash || state.touch.dash; },
    get perk() { return state.perk || state.touch.perk; },
    get pause() { return state.pause; },
  };
})();

// Export for module systems (if used)
if (typeof module !== 'undefined') { module.exports = Input; }
