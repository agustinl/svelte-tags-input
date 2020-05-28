<script>
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();
let tag;
let arrelementsmatch = [];
let ID = uniqueID();
let matchsID = ID + "_matchs";

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

$: tags = tags || [];
$: addKeys = addKeys || false;
$: maxTags = maxTags || false;
$: onlyUnique = onlyUnique || false;
$: removeKeys = removeKeys || false;
$: placeholder = placeholder || "";
$: allowPaste = allowPaste || false;
$: allowDrop = allowDrop || false;
$: splitWith = splitWith || ",";
$: autoComplete = autoComplete || false;

function setTag(input) {
    
    const currentTag = input.target.value;

    // If ENTER addTag()
    if (input.keyCode === 13) {
        addTag(currentTag);
    }
    
    // If BACKSPACE removeTag()
    if (input.keyCode === 8 && tag == "") {
        tags.pop();  
        tags = tags;

        dispatch('tags', {
            tags: tags
        });
    }

    // If KEYDOWN focus on first element of the autocomplete
    if (input.keyCode === 40 && autoComplete && document.getElementById(matchsID)) {
        event.preventDefault();
        document.getElementById(matchsID).querySelector("li:first-child").focus();
    } // If KEYUP focus on last element of the autocomplete
    else if (input.keyCode === 38 && autoComplete && document.getElementById(matchsID)) {
        event.preventDefault();
        document.getElementById(matchsID).querySelector("li:last-child").focus();
    }
    
    if (addKeys) {
        addKeys.forEach(function(key) {
            if (key === input.keyCode) {
                switch (input.keyCode) {
                case 9:
                    input.preventDefault();
                    // Add first item of autocomplete list on TAB
                    if (autoComplete && document.getElementById(matchsID)) {                        
                        addTag(document.getElementById(matchsID).querySelectorAll("li")[0].textContent);
                    } else {
                        addTag(currentTag);
                    }                    
                    break;
                case 188:
                    // Prevent insertion of ,
                    input.preventDefault();
                default:
                    addTag(currentTag);
                    break;
                }
            }
        });
    }
    
    if (removeKeys) {
        removeKeys.forEach(function(key) {
            if (key === input.keyCode) {
                tags.pop();  
                tags = tags;
                tag = "";

                dispatch('tags', {
                    tags: tags
                });
            }
        });
    }

}

function addTag(currentTag) {

    currentTag = currentTag.trim();

    if (currentTag == "") return;
    if (maxTags && tags.length == maxTags) return;    
    if(onlyUnique && tags.includes(currentTag)) return;
    
    tags.push(currentTag)
    tags = tags;
    tag = "";

    dispatch('tags', {
		tags: tags
    });
    
    // After add a tag, hide autocomplete list and focus on svelte tags input
    arrelementsmatch = [];
    document.getElementById(ID).focus();

}

function removeTag(i) {
    
    tags.splice(i, 1);
    tags = tags;

    dispatch('tags', {
		tags: tags
	});
    
    // After add a tag, hide autocomplete list and focus on svelte tags input
    arrelementsmatch = [];
    document.getElementById(ID).focus();

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
    return data.split(splitWith).map(d => d.trim());    
}

function getMatchElements(input) {

    if (!autoComplete) return;
    
    var value = input.target.value;
    
    // Close auto complete list if press ESC or there is no value
    if (value == "" || input.keyCode === 27) {
        arrelementsmatch = [];
        return;
    }

    var matchs = autoComplete.filter(e => e.toLowerCase().includes(value.toLowerCase())); 

    // Show autocomplete list without tags already added
    if (onlyUnique === true) {
        matchs = matchs.filter(x => !tags.includes(x));
    }   

    arrelementsmatch = matchs;
}

function navigateAutoComplete(autoCompleteIndex, autoCompleteLength, autoCompleteElement) {

    if (!autoComplete) return;
    
    event.preventDefault();

    if (event.keyCode === 40) { // If KEYDOWN
        // If it is the last element on the list, go to the first
        if (autoCompleteIndex + 1 === autoCompleteLength) {
            document.getElementById(matchsID).querySelector("li:first-child").focus();
            return;
        }
        document.getElementById(matchsID).querySelectorAll("li")[autoCompleteIndex + 1].focus();
    } else if (event.keyCode === 38) { // If KEYUP
        // If it is the first element on the list, go to the last
        if (autoCompleteIndex === 0) {
            document.getElementById(matchsID).querySelector("li:last-child").focus();
            return;
        }
        document.getElementById(matchsID).querySelectorAll("li")[autoCompleteIndex - 1].focus();
    } else if (event.keyCode === 13) { // If ENTER addTag
        addTag(autoCompleteElement);
    } else if (event.keyCode === 27) { // Close auto complete list if press ESC and focus in input
        arrelementsmatch = [];
        document.getElementById(ID).focus();
    }
}

function uniqueID() {
    return 'sti_' + Math.random().toString(36).substr(2, 9);
};

</script>

<div class="svelte-tags-input-layout">
    {#if tags.length > 0}
        {#each tags as tag, i}
            <span class="svelte-tags-input-tag">{tag} <span class="svelte-tags-input-tag-remove" on:click={() => removeTag(i)}> &#215;</span></span>
        {/each}
    {/if}
    <input type="text" id={ID} bind:value={tag} on:keydown={setTag} on:keyup={getMatchElements} on:paste={onPaste} on:drop={onDrop} class="svelte-tags-input" placeholder={placeholder}>
</div>

{#if autoComplete && arrelementsmatch.length > 0}
    <div class="svelte-tags-input-matchs-parent">
        <ul id="{ID}_matchs" class="svelte-tags-input-matchs">
            {#each arrelementsmatch as element, i}
                <li tabindex="-1" on:keydown={() => navigateAutoComplete(i, arrelementsmatch.length, element)} on:click={() => addTag(element)}>{element}</li>
            {/each}
        </ul>
    </div>
{/if}

<style>
/* main */

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
</style>