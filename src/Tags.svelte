<script>
	let {
		tags = $bindable([]),
		addKeys = [13],
		maxTags = false,
		onlyUnique = false,
		removeKeys = [8],
		placeholder = '',
		allowPaste = false,
		allowDrop = false,
		splitWith = ',',
		autoComplete = false,
		autoCompleteFilter = true,
		autoCompleteKey = false,
		autoCompleteMarkupKey = false,
		autoCompleteStartFocused = false,
		name = 'svelte-tags-input',
		id: idProp,
		allowBlur = false,
		disable = false,
		minChars = 1,
		onlyAutocomplete = false,
		labelText,
		labelShow = false,
		readonly = false,
		onTagClick = () => {},
		autoCompleteShowKey,
		onTagAdded = () => {},
		onTagRemoved = () => {},
		cleanOnBlur = false,
		customValidation = false,
	} = $props();

	let tagInput = $state('');
	let arrelementsmatch = $state([]);
	let layoutElement = $state(null);
	let generatedId = $state('sti_' + Math.random().toString(36).substring(2, 11));

	let id = $derived(idProp || generatedId);
	let matchsID = $derived(id + '_matchs');
	let autoCompleteIndexStart = $derived(autoCompleteStartFocused ? 0 : -1);
	let autoCompleteIndex = $state(-1);
	let displayPlaceholder = $derived(maxTags && tags.length >= maxTags ? '' : placeholder);
	let resolvedLabelText = $derived(labelText ?? name);
	let resolvedAutoCompleteShowKey = $derived(autoCompleteShowKey ?? autoCompleteKey);

	const keyCodeMap = { Enter: 13, Backspace: 8, Escape: 27, ArrowDown: 40, ArrowUp: 38 };

	/**
	 * Escapes regex special chars for safe RegExp use.
	 * @param {string} s - String to escape
	 * @returns {string} Escaped string
	 */
	let regExpEscape = (s) => {
		return s.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
	};

	/**
	 * Handles keydown: add tag (Enter), remove (Backspace),
	 * autocomplete nav (ArrowUp/Down), close (Escape).
	 * @param {KeyboardEvent} e - Key event
	 * @returns {void}
	 */
	function setTag(e) {
		const matches = document.getElementById(matchsID);
		const focusedElement = matches?.querySelector('li.focus')?.textContent;
		const currentTag = focusedElement ?? e.target.value;
		const keyCode = e.keyCode ?? keyCodeMap[e.key];

		if (addKeys) {
			addKeys.forEach(function (key) {
				if (key === keyCode) {
					if (currentTag) e.preventDefault();
					if (autoComplete && onlyAutocomplete && document.getElementById(matchsID)) {
						addTag(arrelementsmatch?.[autoCompleteIndex]?.label);
					} else {
						addTag(currentTag);
					}
				}
			});
		}

		if (removeKeys) {
			removeKeys.forEach(function (key) {
				if (key === keyCode && tagInput === '') {
					tags = tags.slice(0, -1);
					arrelementsmatch = [];
					document.getElementById(id).readOnly = false;
					document.getElementById(id).focus();
				}
			});
		}
		
		if (keyCode === 40 && autoComplete && document.getElementById(matchsID)) {
			autoCompleteIndex++;
			if (autoCompleteIndex >= arrelementsmatch.length || autoCompleteIndex < 0) {
				autoCompleteIndex = 0;
			}
		} else if (keyCode === 38) {
			autoCompleteIndex--;
			if (autoCompleteIndex < 0 || autoCompleteIndex >= arrelementsmatch.length) {
				autoCompleteIndex = arrelementsmatch.length - 1;
			}
		} else if (keyCode === 27) {
			arrelementsmatch = [];
			document.getElementById(id).focus();
		}
	}

	/**
	 * Adds tag if valid: checks empty, maxTags, onlyUnique,
	 * onlyAutocomplete, customValidation. Supports string or object tags.
	 * @param {string | Record<string, unknown>} currentTag - Tag to add
	 * @returns {void}
	 */
	function addTag(currentTag) {
		let currentObjTags = null;

		if (typeof currentTag === 'object' && currentTag !== null) {
			if (!autoCompleteKey) {
				return console.error(
					"'autoCompleteKey' is necessary if 'autoComplete' result is an array of objects"
				);
			}
			if (onlyUnique) {
				let found = tags?.find((elem) => elem[autoCompleteKey] === currentTag[autoCompleteKey]);
				if (found) return;
			}
			currentObjTags = currentTag;
			currentTag = currentTag[autoCompleteKey].trim();
		} else {
			currentTag = (currentTag ?? '').trim();
		}

		if (currentTag == '') return;
		if (maxTags && tags.length == maxTags) return;
		if (onlyUnique && tags.includes(currentTag)) return;
		if (onlyAutocomplete && arrelementsmatch.length === 0) return;
		if (customValidation && !customValidation(currentTag)) return;

		tags = [...tags, currentObjTags ? currentObjTags : currentTag];
		tagInput = '';
		onTagAdded(currentTag, tags);

		arrelementsmatch = [];
		autoCompleteIndex = autoCompleteIndexStart;
		document.getElementById(id).focus();

		if (maxTags && tags.length == maxTags) {
			document.getElementById(id).readOnly = true;
		}
	}

	/**
	 * Removes tag at index, calls onTagRemoved with the removed tag.
	 * @param {number} i - Index of tag to remove
	 * @returns {void}
	 */
	function removeTag(i) {
		const removed = tags[i];
		tags = tags.filter((_, idx) => idx !== i);
		onTagRemoved(removed, tags);

		arrelementsmatch = [];
		document.getElementById(id).readOnly = false;
		document.getElementById(id).focus();
	}

	/**
	 * Handles paste: splits by splitWith and adds each tag (if allowPaste).
	 * @param {ClipboardEvent} e - Paste event
	 * @returns {void}
	 */
	function onPaste(e) {
		if (!allowPaste) return;
		e.preventDefault();
		const data = getClipboardData(e);
		splitTags(data).map((t) => addTag(t));
	}

	/**
	 * Handles drop: splits dragged text and adds tags (if allowDrop).
	 * @param {DragEvent} e - Drop event
	 * @returns {void}
	 */
	function onDrop(e) {
		if (!allowDrop) return;
		e.preventDefault();
		const data = e.dataTransfer.getData('Text');
		splitTags(data).map((t) => addTag(t));
	}

	/**
	 * Adds focus class to layout on input focus.
	 * @returns {void}
	 */
	function onFocus() {
		layoutElement?.classList.add('focus');
	}

	/**
	 * Handles blur: optionally adds tag (allowBlur), clears input (cleanOnBlur).
	 * @param {FocusEvent} e - Blur event
	 * @param {string} currentTag - Current input value
	 * @returns {void}
	 */
	function onBlur(e, currentTag) {
		layoutElement?.classList.remove('focus');

		if (allowBlur) {
			if (arrelementsmatch.length && autoCompleteIndex > -1) {
				addTag(arrelementsmatch?.[autoCompleteIndex]?.label);
			} else if (!arrelementsmatch.length) {
				e.preventDefault();
				addTag(currentTag);
			}
		}
		if (cleanOnBlur) {
			tagInput = '';
		}
		arrelementsmatch = [];
		autoCompleteIndex = autoCompleteIndexStart;
	}

	/**
	 * On input click: shows all autocomplete matches when minChars is 0.
	 * @returns {void}
	 */
	function onClick() {
		if (minChars == 0) getMatchElements();
	}

	/**
	 * Gets plain text from clipboard (clipboardData or clipboardData API).
	 * @param {ClipboardEvent} e - Clipboard event
	 * @returns {string} Clipboard text or empty string
	 */
	function getClipboardData(e) {
		if (window.clipboardData) {
			return window.clipboardData.getData('Text');
		}
		if (e.clipboardData) {
			return e.clipboardData.getData('text/plain');
		}
		return '';
	}

	/**
	 * Splits string by splitWith and trims each part.
	 * @param {string} data - String to split
	 * @returns {string[]} Array of trimmed tag strings
	 */
	function splitTags(data) {
		return data.split(splitWith).map((t) => t.trim());
	}

	/**
	 * Escapes HTML entities for safe display.
	 * @param {string} string - Raw string
	 * @returns {string} HTML-escaped string
	 */
	function escapeHTML(string) {
		const htmlEscapes = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#x27;',
			'/': '&#x2F;',
		};
		return ('' + string).replace(/[&<>"'\/]/g, (match) => htmlEscapes[match]);
	}

	/**
	 * Wraps matching search substring in <strong> within escaped value.
	 * @param {string} search - Search term (case-insensitive)
	 * @param {string} value - Full string to highlight
	 * @returns {string} HTML with match wrapped in <strong>
	 */
	function buildMatchMarkup(search, value) {
		return escapeHTML(value).replace(
			RegExp(regExpEscape(search.toLowerCase()), 'i'),
			'<strong>$&</strong>'
		);
	}

	/**
	 * Fetches autocomplete matches from array or fn, filters, builds match objects.
	 * Updates arrelementsmatch and autoCompleteIndex.
	 * @param {KeyboardEvent} [input] - Keyup event (optional)
	 * @returns {Promise<void>}
	 */
	async function getMatchElements(input) {
		if (!autoComplete) return;
		if (maxTags && tags.length >= maxTags) return;

		let value = input ? input.target.value : '';
		let autoCompleteValues = [];

		if (Array.isArray(autoComplete)) {
			autoCompleteValues = autoComplete;
		}
		if (typeof autoComplete === 'function') {
			if (autoComplete.constructor.name === 'AsyncFunction') {
				autoCompleteValues = await autoComplete(value);
			} else {
				autoCompleteValues = autoComplete(value);
			}
		}
		if (autoCompleteValues.constructor.name === 'Promise') {
			autoCompleteValues = await autoCompleteValues;
		}

		const keyCode = input?.keyCode ?? keyCodeMap[input?.key];
		if (
			(minChars > 0 && value == '') ||
			(input && keyCode === 27) ||
			value.length < minChars
		) {
			arrelementsmatch = [];
			return;
		}

		let matchs = autoCompleteValues;

		if (typeof autoCompleteValues[0] === 'object' && autoCompleteValues !== null) {
			if (!autoCompleteKey) {
				return console.error(
					"'autoCompleteValue' is necessary if 'autoComplete' result is an array of objects"
				);
			}
			if (autoCompleteFilter !== false) {
				matchs = autoCompleteValues.filter((e) =>
					e[autoCompleteKey].toLowerCase().includes(value.toLowerCase())
				);
			}
			matchs = matchs.map((matchTag) => ({
				label: matchTag,
				search: autoCompleteMarkupKey
					? matchTag[autoCompleteMarkupKey]
					: buildMatchMarkup(value, matchTag[autoCompleteKey]),
			}));
		} else {
			if (autoCompleteFilter !== false) {
				matchs = autoCompleteValues.filter((e) =>
					e.toLowerCase().includes(value.toLowerCase())
				);
			}
			matchs = matchs.map((matchTag) => ({
				label: matchTag,
				search: buildMatchMarkup(value, matchTag),
			}));
		}

		if (onlyUnique === true && !autoCompleteKey) {
			matchs = matchs.filter((t) => !tags.includes(t.label));
		}

		arrelementsmatch = matchs;
		// Don't reset navigation index on ArrowUp/Down - keyup runs after keydown and would overwrite it
		if (keyCode !== 38 && keyCode !== 40) {
			autoCompleteIndex = autoCompleteIndexStart;
		}
	}
</script>

<div
	class="svelte-tags-input-layout"
	class:sti-layout-disable={disable}
	class:sti-layout-readonly={readonly}
	bind:this={layoutElement}
>
	<label for={id} class={labelShow ? '' : 'sr-only'}>{resolvedLabelText}</label>

	{#if tags.length > 0}
		{#each tags as tagItem, i}
			<button type="button" class="svelte-tags-input-tag" onclick={() => onTagClick(tagItem)}>
				{#if typeof tagItem === 'string'}
					{tagItem}
				{:else}
					{tagItem[resolvedAutoCompleteShowKey]}
				{/if}
				{#if !disable && !readonly}
					<span
						role="button"
						tabindex="-1"
						class="svelte-tags-input-tag-remove"
						onpointerdown={(e) => {
							e.preventDefault();
							removeTag(i);
						}}
					>
						&#215;
					</span>
				{/if}
			</button>
		{/each}
	{/if}
	<input
		type="text"
		id={id}
		name={name}
		bind:value={tagInput}
		onkeydown={setTag}
		onkeyup={getMatchElements}
		onpaste={onPaste}
		ondrop={onDrop}
		onfocus={onFocus}
		onblur={(e) => onBlur(e, tagInput)}
		onpointerdown={onClick}
		class="svelte-tags-input"
		placeholder={displayPlaceholder}
		disabled={disable || readonly}
		autocomplete="off"
	/>
</div>

{#if autoComplete && arrelementsmatch.length > 0}
	<div class="svelte-tags-input-matchs-parent">
		<ul id="{id}_matchs" class="svelte-tags-input-matchs">
			{#each arrelementsmatch as element, index}
				<li
					tabindex="-1"
					class:focus={index === autoCompleteIndex}
					onpointerdown={(e) => {
						e.preventDefault();
						addTag(element.label);
					}}
				>
					{@html element.search}
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	/* CSS svelte-tags-input */

	.svelte-tags-input,
	.svelte-tags-input-tag,
	.svelte-tags-input-matchs,
	.svelte-tags-input-layout label {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
		font-size: 14px;
		padding: 2px 5px;
	}

	.svelte-tags-input-layout label {
		margin: 4px 5px 0 0;
		padding: 0;
		font-weight: 500;
	}

	.svelte-tags-input-layout {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		padding: 0px 5px 5px 5px;
		border: solid 1px #ccc;
		background: #fff;
		border-radius: 2px;
	}

	.svelte-tags-input-layout:focus,
	.svelte-tags-input-layout:hover {
		border: solid 1px #000;
	}

	.svelte-tags-input-layout:focus-within {
		outline: 5px auto -webkit-focus-ring-color;
	}

	.svelte-tags-input {
		background: unset;
		-webkit-box-flex: 1;
		-ms-flex: 1;
		flex: 1;
		margin: 0;
		margin-top: 5px;
		border: none;
	}

	.svelte-tags-input:focus {
		outline: 0;
	}

	.svelte-tags-input-tag {
		cursor: text;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		white-space: nowrap;
		user-select: text;
		list-style: none;
		background: #000;
		border: none;
		color: #fff;
		border-radius: 2px;
		margin-right: 5px;
		margin-top: 5px;
		font-weight: 400;
	}

	.svelte-tags-input-tag-remove {
		cursor: pointer;
		margin-left: 5px;
	}

	.svelte-tags-input-matchs-parent {
		position: relative;
	}

	.svelte-tags-input-matchs {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		margin: 3px 0;
		padding: 0px;
		background: #fff;
		border: solid 1px #ccc;
		border-radius: 2px;
		max-height: 310px;
		overflow: scroll;
		overflow-x: auto;
	}

	.svelte-tags-input-matchs li {
		list-style: none;
		padding: 5px;
		border-radius: 2px;
		cursor: pointer;
	}

	.svelte-tags-input-matchs li:hover,
	.svelte-tags-input-matchs li.focus {
		background: #000;
		color: #fff;
		outline: none;
	}

	.svelte-tags-input:disabled {
		background: transparent;
	}

	.svelte-tags-input-layout.sti-layout-disable,
	.svelte-tags-input-layout.sti-layout-disable input {
		cursor: not-allowed;
		background: #eaeaea;
	}

	.svelte-tags-input-layout.sti-layout-disable:hover,
	.svelte-tags-input-layout.sti-layout-disable:focus,
	.svelte-tags-input-layout.sti-layout-readonly:hover,
	.svelte-tags-input-layout.sti-layout-readonly:focus {
		border-color: #ccc;
	}

	.svelte-tags-input-layout.sti-layout-disable .svelte-tags-input-tag {
		background: #aeaeae;
	}

	.svelte-tags-input-layout.sti-layout-disable .svelte-tags-input-tag-remove {
		cursor: not-allowed;
	}

	.svelte-tags-input-layout label.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
