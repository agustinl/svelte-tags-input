# 🏷️ svelte-tags-input

[![License: MIT](https://img.shields.io/npm/v/svelte-tags-input.svg)](https://www.npmjs.com/package/svelte-tags-input)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MadeWithSvelte.com shield](https://madewithsvelte.com/storage/repo-shields/2151-shield.svg)](https://madewithsvelte.com/p/svelte-tags-input/shield-link)

> Svelte tags input is a component to use with Svelte and easily enter tags and customize some options

## Example

### [Live Demo](https://svelte-tags-input.now.sh/)

## Install

```bash
npm install svelte-tags-input --save
```

```javascript
import Tags from "svelte-tags-input";

<Tags />
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| on:tags | `Function` | `undefined` | To get the values |
| addKeys | `Array` | <kbd>ENTER</kbd> <small>13</small> | Set which keys add new values |
| removeKeys | `Array` | <kbd>BACKSPACE</kbd> <small>8</small> | Set which keys remove new values |
| allowPaste | `Boolean` | `false` | Enable pasting of a tag or tag group |
| allowDrop | `Boolean` | `false` | Enable drag and drop of a tag or tag group |
| splitWith | `String` | <kbd>,</kbd> | Choose what character split you group of tags<br><small>Work only if allowDrop or allowPaste are true</small> |
| maxTags | `Array` | `false` | Set maximum number of tags |
| onlyUnique | `Boolean` | `false` | Set the entered tags to be unique |
| placeholder | `String` | `false` | Set a placeholder |
| autoComplete | `Array` | `false` | Set an array of elements to create a autocomplete dropdown |
| name | `String` | `svelte-tags-input` | Set a `name` attribute |
| id | `String` | Random Unique ID | Set a `id` attribute |

##### [A complete list of key codes](https://keycode.info/)

## Full example

[Live Full Example Demo](https://svelte-tags-input.now.sh#example)  

```javascript
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
    name={"custom-name"}
    id={"custom-id"}
/>
```

## [FAQs](https://svelte-tags-input.now.sh#faqs)

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

[Agustínl](https://www.agustinl.dev?ref=github-sti)

##### 2020
