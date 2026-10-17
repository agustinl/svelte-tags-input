<h1 align="center">svelte-tags-input</h1>

<p align="center">
  <strong>A fully customizable tags input component for Svelte 5</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/svelte-tags-input"><img src="https://img.shields.io/npm/v/svelte-tags-input.svg" alt="npm version" /></a>
  <a href="https://github.com/agustinl/svelte-tags-input/actions/workflows/ci.yml"><img src="https://github.com/agustinl/svelte-tags-input/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" /></a>
  <a href="https://madewithsvelte.com/p/svelte-tags-input/shield-link"><img src="https://madewithsvelte.com/storage/repo-shields/2151-shield.svg" alt="Made with Svelte" /></a>
</p>

<p align="center">
  <a href="https://svelte-tags-input.vercel.app">Live Demo</a> ·
  <a href="CHANGELOG.md">Changelog</a>
</p>

---

## Features

- **Keyboard-driven** — Add tags with Enter (configurable), remove with Backspace, navigate autocomplete with Arrow keys
- **Autocomplete** — Array or async function, with filtering and custom display keys
- **Paste & drop** — Paste or drop comma-separated text to add several tags at once
- **Keyboard & screen reader basics** — Keyboard navigation and an accessible (optionally visually hidden) label
- **Flexible** — Max tags, unique-only, custom validation, blur behavior
- **Svelte 5** — Built with runes (`$props`, `$state`, `$derived`, `$bindable`)
- **TypeScript** — Type definitions included (`TagsProps`)

## Requirements

- **Svelte 5.x** — This package requires Svelte 5 (peer dependency)

## Install

```bash
npm install svelte-tags-input
```

## Quick Start

```svelte
<script>
  import Tags from 'svelte-tags-input';

  let tags = $state([]);
</script>

<Tags bind:tags placeholder="Type and press Enter..." />
```

## Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `bind:tags` | `Array` | `[]` | Two-way bound array of tags |
| `addKeys` | `number[]` | `[13]` (Enter) | Keys that add a tag |
| `removeKeys` | `number[]` | `[8]` (Backspace) | Keys that remove the last tag |
| `placeholder` | `string` | `''` | Input placeholder text |
| `maxTags` | `number \| false` | `false` | Maximum number of tags allowed |
| `onlyUnique` | `boolean` | `false` | Reject duplicate tags |
| `allowPaste` | `boolean` | `false` | Enable pasting tags (split by `splitWith`) |
| `allowDrop` | `boolean` | `false` | Enable drag-and-drop of tags |
| `splitWith` | `string` | `','` | Character to split pasted/dropped text |
| `autoComplete` | `Array \| (value: string) => any \| false` | `false` | Suggestions array or async fetcher |
| `autoCompleteKey` | `string \| false` | `false` | Key for object items in `autoComplete` |
| `autoCompleteShowKey` | `string` | `autoCompleteKey` | Key to display (when different from search key) |
| `autoCompleteMarkupKey` | `string \| false` | `false` | Key whose value is rendered as HTML in each suggestion (⚠️ not escaped — sanitize untrusted data) |
| `autoCompleteFilter` | `boolean` | `true` | Filter suggestions client-side (disable for API responses) |
| `autoCompleteStartFocused` | `boolean` | `false` | Focus first suggestion without typing |
| `onlyAutocomplete` | `boolean` | `false` | Only accept tags from the autocomplete list |
| `minChars` | `number` | `1` | Min chars before showing autocomplete (0 = show all on click) |
| `allowBlur` | `boolean` | `false` | Add tag on input blur |
| `cleanOnBlur` | `boolean` | `false` | Clear input on blur (tags kept) |
| `disable` | `boolean` | `false` | Disable the input |
| `readonly` | `boolean` | `false` | Read-only display mode |
| `name` | `string` | `'svelte-tags-input'` | Input `name` attribute |
| `id` | `string` | random | Input `id` attribute |
| `labelText` | `string` | `name` | Accessible label text |
| `labelShow` | `boolean` | `false` | Show visible label |
| `onTagAdded` | `(tag, tags) => void` | `() => {}` | Called when a tag is added |
| `onTagRemoved` | `(tag, tags) => void` | `() => {}` | Called when a tag is removed |
| `onTagClick` | `(tag) => void` | `() => {}` | Called when a tag is clicked |
| `customValidation` | `((tag) => boolean) \| false` | `false` | Custom validation before adding |

### Key codes

`addKeys` and `removeKeys` take numeric key codes. Common values:

| Key | Code |
|-----|------|
| Enter | `13` |
| Tab | `9` |
| Backspace | `8` |
| Escape | `27` |
| Comma | `188` |
| Space | `32` |

See the [MDN `keyCode` reference](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode) for others.

## Examples

### Basic with autocomplete

```svelte
<script>
  import Tags from 'svelte-tags-input';

  let tags = $state([]);
  const suggestions = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
</script>

<Tags
  bind:tags
  placeholder="Pick a fruit..."
  autoComplete={suggestions}
  onlyUnique
/>
```

### Full configuration

```svelte
<script>
  import Tags from 'svelte-tags-input';

  let tags = $state([]);
  const countries = ['Argentina', 'Brazil', 'Chile', 'Colombia', 'Mexico'];
</script>

<Tags
  bind:tags
  addKeys={[9]}
  removeKeys={[27]}
  maxTags={5}
  allowPaste
  allowDrop
  splitWith="/"
  onlyUnique
  placeholder="Add a country..."
  autoComplete={countries}
  minChars={2}
  onlyAutocomplete
  allowBlur
  cleanOnBlur
  labelText="Countries"
  labelShow
  onTagAdded={(tag, t) => console.log('Added:', tag, t)}
  onTagRemoved={(tag, t) => console.log('Removed:', tag, t)}
  onTagClick={(tag) => console.log('Clicked:', tag)}
  customValidation={(tag) => tag.length >= 3}
/>
```

### Autocomplete with objects

```svelte
<script>
  import Tags from 'svelte-tags-input';

  let tags = $state([]);
  const users = [
    { name: 'Ada Lovelace', username: 'ada' },
    { name: 'Alan Turing', username: 'alan' },
    { name: 'Grace Hopper', username: 'grace' }
  ];
</script>

<!-- Search by `name`, show `username` in the selected tag -->
<Tags
  bind:tags
  autoComplete={users}
  autoCompleteKey="name"
  autoCompleteShowKey="username"
  onlyAutocomplete
/>
```

When `autoComplete` returns objects, `autoCompleteKey` is required and `tags` will contain the selected objects.

### Async autocomplete (API)

```svelte
<script>
  import Tags from 'svelte-tags-input';

  let tags = $state([]);

  async function fetchCountries(query) {
    const res = await fetch(
      `https://countries.dev/name/${encodeURIComponent(query)}?fields=name,alpha3Code`
    );
    if (!res.ok) return []; // 404 when no country matches
    return res.json();
  }
</script>

<Tags
  bind:tags
  autoComplete={fetchCountries}
  autoCompleteKey="name"
  autoCompleteShowKey="alpha3Code"
  autoCompleteFilter={false}
/>
```

### Inside a form

The `name` prop is applied to the visible text input, so a native form submit only sends whatever is currently typed — not the tags. To submit the tags, render a hidden input for each one:

```svelte
<script>
  import Tags from 'svelte-tags-input';

  let tags = $state([]);
</script>

<form method="POST" action="/save">
  <Tags bind:tags name="tags-text" placeholder="Add tags..." />

  {#each tags as tag}
    <input type="hidden" name="tags" value={tag} />
  {/each}

  <button type="submit">Save</button>
</form>
```

On the server, read them with `formData.getAll('tags')`. Any text still typed in the input arrives separately as `tags-text`.

If your tags are objects (from an `autoComplete` list of objects), serialize them instead:

```svelte
<input type="hidden" name="tags" value={JSON.stringify(tags)} />
```

### As a custom element (Lit, vanilla JS, other frameworks)

The package doesn't ship a custom element build, but you can wrap it in your own Svelte component and compile that as a [custom element](https://svelte.dev/docs/svelte/custom-elements):

```svelte
<!-- TagsInputElement.svelte -->
<svelte:options
  customElement={{
    tag: 'tags-input',
    props: {
      tags: { type: 'Array', reflect: false },
      placeholder: { type: 'String' },
      autoComplete: { type: 'Array', attribute: 'auto-complete' }
    }
  }}
/>

<script>
  import Tags from 'svelte-tags-input';

  let { tags = [], placeholder = '', autoComplete = false } = $props();

  const host = $host();
  const emit = (type, detail) =>
    host.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
</script>

<Tags
  bind:tags
  {placeholder}
  {autoComplete}
  onTagAdded={(tag, all) => emit('tag-added', { tag, tags: all })}
  onTagRemoved={(tag, all) => emit('tag-removed', { tag, tags: all })}
/>
```

Compile it with the Svelte compiler options `customElement: true` and `css: 'injected'` (so the component styles are included in the shadow DOM), then use it anywhere:

```html
<tags-input placeholder="Add tags..."></tags-input>

<script type="module">
  const el = document.querySelector('tags-input');
  el.addEventListener('tag-added', (e) => console.log(e.detail.tag, e.detail.tags));
</script>
```

Expose any other props you need the same way, adding them to `props` and passing them through to `<Tags>`.

## Styling

The component ships with default styles scoped to it. To override them, target its classes with `:global()` from a wrapper element:

| Class | Element |
|-------|---------|
| `.svelte-tags-input-layout` | Outer container (tags + input) |
| `.svelte-tags-input-tag` | Each tag |
| `.svelte-tags-input-tag-remove` | The × remove button inside a tag |
| `.svelte-tags-input` | The text input |
| `.svelte-tags-input-matchs` | Autocomplete list (`li.focus` is the highlighted item) |
| `.sti-layout-disable` | Added to the container when `disable` is set |
| `.sti-layout-readonly` | Added to the container when `readonly` is set |

```svelte
<div class="my-tags">
  <Tags bind:tags />
</div>

<style>
  .my-tags :global(.svelte-tags-input-layout .svelte-tags-input-tag) {
    background: #4f46e5;
    border-radius: 999px;
  }

  .my-tags :global(.svelte-tags-input-layout:focus-within) {
    border-color: #4f46e5;
  }
</style>
```

## Development

```bash
npm install
npm test            # run the test suite
npm run build       # build to dist/
```

Issues and pull requests are welcome.

## License

MIT © [Agustín](https://twitter.com/agustinlautaro)
