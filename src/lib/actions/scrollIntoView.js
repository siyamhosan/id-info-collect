/**
 * Svelte action to scroll element into view
 * @param {HTMLElement} node
 * @param {boolean} enabled
 */
export function scrollIntoView(node, enabled = true) {
	function scroll() {
		if (enabled) {
			node.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	// Scroll on mount if enabled
	if (enabled) {
		setTimeout(scroll, 100); // Small delay to ensure DOM is ready
	}

	return {
		/**
		 * @param {boolean} newEnabled
		 */
		update(newEnabled) {
			enabled = newEnabled;
			if (enabled) {
				scroll();
			}
		}
	};
}
