<script>
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();
let tag = "";
let arrelementsmatch = [];
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
export let name;
export let id;
export let allowBlur;
export let disable;
export let minChars;

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
$: name = name || "svelte-tags-input";
$: id = id || uniqueID();
$: allowBlur = allowBlur || false;
$: disable = disable || false;
$: minChars = minChars || 1;

$: matchsID = id + "_matchs";

let storePlaceholder = placeholder;

function setTag(input) {
    
    const currentTag = input.target.value;
    
    if (addKeys) {
        addKeys.forEach(function(key) {
            if (key === input.keyCode) {
                input.preventDefault();
                
                switch (input.keyCode) {
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
                }
            }
        });
    }
    
    if (removeKeys) {
        removeKeys.forEach(function(key) {
            if (key === input.keyCode && tag === "") {
                tags.pop();  
                tags = tags;

                dispatch('tags', {
                    tags: tags
                });
            }
        });
    }
    
    // ArrowDown : focus on first element of the autocomplete
    if (input.keyCode === 40 && autoComplete && document.getElementById(matchsID)) {
        event.preventDefault();
        document.getElementById(matchsID).querySelector("li:first-child").focus();
    } // ArrowUp : focus on last element of the autocomplete
    else if (input.keyCode === 38 && autoComplete && document.getElementById(matchsID)) {
        event.preventDefault();
        document.getElementById(matchsID).querySelector("li:last-child").focus();
    }

}

function addTag(currentTag) {

    currentTag = currentTag.trim();

    if (currentTag == "") return;
    if (maxTags && tags.length == maxTags) return;    
    if (onlyUnique && tags.includes(currentTag)) return;
    
    tags.push(currentTag)
    tags = tags;
    tag = "";

    dispatch('tags', {
		tags: tags
    });
    
    // Hide autocomplete list
    // Focus on svelte tags input
    arrelementsmatch = [];
    document.getElementById(id).focus();

    if (maxTags && tags.length == maxTags) {
        document.getElementById(id).readOnly = true;
        placeholder = "";
    };

}

function removeTag(i) {
    
    tags.splice(i, 1);
    tags = tags;

    dispatch('tags', {
		tags: tags
	});    
    
    // Hide autocomplete list
    // Focus on svelte tags input
    arrelementsmatch = [];
    document.getElementById(id).readOnly = false;
    placeholder = storePlaceholder;
    document.getElementById(id).focus();

}

function onPaste(e){

    if(!allowPaste) return;

    e.preventDefault();

    const data = getClipboardData(e);
    const tags = splitTags(data).map(tag => addTag(tag));
    
}

function onDrop(e){

    if(!allowDrop) return;

    e.preventDefault();

    const data = e.dataTransfer.getData("Text");
    const tags = splitTags(data).map(tag => addTag(tag));

}

function onBlur(tag){

    if (!document.getElementById(matchsID) && allowBlur) {
        event.preventDefault();
        addTag(tag);
    }
    
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

function getMatchElements(input) {

    if (!autoComplete) return;
    
    var value = input.target.value;
    
    // Escape
    if (value == "" || input.keyCode === 27 || value.length < minChars ) {
        arrelementsmatch = [];
        return;
    }

    var matchs = autoComplete.filter(e => e.toLowerCase().includes(value.toLowerCase())).map(matchTag => {
            return {
                label: matchTag,
                search: matchTag.replace(RegExp(regExpEscape(value.toLowerCase()), 'i'), "<strong>$&</strong>")
            }
        });; 

    if (onlyUnique === true) {
        matchs = matchs.filter(tag => !tags.includes(tag.label));
    }

    arrelementsmatch = matchs;
}

function navigateAutoComplete(autoCompleteIndex, autoCompleteLength, autoCompleteElement) {

    if (!autoComplete) return;
    
    event.preventDefault();

    // ArrowDown
    if (event.keyCode === 40) {
        // Last element on the list ? Go to the first
        if (autoCompleteIndex + 1 === autoCompleteLength) {
            document.getElementById(matchsID).querySelector("li:first-child").focus();
            return;
        }
        document.getElementById(matchsID).querySelectorAll("li")[autoCompleteIndex + 1].focus();
    } else if (event.keyCode === 38) {
        // ArrowUp
        // First element on the list ? Go to the last
        if (autoCompleteIndex === 0) {
            document.getElementById(matchsID).querySelector("li:last-child").focus();
            return;
        }
        document.getElementById(matchsID).querySelectorAll("li")[autoCompleteIndex - 1].focus();
    } else if (event.keyCode === 13) { 
        // Enter
        addTag(autoCompleteElement);
    } else if (event.keyCode === 27) {
        // Escape
        arrelementsmatch = [];
        document.getElementById(id).focus();
    }
}

function uniqueID() {
    return 'sti_' + Math.random().toString(36).substr(2, 9);
};

</script>

<div class="svelte-tags-input-layout" class:sti-layout-disable={disable}>
    {#if tags.length > 0}
        {#each tags as tag, i}
            <span class="svelte-tags-input-tag">{tag}
                {#if !disable}
                <span class="svelte-tags-input-tag-remove" on:click={() => removeTag(i)}> &#215;</span>
                {/if}
            </span>
        {/each}
    {/if}
    <input type="text" id={id} name={name} bind:value={tag} on:keydown={setTag} on:keyup={getMatchElements} on:paste={onPaste} on:drop={onDrop} on:blur={() => onBlur(tag)} class="svelte-tags-input" placeholder={placeholder} disabled={disable} >
</div>

{#if autoComplete && arrelementsmatch.length > 0}
    <div class="svelte-tags-input-matchs-parent">
        <ul id="{id}_matchs" class="svelte-tags-input-matchs">
            {#each arrelementsmatch as element, index}
                <li tabindex="-1" on:keydown={() => navigateAutoComplete(index, arrelementsmatch.length, element.label)} on:click={() => addTag(element.label)}>{@html element.search}</li>
            {/each}
        </ul>
    </div>
{/if}

<style>
/* CSS svelte-tags-input */

.svelte-tags-input,
.svelte-tags-input-tag,
.svelte-tags-input-matchs {
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
    border: solid 1px #CCC;
    background: #FFF;
    border-radius: 2px;
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
    margin-top: 5px;
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
.svelte-tags-input-matchs li:focus {
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