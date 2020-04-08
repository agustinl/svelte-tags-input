# 🏷️ svelte-tags-input

[![License: MIT](https://img.shields.io/npm/v/svelte-tags-input.svg)](https://www.npmjs.com/package/svelte-tags-input)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MadeWithSvelte.com shield](https://madewithsvelte.com/storage/repo-shields/2151-shield.svg)](https://madewithsvelte.com/p/svelte-tags-input/shield-link)

> Svelte tags input is a component to use with [Svelte](https://svelte.dev/) and easily enter tags and customize some functions.

## Example

### [Live Demo](https://svelte-tags-input-example.now.sh/)

## Install

```bash
npm install svelte-tags-input --save
```

```javascript
<style>
    import Tags from "svelte-tags-input";
</style>

<Tags />
```

## Props

#### on:tags
To get the values. [How to modify the current list of tags?](https://github.com/agustinl/svelte-tags-input/pull/5)

e.g. `on:tags={handleTags}` or `on:tags={getTags}`

##### **dont change `on:tags`**
---

#### addKeys
You can set which keys add new values.

e.g. `addKeys={[9]}` or `addKeys={[9,188]}`

##### **default: 13 (enter)**
---

#### removeKeys
You can set which keys remove new values.

e.g. `removeKeys={[9]}` or `removeKeys={[9,188]}`

##### **default: 8 (backspace)**
---

#### allowPaste
You can paste an tag or group of tags.

e.g. `allowPaste={true}`

##### **default: false**
---

#### allowDrop
You can drop an tag or group of tags.

e.g. `allowDrop={true}`

##### **default: false**
---

#### splitWith
You can choose what character split you group of tags (on paster or drop).
*Work only if allowDrop or allowPaste are true*

e.g. `splitWith={"/"}`

##### **default: split with ,**
---

#### maxTags
You can set maximum number of tags.

e.g. `maxTags={[3]}`

##### **default: false (infinite)**
---

#### onlyUnique
You can set the entered tags to be unique.

e.g. `onlyUnique={true}`

##### **default: false**
---

#### placeholder
You can set a placeholder.

e.g. `placeholder={"Svelte Tags Input"}`

##### **default: empty**
---

#### autoComplete
You can set an array of elements to create a autocomplete dropdown.

e.g. `autoComplete={myArrayOfElements}`

##### **default: false**
---

## FAQ

#### Reset tags input
In response to the request [(#7)](https://github.com/agustinl/svelte-tags-input/issues/7) for a way to reset the input after submitting a form, for example:

```javascript
<style>
    import Tags from "svelte-tags-input";

    let tags = [];

    function submitForm(event) {
        tags = [];
    }
</style>

<Tags
    tags={tags}
/>

<button on:click={submitForm}>Submit</button>

```

#### Initialize with tags

```javascript
<style>
    import Tags from "svelte-tags-input";
</style>

let tags = ["start", "with", "this", "tags"];

<Tags
    tags={tags}
/>
```

#### Keep 2 components in sync

```javascript
<style>
    import Tags from "svelte-tags-input";

    let tags = [];
    $: tags2 = [];

    function changeTags2(event) {
        var tmp_tags = event.detail.tags;
            tmp_tags = tmp_tags.toString().split(',').map(d => d.trim());
        
        tags2 = tmp_tags;
    }
<style>

<Tags
    on:tags={changeTags2}
    tags={tags}
/>
		 
<Tags
    tags={tags2}
/>
```

## Full example

```javascript
<style>
    import Tags from "svelte-tags-input";

    // If on:tags is defined
    let tag = "";

    function handleTags(event) {
        tag = event.detail.tags;
    }

    const countryList = [
        "Afghanistan",
        "Albania",
        "Algeria",
        "American Samoa",
        "Andorra",
        "Angola",
        "Anguilla",
        "Antarctica",
        "Antigua and Barbuda",
        "Argentina"
        ...
    ];
<style>

<Tags
    on:tags={handleTagProperties}
    addKeys={[9]} // TAB Key
    maxTags={3}
    allowPaste={true}
    allowDrop={true}
    splitWith={"/"}
    onlyUnique={true}
    removeKeys={[27]} // ESC Key
    placeholder={"Svelte Tags Input full example"}
    autoComplete={countryList}
/>
```

## CSS

<a href="https://svelte-tags-input-example.now.sh/svelte-tags-input-css.css" download>Download CSS file</a>

#### How to override tag styles?

```html
<div  class="my-custom-class"> 
    <Tags /> 
</div>

```
```css
<style>
.my-custom-class :global(.svelte-tags-input-tag) {
    background:blue;
}

.my-custom-class :global(.svelte-tags-input-layout) {
    background:yellow;
}
</style>
```

## Author

[Agustínl](https://www.agustinl.dev/)

## License

This project is open source and available under the [MIT License](LICENSE).