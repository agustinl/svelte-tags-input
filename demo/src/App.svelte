<script>

import countries from '../public/countries.json'
import Tags from '../../src'

let tags = []

const sleep = (delayMillis, returnValue) =>
    new Promise(x => setTimeout(() => x(returnValue), delayMillis))

const handleTags = event => {
    console.log('Tags', event.detail.tags)
    tags = event.detail.tags
}

const customAutocomplete = async () => {
    const list = await sleep(600, JSON.stringify(countries))
    const res = JSON.parse(list)
    return await res
}

$: placeholder = countries.slice(0, 3).map(it => it.name).join(', ')

</script>

<main>
    
	<h1 class="text-3xl">
        Svelte Tags Input | Demo
    </h1>
    
    <div class="mt-6">
        <Tags
            tags={['Italy', 'Greece', 'Albania', 'France']}
            
            inputLayoutClass="tags-layout flex flex-wrap border border-gray-300 rounded"
            inputClass="flex outline-none focus:outline-none p-3 w-full"
            autocompleteParentClass="tags-autocomplete-parent"
            autocompleteListClass="tags-autocomplete-list"
            autocompleteItemClass="tags-autocomplete-item"
            on:tags={handleTags}
            addKeys={[9, 13]}
            maxTags={5}
            allowPaste={true}
            allowDrop={true}
            splitWith={','}
            onlyUnique={true}
            removeKeys={[27]}
            {placeholder}
            autoComplete={customAutocomplete}
            autoCompleteKey="name"
            id="tags-test"
            name="tags-test"
            allowBlur={true}
            disable={false}
            minChars={3}
        />
    </div>
    
    <div class="mt-6">
        <h4 class="text-xl">
            Selected Tags
        </h4>
        <div>
            <pre><code>{JSON.stringify(tags, null, 4)}</code></pre>
        </div>
    </div>
    
</main>

<style>

:global(.tags-layout) {
    background: transparent;
}

:global(.tags-autocomplete-parent) {
    position: relative;
}

:global(.tags-autocomplete-list) {
    padding-left: 0;
    list-style: none;
    background: rgba(100, 100, 100, 0.1);
}

:global(.tags-autocomplete-item) {
    padding: 3px 5px;
    font-size: 16pt;
}

:global(.tags-autocomplete-item:focus) {
    outline: none;
    border: 1px solid rgba(100, 100, 100, 0.5);
    background: rgba(100, 100, 100, 0.3);
}

</style>
