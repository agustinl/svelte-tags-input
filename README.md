<p align="center">
  <a href="https://svelte-tags-input.vercel.app">
    <img src="https://svelte-tags-input.vercel.app/readme-image.png" alt="Svelte Tags Input" width="600" />
  </a>
</p>

<h1 align="center">svelte-tags-input</h1>

<p align="center">
  <strong>A fully customizable tags input component for Svelte 5</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/svelte-tags-input"><img src="https://img.shields.io/npm/v/svelte-tags-input.svg" alt="npm version" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" /></a>
  <a href="https://madewithsvelte.com/p/svelte-tags-input/shield-link"><img src="https://madewithsvelte.com/storage/repo-shields/2151-shield.svg" alt="Made with Svelte" /></a>
</p>

<p align="center">
  <a href="https://svelte-tags-input.vercel.app">Live Demo</a> ·
  <a href="https://svelte-tags-input.vercel.app">FAQs</a> ·
  <a href="CHANGELOG.md">Changelog</a>
</p>

---

## Features

- **Keyboard-driven** — Add tags with Enter/Tab, remove with Backspace, navigate autocomplete with Arrow keys
- **Autocomplete** — Array or async function, with filtering and custom display keys
- **Paste & drop** — Paste comma-separated text or drag-and-drop tags
- **Accessible** — ARIA-friendly, screen reader labels, keyboard navigation
- **Flexible** — Max tags, unique-only, custom validation, blur behavior
- **Svelte 5** — Built with runes (`$props`, `$state`, `$derived`, `$bindable`)

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
| `autoComplete` | `Array \| (value: string) => any` | `false` | Suggestions array or async fetcher |
| `autoCompleteKey` | `string` | `false` | Key for object items in `autoComplete` |
| `autoCompleteShowKey` | `string` | `autoCompleteKey` | Key to display (when different from search key) |
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
| `customValidation` | `(tag) => boolean` | `false` | Custom validation before adding |

[Key codes reference](https://keycode.info/)

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

### Async autocomplete (API)

```svelte
<script>
  import Tags from 'svelte-tags-input';

  let tags = $state([]);

  async function fetchCountries(query) {
    const res = await fetch(
	    `https://restcountries.com/v2/name/${query}?fields=name,alpha3Code,flag`
    );
    const data = await res.json();
    return data;
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

## License

MIT © [Agustín](https://twitter.com/agustinlautaro)
