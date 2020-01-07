<script>
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();
let tags = [];
let tag;

export let addKeys;
export let maxTags;
export let onlyUnique;
export let removeKeys;
export let placeholder;

$: addKeys = addKeys || false;
$: maxTags = maxTags || false;
$: onlyUnique = onlyUnique || false;
$: removeKeys = removeKeys || false;
$: placeholder = placeholder || "";

function setTag(event) {
    
    const currentTag = event.target.value;

    if (event.keyCode === 13) {
        addTag(currentTag);
    }
    
    if (event.keyCode === 8 && tag == "") {
        tags.pop();  
        tags = tags;

        dispatch('tags', {
            tags: tags
        });
    }
    
    if (addKeys) {
        addKeys.forEach(function(key) {
            if (key === event.keyCode) {
                switch (event.keyCode) {
                case 188:
                    // Remove comma if keycode to add tag is comma
                    addTag(currentTag.substring(0, currentTag.length - 1));
                    break;                    
                case 9:
                    event.preventDefault();
                    addTag(currentTag);
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
            if (key === event.keyCode) {
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

    if (currentTag == "") return;
    if (maxTags && tags.length == maxTags) return;
    
    if(onlyUnique) {
        if (tags.includes(currentTag)) return;
    }
    
    tags.push(currentTag)
    tags = tags;
    tag = "";

    dispatch('tags', {
		tags: tags
	});

}

function removeTag(i) {
    
    tags.splice(i, 1);
    tags = tags;

    dispatch('tags', {
		tags: tags
	});

}
</script>

<div class="svelte-tags-input-layout">
    {#if tags.length > 0}
        {#each tags as tag, i}
            <span class="svelte-tags-input-tag">{tag} <span class="svelte-tags-input-tag-remove" on:click={() => removeTag(i)}> ×</span></span>
        {/each}
    {/if}
    <input type="text" bind:value={tag} on:keydown={setTag} class="svelte-tags-input" placeholder={placeholder}>
</div>

<style>
/* main */

.svelte-tags-input,
.svelte-tags-input-tag {
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
    font-size: 14px;
    padding: 2px 5px;
}

/* svelte-tags-input-layout */

.svelte-tags-input-layout {
    display:flex;
    flex-wrap:wrap;
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
</style>