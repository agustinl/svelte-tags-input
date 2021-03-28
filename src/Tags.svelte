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

const setTag = e => events.setTag(
    e,
    autoComplete,
    matchesID,
    addKeys,
    removeKeys
)

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


//foo,bar,biz

const onDrop = e => {
    
    if (!allowDrop) return
    
    e.preventDefault()
    
    const data = e.dataTransfer.getData('Text')
    _setTags(splitTags(data).map(tag => addTag(tag)))
    
    dispatch('tags', { tags })
    
}

const onBlur = (e, tag) => {
    
    if (
        tag && tag.length &&
        !document.getElementById(matchesID) &&
        allowBlur
    ) {
        e.preventDefault()
        addTag(tag)
    }
    
}

const getClipboardData = e => {
    
    if (window.clipboardData)
        return window.clipboardData.getData('Text')
    
    if (e.clipboardData)
        return e.clipboardData.getData('text/plain')
    
    return ''
    
}

const splitTags = data =>
    data.split(splitWith).map(tag => tag.trim())

const getMatchElements = async (input) => {
    
    if (!autoComplete) return
    
    let autoCompleteValues = []
    
    if (Array.isArray(autoComplete))
        autoCompleteValues = autoComplete
    
    if (typeof autoComplete === 'function') {
        if (autoComplete.constructor.name === 'AsyncFunction')
            autoCompleteValues = await autoComplete()
        else
            autoCompleteValues = autoComplete()
    }
    
    const value = input.target.value
    
    // Escape
    if (value == '' || input.keyCode === 27 || value.length < minChars ) {
        arrelementsmatch = []
        return
    }
    
    let matches = []
    
    if (typeof autoCompleteValues[0] === 'object' && autoCompleteValues !== null) {
        
        if (!autoCompleteKey)
            return console.error("'autoCompleteValue' is necessary if 'autoComplete' result is an array of objects")
        
        matches = autoCompleteValues
            .filter(e => e[autoCompleteKey].toLowerCase().includes(value.toLowerCase()))
            .map(matchTag => ({
                label: matchTag,
                search: matchTag[autoCompleteKey].replace(RegExp(regExpEscape(value.toLowerCase()), 'i'), "<strong>$&</strong>")
            }))
        
    } else {
        
        matches = autoCompleteValues
            .filter(e => e.toLowerCase().includes(value.toLowerCase()))
            .map(matchTag => ({
                label: matchTag,
                search: matchTag.replace(RegExp(regExpEscape(value.toLowerCase()), 'i'), "<strong>$&</strong>")
            }))
        
    }
    
    if (onlyUnique === true && !autoCompleteKey)
        matches = matches.filter(tag => !tags.includes(tag.label))
    
    arrelementsmatch = matches
    
}

const navigateAutoComplete = (e, autoCompleteIndex, autoCompleteLength, autoCompleteElement) => {
    
    if (!autoComplete) return
    
    e.preventDefault()
    
    // ArrowDown
    if (e.keyCode === 40) {
        // Last element on the list ? Go to the first
        if (autoCompleteIndex + 1 === autoCompleteLength) {
            document.getElementById(matchesID).querySelector("li:first-child").focus()
            return
        }
        document.getElementById(matchesID).querySelectorAll("li")[autoCompleteIndex + 1].focus()
    } else if (e.keyCode === 38) {
        // ArrowUp
        // First element on the list ? Go to the last
        if (autoCompleteIndex === 0) {
            document.getElementById(matchesID).querySelector("li:last-child").focus()
            return
        }
        document.getElementById(matchesID).querySelectorAll("li")[autoCompleteIndex - 1].focus()
    } else if (e.keyCode === 13) { 
        // Enter
        addTag(autoCompleteElement)
    } else if (e.keyCode === 27) {
        // Escape
        arrelementsmatch = []
        document.getElementById(id).focus()
    }
    
}

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

<style>
/* CSS svelte-tags-input */

.svelte-tags-input,
.svelte-tags-input-tag,
.svelte-tags-input-matches {
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
    font-size: 14px;
    padding: 2px 5px;
}

/* svelte-tags-input-layout */

.svelte-tags-input-layout {
    display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    -ms-flex-wrap:wrap;
        flex-wrap:wrap;
    -webkit-box-align:center;
        -ms-flex-align:center;
            align-items:center;
    padding: 0px 5px 5px 5px;
}

.svelte-tags-input-layout:focus,
.svelte-tags-input-layout:hover {
    border: solid 1px #000;    
}

/* svelte-tags-input */

.svelte-tags-input {
    -webkit-box-flex: 1;
        -ms-flex: 1;
            flex: 1; 
    margin: 0;
    /* margin-top: 5px; */
    border:none;
}

.svelte-tags-input:focus {
    outline:0;
}

/* svelte-tags-input-tag */

.svelte-tags-input-tag {
    display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    white-space: nowrap;
    list-style:none;
    background: #000;
    color: #FFF;
    border-radius: 2px;
    margin-right: 5px;
    margin-top: 5px;
}

/*.svelte-tags-input-tag:hover {
    background: #CCC;
}*/

.svelte-tags-input-tag-remove {
    cursor:pointer;
}

/* svelte-tags-input-matches */

.svelte-tags-input-matches-parent {
    position:relative;
}

.svelte-tags-input-matches {
    position:absolute;
    top:0;
    left:0;
    right:0;
    margin:3px 0;
    padding: 0px;
    background:#FFF;
    border: solid 1px #CCC;
    border-radius: 2px;
    max-height:310px;
    overflow:scroll;
    overflow-x:auto;
}

.svelte-tags-input-matches li {
    list-style:none;
    padding:5px;
    border-radius: 2px;
    cursor:pointer;
}

.svelte-tags-input-matches li:hover,
.svelte-tags-input-matches li:focus {
    background:#000;
    color:#FFF;
    outline:none;
}

/* svelte-tags-input disabled */
.svelte-tags-input-layout.sti-layout-disable,
.svelte-tags-input:disabled {
    background: #EAEAEA;
    cursor: not-allowed;
}

.svelte-tags-input-layout.sti-layout-disable:hover,
.svelte-tags-input-layout.sti-layout-disable:focus {
    border-color:#CCC;
}

.svelte-tags-input-layout.sti-layout-disable .svelte-tags-input-tag {
    background: #AEAEAE;
}

.svelte-tags-input-layout.sti-layout-disable .svelte-tags-input-tag-remove {
    cursor: not-allowed;
}
</style>
