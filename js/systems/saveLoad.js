// saveLoad.js – Simple save/load system using localStorage

// Namespace under BATO
BATO.SaveLoad = (function () {
  const STORAGE_KEY = "bato_save";

  /**
   * Save the given state object to localStorage.
   * @param {Object} state - Arbitrary game state (player position, health, perks, etc.)
   */
  function save(state) {
    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, serialized);
      console.log("Game saved.");
    } catch (e) {
      console.error("Failed to save game:", e);
    }
  }

  /**
   * Load the saved state from localStorage.
   * @returns {Object|null} The saved state or null if none exists.
   */
  function load() {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) return null;
      const state = JSON.parse(serialized);
      console.log("Game loaded.");
      return state;
    } catch (e) {
      console.error("Failed to load game:", e);
      return null;
    }
  }

  /**
   * Clear saved data.
   */
  function clear() {
    localStorage.removeItem(STORAGE_KEY);
    console.log("Save data cleared.");
  }

  // Expose public API
  return {
    save,
    load,
    clear,
  };
})();
