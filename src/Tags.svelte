<script>

import { createEventDispatcher } from 'svelte'
import * as events from './events'

const dispatch = createEventDispatcher()

let tag = ''
let arrelementsmatch = []
let regExpEscape = s =>
    s.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')

export let tags
export let addKeys
export let maxTags
export let onlyUnique
export let removeKeys
export let placeholder
export let allowPaste
export let allowDrop
export let splitWith
export let autoComplete
export let autoCompleteKey
export let name
export let id
export let allowBlur
export let disable
export let minChars

// Allows true, false, or a custom string, default = false
export let nativeAutocomplete = false

export let inputLayoutClass = null
export let inputClass = null
export let autocompleteParentClass = null
export let autocompleteListClass = null
export let autocompleteItemClass = null

$: tags = tags || []
$: addKeys = addKeys || [13]
$: maxTags = maxTags || false
$: onlyUnique = onlyUnique || false
$: removeKeys = removeKeys || [8]
$: placeholder = placeholder || ""
$: allowPaste = allowPaste || false
$: allowDrop = allowDrop || false
$: splitWith = splitWith || ","
$: autoComplete = autoComplete || false
$: autoCompleteKey = autoCompleteKey || false
$: name = name || 'svelte-tags-input'
$: id = id || uniqueID()
$: allowBlur = allowBlur || false
$: disable = disable || false
$: minChars = minChars || 1

$: matchesID = id + '_matches'

$: nativeAutocompleteValue = (
    (nativeAutocomplete === false)
        ? 'off'
        : (nativeAutocomplete === true)
            ? 'on'
            : nativeAutocomplete
)

let storePlaceholder = placeholder

const uniqueID = () =>
    'sti_' + Math.random().toString(36).substr(2, 9)

const _getTags = () => tags

const _setTag = newTag => {
    tag = newTag
}

const _setTags = newTags => {
    tags = newTags
}

const _spliceTags = (index, count) => {
    tags.splice(index, count)
}

const _pushTag = newTag => {
    tags.push(newTag)
}

const _setArrelementsmatch = newItems => {
    arrelementsmatch = newItems
}

const _setPlaceholder = text => {
    placeholder = text
}

//

const getClipboardData = e => {
    if (window.clipboardData)
        return window.clipboardData.getData('Text')
    if (e.clipboardData)
        return e.clipboardData.getData('text/plain')
    return ''
}

const splitTags = data =>
    data.split(splitWith).map(tag => tag.trim())

const addTag = currentTag => events.addTag(
    currentTag,
    _getTags,
    _setTag,
    _setTags,
    _pushTag,
    _setArrelementsmatch,
    autoCompleteKey,
    maxTags,
    id,
    onlyUnique,
    placeholder,
    dispatch
)

const setTag = e => events.setTag(
    e,
    autoComplete,
    matchesID,
    addKeys,
    removeKeys,
    addTag
)

const removeTag = index => events.removeTag(
    index,
    id,
    storePlaceholder,
    _getTags,
    _setTags,
    _spliceTags,
    _setPlaceholder,
    _setArrelementsmatch,
    dispatch
)

const onPaste = e => events.onPaste(
    e,
    allowPaste,
    autoCompleteKey,
    splitTags,
    addTag,
    getClipboardData
)

const onDrop = e => events.onDrop(
    e,
    allowDrop,
    autoCompleteKey,
    splitTags,
    addTag
)

const onBlur = (e, tag) => events.onBlur(
    e,
    tag,
    allowBlur,
    matchesID,
    autoCompleteKey,
    _getTags,
    addTag
)

const getMatchElements = e => events.getMatchElements(
    e,
    autoComplete,
    autoCompleteKey,
    onlyUnique,
    minChars,
    regExpEscape,
    _setArrelementsmatch
)

const navigateAutoComplete = (
    e,
    autoCompleteIndex,
    autoCompleteLength,
    autoCompleteElement
) => events.navigateAutoComplete(
    e,
    autoComplete,
    autoCompleteIndex,
    autoCompleteLength,
    autoCompleteElement,
    matchesID,
    addTag
)

</script>

<div
    class={inputLayoutClass ? inputLayoutClass : 'svelte-tags-input-layout'}
    class:sti-layout-disable={disable}>
    
    {#if tags.length > 0}
        {#each tags as tag, i}
            <span class="svelte-tags-input-tag">
                {#if typeof tag === 'string'}
                {tag}
                {:else}
                {tag[autoCompleteKey]}
                {/if}
                {#if !disable}
                <span class="svelte-tags-input-tag-remove" on:click={() => removeTag(i)}> &#215;</span>
                {/if}
            </span>
        {/each}
    {/if}
    
    <input
        class={inputClass ? inputClass : 'svelte-tags-input'}
        type="text"
        id={id}
        name={name}
        bind:value={tag}
        on:keydown={setTag}
        on:keyup={getMatchElements}
        on:paste={onPaste}
        on:drop={onDrop}
        on:blur={e => onBlur(e, tag)}
        placeholder={placeholder}
        disabled={disable}
        autocomplete={nativeAutocompleteValue}
    >
</div>

{#if autoComplete && arrelementsmatch.length > 0}
<div class={autocompleteParentClass ? autocompleteParentClass : 'svelte-tags-input-matches-parent'}>
    <ul id="{id}_matches" class={autocompleteListClass ? autocompleteListClass : 'svelte-tags-input-matches'}>
        {#each arrelementsmatch as element, index}
            <li
                class={autocompleteItemClass ? autocompleteItemClass : ''}
                tabindex="-1"
                on:keydown={e => navigateAutoComplete(e, index, arrelementsmatch.length, element.label)}
                on:click={() => addTag(element.label)}>
                    {@html element.search}
                </li>
        {/each}
    </ul>
</div>
{/if}

<style src="tags.css"></style>
