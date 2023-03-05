<script>

let tag = "";
let arrelementsmatch = [];
let autoCompleteIndex = -1;

let regExpEscape = (s) => {
  return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&")
}

export let tags;
export let addKeys;
export let maxTags;
export let onlyUnique;
export let removeKeys;
export let placeholder;
export let allowPaste;
export let allowDrop;
export let splitWith;
export let autoComplete;
export let autoCompleteFilter;
export let autoCompleteKey;
export let autoCompleteMarkupKey;
export let name;
export let id;
export let allowBlur;
export let disable;
export let minChars;
export let onlyAutocomplete;
export let labelText;
export let labelShow;
export let readonly;
export let onTagClick;
export let autoCompleteShowKey;

let layoutElement;

$: tags = tags || [];
$: addKeys = addKeys || [13];
$: maxTags = maxTags || false;
$: onlyUnique = onlyUnique || false;
$: removeKeys = removeKeys || [8];
$: placeholder = placeholder || "";
$: allowPaste = allowPaste || false;
$: allowDrop = allowDrop || false;
$: splitWith = splitWith || ",";
$: autoComplete = autoComplete || false;
$: autoCompleteFilter = typeof autoCompleteFilter == "undefined" ? true : false;
$: autoCompleteKey = autoCompleteKey || false;
$: autoCompleteMarkupKey = autoCompleteMarkupKey || false;
$: name = name || "svelte-tags-input";
$: id = id || uniqueID();
$: allowBlur = allowBlur || false;
$: disable = disable || false;
$: minChars = minChars ?? 1;
$: onlyAutocomplete = onlyAutocomplete || false;
$: labelText = labelText || name;
$: labelShow = labelShow || false;
$: readonly = readonly || false;
$: onTagClick = onTagClick || function(){};
$: autoCompleteShowKey = autoCompleteShowKey || autoCompleteKey;

$: matchsID = id + "_matchs";

let storePlaceholder = placeholder;

function setTag(e) {
    const currentTag = e.target.value;
    
    if (addKeys) {
        addKeys.forEach(function(key) {
            if (key === e.keyCode) {
                
                if (currentTag) e.preventDefault();
                                
                /* switch (input.keyCode) {
                case 9:
                    // TAB add first element on the autoComplete list
                    if (autoComplete && document.getElementById(matchsID)) {                        
                        addTag(document.getElementById(matchsID).querySelectorAll("li")[0].textContent);
                    } else {
                        addTag(currentTag);
                    }                    
                    break;
                default:
                    addTag(currentTag);
                    break;
                } */
                if (autoComplete && document.getElementById(matchsID)) {
                    addTag(arrelementsmatch?.[autoCompleteIndex]?.label);
                } else {
                    addTag(currentTag);
                }
            }
        });
    }
    
    if (removeKeys) {
        removeKeys.forEach(function(key) {
            if (key === e.keyCode && tag === "") {
                tags.pop();  
                tags = tags;

                arrelementsmatch = [];
                document.getElementById(id).readOnly = false;
                placeholder = storePlaceholder;
                document.getElementById(id).focus();
            }
        });
    }
    
    // ArrowDown : focus on first element of the autocomplete
    if (e.keyCode === 40 && autoComplete && document.getElementById(matchsID)) {
        // Last element on the list ? Go to the first
        if (autoCompleteIndex + 1 === arrelementsmatch.length) autoCompleteIndex = 0
        else autoCompleteIndex++
    } else if (e.keyCode === 38) {
        // ArrowUp
        // First element on the list ? Go to the last
        if (autoCompleteIndex <= 0) autoCompleteIndex = arrelementsmatch.length - 1
        else autoCompleteIndex--
    } else if (e.keyCode === 27) {
        // Escape
        arrelementsmatch = [];
        document.getElementById(id).focus();
    }

}

function addTag(currentTag) {

    if (typeof currentTag === 'object' && currentTag !== null) {
        if (!autoCompleteKey) {
            return console.error("'autoCompleteKey' is necessary if 'autoComplete' result is an array of objects");
        }
        
        if (onlyUnique) {
            let found = tags?.find(elem => elem[autoCompleteKey] === currentTag[autoCompleteKey]);
        
            if (found) return;
        }

        var currentObjTags = currentTag;
        currentTag = currentTag[autoCompleteKey].trim();

    } else {
        currentTag = currentTag.trim();
    }
    
    if (currentTag == "") return;
    if (maxTags && tags.length == maxTags) return;
    if (onlyUnique && tags.includes(currentTag)) return;
    if (onlyAutocomplete && arrelementsmatch.length === 0) return;
        
    tags.push(currentObjTags ? currentObjTags : currentTag)
    tags = tags;
    tag = "";
    
    // Hide autocomplete list
    // Focus on svelte tags input
    arrelementsmatch = [];
    autoCompleteIndex = -1;
    document.getElementById(id).focus();

    if (maxTags && tags.length == maxTags) {
        document.getElementById(id).readOnly = true;
        placeholder = "";
    };

}

function removeTag(i) {
    
    tags.splice(i, 1);
    tags = tags;
    
    // Hide autocomplete list
    // Focus on svelte tags input
    arrelementsmatch = [];
    document.getElementById(id).readOnly = false;
    placeholder = storePlaceholder;
    document.getElementById(id).focus();

}

function onPaste(e) {

    if(!allowPaste) return;
    e.preventDefault();

    const data = getClipboardData(e);
    splitTags(data).map(tag => addTag(tag));    
}

function onDrop(e) {

    if(!allowDrop) return;
    e.preventDefault();

    const data = e.dataTransfer.getData("Text");
    splitTags(data).map(tag => addTag(tag));
}

function onFocus() {
    layoutElement.classList.add('focus');
}

function onBlur(e, tag) {
    layoutElement.classList.remove('focus');

    if (allowBlur) {
        // A match is highlighted
        if (arrelementsmatch.length && autoCompleteIndex > -1) {
            addTag(arrelementsmatch?.[autoCompleteIndex]?.label)
        }
        // There is no match, but we may add a new tag
        else if (!arrelementsmatch.length) {
            e.preventDefault()
            addTag(tag)
        }
    }

    arrelementsmatch = []
    autoCompleteIndex = -1
}

function onClick() {
    minChars == 0 && getMatchElements();
}


function getClipboardData(e) {

    if (window.clipboardData) {
        return window.clipboardData.getData('Text')
    }

    if (e.clipboardData) {
        return e.clipboardData.getData('text/plain')
    }

    return ''
}

function splitTags(data) {
    return data.split(splitWith).map(tag => tag.trim());    
}

function escapeHTML(string) {
    const htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };
    return ('' + string).replace(/[&<>"'\/]/g, match => htmlEscapes[match]);
}

function buildMatchMarkup(search, value) {
    return escapeHTML(value).replace(RegExp(regExpEscape(search.toLowerCase()), 'i'), "<strong>$&</strong>")
}

async function getMatchElements(input) {

    if (!autoComplete) return;
    if (maxTags && tags.length >= maxTags) return;
    
    let value = input ? input.target.value : "";
    let autoCompleteValues = [];
    
    if (Array.isArray(autoComplete)) {
        autoCompleteValues = autoComplete
    }
            
    if (typeof autoComplete === 'function') {
        if(autoComplete.constructor.name === 'AsyncFunction') {
            autoCompleteValues = await autoComplete(value)
        } else {
            autoCompleteValues = autoComplete(value)
        }
    }

    if(autoCompleteValues.constructor.name === 'Promise') {
        autoCompleteValues = await autoCompleteValues;
    }
    // Escape
    if ((minChars > 0 && value == "") || (input && input.keyCode === 27) || value.length < minChars ) {
        arrelementsmatch = [];
        return;
    }

    let matchs = autoCompleteValues;
    
    if (typeof autoCompleteValues[0] === 'object' && autoCompleteValues !== null) {
        
        if (!autoCompleteKey) {
            return console.error("'autoCompleteValue' is necessary if 'autoComplete' result is an array of objects");
        }

        if(autoCompleteFilter !== false) {
            matchs = autoCompleteValues.filter(e => e[autoCompleteKey].toLowerCase().includes(value.toLowerCase()))
        }
        matchs = matchs.map(matchTag => {
            return {
                label: matchTag,
                search: autoCompleteMarkupKey ? matchTag[autoCompleteMarkupKey] : buildMatchMarkup(value, matchTag[autoCompleteKey])
            }
        });


    } else {
        if(autoCompleteFilter !== false) {
            matchs = autoCompleteValues.filter(e => e.toLowerCase().includes(value.toLowerCase()))
        }
        matchs = matchs.map(matchTag => {
            return {
                label: matchTag,
                search: buildMatchMarkup(value, matchTag)
            }
        });
    }

    if (onlyUnique === true && !autoCompleteKey) {
        matchs = matchs.filter(tag => !tags.includes(tag.label));
    }

    arrelementsmatch = matchs;
}

function uniqueID() {
    return 'sti_' + Math.random().toString(36).substring(2, 11);
};

</script>

<div class="svelte-tags-input-layout" class:sti-layout-disable={disable} class:sti-layout-readonly={readonly} bind:this={layoutElement}>
    <label for={id} class={labelShow ? "" : "sr-only"}>{labelText}</label>

    {#if tags.length > 0}
        {#each tags as tag, i}
            <button class="svelte-tags-input-tag" on:click={onTagClick(tag)}>
                {#if typeof tag === 'string'}
                    {tag}
                {:else}
                    {tag[autoCompleteShowKey]}
                {/if}
                {#if !disable && !readonly}
                    <span class="svelte-tags-input-tag-remove" on:pointerdown={() => removeTag(i)}> &#215;</span>
                {/if}
            </button>
        {/each}
    {/if}
    <input
        type="text"
        id={id}
        name={name}
        bind:value={tag}
        on:keydown={setTag}
        on:keyup={getMatchElements}
        on:paste={onPaste}
        on:drop={onDrop}
        on:focus={onFocus}
        on:blur={(e) => onBlur(e, tag)}
        on:pointerdown={onClick}
        class="svelte-tags-input"
        placeholder={placeholder}
        disabled={disable || readonly}
        autocomplete="off"
    >
</div>

{#if autoComplete && arrelementsmatch.length > 0}
    <div class="svelte-tags-input-matchs-parent">
        <ul id="{id}_matchs" class="svelte-tags-input-matchs">
            {#each arrelementsmatch as element, index}
                <li
                    tabindex="-1"
                    class:focus={index === autoCompleteIndex}
                    on:pointerdown|preventDefault={() => addTag(element.label)}>
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
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
    font-size: 14px;
    padding: 2px 5px;
}

.svelte-tags-input-layout label {
    margin: 4px 5px 0 0;
    padding:0;
    font-weight:500;
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
    border: solid 1px #CCC;
    background: #FFF;
    border-radius: 2px;
}

.svelte-tags-input-layout:focus,
.svelte-tags-input-layout:hover {
    border: solid 1px #000;    
}

.svelte-tags-input-layout:focus-within {
    outline: 5px auto -webkit-focus-ring-color;
}

/* svelte-tags-input */

.svelte-tags-input {
    /* Parent handles background */
    background: unset;
    -webkit-box-flex: 1;
        -ms-flex: 1;
            flex: 1; 
    margin: 0;
    margin-top: 5px;
    border:none;
}

.svelte-tags-input:focus {
    outline:0;
}

/* svelte-tags-input-tag */

.svelte-tags-input-tag {
    cursor: text;
    display:-webkit-box;
    display:-ms-flexbox;
    display:flex;
    white-space: nowrap;
    user-select: text;
    list-style:none;
    background: #000;
    border: none;
    color: #FFF;
    border-radius: 2px;
    margin-right: 5px;
    margin-top: 5px;
    font-weight: 400;
}

/*.svelte-tags-input-tag:hover {
    background: #CCC;
}*/

.svelte-tags-input-tag-remove {
    cursor:pointer;
    margin-left: 5px;
}

/* svelte-tags-input-matchs */

.svelte-tags-input-matchs-parent {
    position:relative;
}

.svelte-tags-input-matchs {
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

.svelte-tags-input-matchs li {
    list-style:none;
    padding:5px;
    border-radius: 2px;
    cursor:pointer;
}

.svelte-tags-input-matchs li:hover,
.svelte-tags-input-matchs li.focus {
    background:#000;
    color:#FFF;
    outline:none;
}

/* svelte-tags-input disabled */

.svelte-tags-input:disabled {
    background: transparent;
}

.svelte-tags-input-layout.sti-layout-disable,
.svelte-tags-input-layout.sti-layout-disable input {
    cursor: not-allowed;
    background: #EAEAEA;
}

.svelte-tags-input-layout.sti-layout-disable:hover,
.svelte-tags-input-layout.sti-layout-disable:focus,
.svelte-tags-input-layout.sti-layout-readonly:hover,
.svelte-tags-input-layout.sti-layout-readonly:focus {
    border-color:#CCC;
}

.svelte-tags-input-layout.sti-layout-disable .svelte-tags-input-tag {
    background: #AEAEAE;
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
