<script>
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();
let tag;
let arrelementsmatch = [];

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

    if (input.keyCode === 13) { // If ENTER addTag()
        addTag(currentTag);
    }
    
    if (input.keyCode === 8 && tag == "") { // If BACKSPACE removeTag()
        tags.pop();  
        tags = tags;

        dispatch('tags', {
            tags: tags
        });
    }

    if (input.keyCode === 40 && autoComplete && document.getElementsByClassName("svelte-tags-input-matchs").length) { // If KEYDOWN focus on first element of the autocomplete
        document.querySelectorAll("li")[0].focus();
    }
    
    if (addKeys) {
        addKeys.forEach(function(key) {
            if (key === input.keyCode) {
                switch (input.keyCode) {
                case 188:
                    // Remove comma if keycode to add tag is ,
                    addTag(currentTag.substring(0, currentTag.length - 1));
                    break;
                case 9:
                    input.preventDefault();
                    if (autoComplete && document.getElementsByClassName("svelte-tags-input-matchs").length) { // Add first item of autocomplete list on TAB
                        addTag(document.querySelectorAll("li")[0].textContent);
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
    document.getElementsByClassName("svelte-tags-input")[0].focus();

}

function removeTag(i) {
    
    tags.splice(i, 1);
    tags = tags;

    dispatch('tags', {
		tags: tags
	});
    
    // After add a tag, hide autocomplete list and focus on svelte tags input
    arrelementsmatch = [];
    document.getElementsByClassName("svelte-tags-input")[0].focus();

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
    
    if (value == "" || input.keyCode === 27) { // Close auto complete list if press ESC or there is no value
        arrelementsmatch = [];
        return;
    }

    var matchs = autoComplete.filter(e => e.toLowerCase().includes(value.toLowerCase())); 

    if (onlyUnique === true) { // Show autocomplete list without tags already added
        matchs = matchs.filter(x => !tags.includes(x));
    }   

    arrelementsmatch = matchs;
}

function navigateAutoComplete(autoCompleteIndex, autoCompleteLength, autoCompleteElement) {

    if (!autoComplete) return;

    if (event.keyCode === 40) { // If KEYDOWN
        if (autoCompleteIndex + 1 === autoCompleteLength) return; // If it is the last element on the list
        document.querySelectorAll("li")[autoCompleteIndex + 1].focus();
    } else if (event.keyCode === 38) { // If KEYUP
        if (autoCompleteIndex === 0) return; // If it is the first element on the list
        document.querySelectorAll("li")[autoCompleteIndex - 1].focus();
    } else if (event.keyCode === 13) { // If ENTER addTag
        addTag(autoCompleteElement);
    } else if (event.keyCode === 27) { // Close auto complete list if press ESC and focus in input
        arrelementsmatch = [];
        document.getElementsByClassName("svelte-tags-input")[0].focus();
    }
}

</script>

<div class="svelte-tags-input-layout">
    {#if tags.length > 0}
        {#each tags as tag, i}
            <span class="svelte-tags-input-tag">{tag} <span class="svelte-tags-input-tag-remove" on:click={() => removeTag(i)}> ×</span></span>
        {/each}
    {/if}
    <input type="text" bind:value={tag} on:keydown={setTag} on:keyup={getMatchElements} on:paste={onPaste} on:drop={onDrop} class="svelte-tags-input" placeholder={placeholder}>
    
</div>

{#if autoComplete && arrelementsmatch.length > 0}
    <ul class="svelte-tags-input-matchs">
        {#each arrelementsmatch as element, i}
            <li tabindex="-1" on:keydown={() => navigateAutoComplete(i, arrelementsmatch.length, element)} on:click={() => addTag(element)}>{element}</li>
        {/each}
    </ul>
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

.svelte-tags-input-tag:hover {
    /*background: #CCC;*/
}

.svelte-tags-input-tag-remove {
    cursor:pointer;
}

/* svelte-tags-input-matchs */

.svelte-tags-input-matchs {
    margin:3px 0;
    padding: 0px;
    border: solid 1px #CCC;
    border-radius: 2px;
    max-height:310px;
    overflow:scroll;
    overflow-x:hidden;
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