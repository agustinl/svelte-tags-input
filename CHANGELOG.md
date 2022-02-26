# svelte-tags-input changelog

## 2.9.0
[#52](https://github.com/agustinl/svelte-tags-input/pull/52) thanks to [@mildred](https://github.com/mildred)
* HTML escape autocomplete results and allow custom HTML
* Add option to disble filtering after autocomplete
* Add class when input is focused 
* If autoComplete is a function, pass the search value 
* If autoComplete function returns a Promise, resolve it
## 2.7.1
* Added `onlyAutocomplete` prop, to only accept tags inside the auto complete list ([#41](https://github.com/agustinl/svelte-tags-input/issues/41))
* Dependencies updated
## 2.7.0

* Allow `autoComplete` to handle asynchronous data ([#35](https://github.com/agustinl/svelte-tags-input/issues/35))
* Added `autoCompleteKey` option for array of objects, to choose what key search on `autoComplete` results
## 2.6.5

* Show input after removing the tag using remove keys ([#34](https://github.com/agustinl/svelte-tags-input/pull/34))

## 2.6.4
* Allow create a tag with tab, and change the focus if there is no tag ([#32](https://github.com/agustinl/svelte-tags-input/issues/32))

## 2.6.3
* Added `minChars` option: minimum length of search text to show auto-complete list ([#28](https://github.com/agustinl/svelte-tags-input/issues/28))
* Change homepage in package.json
* Prevent writing if the maximum number of tags allowed is reached ([#25](https://github.com/agustinl/svelte-tags-input/issues/25))
* Highlight the matching characters in the auto-complete list
* Fix bug ([#30](https://github.com/agustinl/svelte-tags-input/issues/30))

## 2.5.1
* Fix deleting last tag while input is not empty ([#26](https://github.com/agustinl/svelte-tags-input/issues/26))

## 2.5.0
* Added the `on:blur` event
* Removed duplicate <kbd>ENTER</kbd> and <kbd>BACKSPACE</kbd> check
* Added `disable` option

## 2.3.1
* Update README

## 2.3.0
* Added a unique ID for each auto-complete list
* If `onlyUnique === true` auto-complete list not show tags previously added
* Enabled navigation with <kbd>ARROW UP</kbd> and <kbd>ARROW DOWN</kbd> the auto-complete list, and corrected the errors
* Close auto-complete list and focus on tags input with <kbd>ESC</kbd>
* Add selected tag in auto-complete list with <kbd>ENTER</kbd>
* Enabled infinite scroll in auto-complete list
* Fixed auto-complete list style to appear above content

## 2.2.1
* Added a unique ID for each input

## 2.2.0
* Improve auto-complete ([#10](https://github.com/agustinl/svelte-tags-input/issues/10))

## 2.1.0
* Added FAQs
* Added a way to reset the input tags ([#7](https://github.com/agustinl/svelte-tags-input/issues/7))
* Added a way to initialize with tags

## 2.0.1
* Added CSS override instructions to documentation
* Added link to modify the current list of tags ([#5](https://github.com/agustinl/svelte-tags-input/issues/5)) to documentation 

## 2.0.0
* Added auto complete feature ([#4](https://github.com/agustinl/svelte-tags-input/issues/4))
* Added vendor prefixes to CSS

## 1.0.16
* Added paste or drop tag or group of tags

## 1.0.15
* Blocking adding empty tag ([#1](https://github.com/agustinl/svelte-tags-input/issues/1))