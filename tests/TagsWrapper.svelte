<script>
	import Tags from '../src/Tags.svelte';

	let {
		tags = $bindable([]),
		placeholder = '',
		maxTags = false,
		allowPaste = false,
		allowDrop = false,
		onlyUnique = false,
		disable = false,
		readonly = false,
		autoComplete = false,
		autoCompleteStartFocused = false,
		onlyAutocomplete = false,
		minChars = 1,
		customValidation = null,
		onTagAdded = () => {},
		onTagRemoved = () => {},
		onTagClick = () => {},
		...rest
	} = $props();
</script>

<Tags
	bind:tags
	{placeholder}
	{maxTags}
	{allowPaste}
	{allowDrop}
	{onlyUnique}
	{disable}
	{readonly}
	{autoComplete}
	{autoCompleteStartFocused}
	{onlyAutocomplete}
	{minChars}
	{customValidation}
	{onTagAdded}
	{onTagRemoved}
	{onTagClick}
	{...rest}
/>
