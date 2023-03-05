# svelte-tags-input changelog

## 5.0.0

* **Fix:** Tag a11y events warning.
* **Add:** `autoCompleteShowKey` prop to show a different value form the object returned in auto complete list. [#85](https://github.com/agustinl/svelte-tags-input/issues/85)
* **Fix:** Fix `onlyUnique` if is array of objects. [#80](https://github.com/agustinl/svelte-tags-input/issues/80)
* **Fix:** Fix `minChars` type. [#82](https://github.com/agustinl/svelte-tags-input/issues/82)

## 4.0.0

* **Add:** support for binding values. [#38](https://github.com/agustinl/svelte-tags-input/issues/38)
* **Add:** `readonly` prop for display mode. [#63](https://github.com/agustinl/svelte-tags-input/issues/63)

## 3.0.0

Thanks to [@dnotes](https://github.com/dnotes)

* **Fix:** Tags input does not have an outline like other fields [#68](https://github.com/agustinl/svelte-tags-input/issues/68)
* **Fix:** Browser's autocomplete can interfere with Tags autocomplete [#67](https://github.com/agustinl/svelte-tags-input/issues/67)
* **Fix:** Cannot tab to choose a tag even if `allowBlur` is true [#66](https://github.com/agustinl/svelte-tags-input/issues/66)
* **Fix:** Matches list opens even when `maxTags` has been reached[#65](https://github.com/agustinl/svelte-tags-input/issues/65)
* **Fix:** matches list stays open on blur [#64](https://github.com/agustinl/svelte-tags-input/issues/64)
* Remove unused `acorn` dependency [#61](https://github.com/agustinl/svelte-tags-input/issues/61)
## 2.9.2
* **Fix:** keyboard navigation of suggestions broken [#59](https://github.com/agustinl/svelte-tags-input/issues/59)

## 2.9.1
* **Fix:** onBlur bug. [#58](https://github.com/agustinl/svelte-tags-input/issues/58)
## 2.9.0
[#52](https://github.com/agustinl/svelte-tags-input/pull/52) thanks to [@mildred](https://github.com/mildred)
* HTML escape autoComplete results and allow custom HTML
* Add option `autoCompleteFilter` to disable filtering after autoComplete
* Add class when input is focused
* If autoComplete is a function, pass the search value 
* If autoComplete function returns a Promise, resolve it
* Add possibility to set `minChars` to 0 to show all autoComplete results without filter on input click. [#55](https://github.com/agustinl/svelte-tags-input/issues/55)
## 2.7.1
* **Add:** `onlyAutocomplete` prop, to only accept tags inside the auto complete list [#41](https://github.com/agustinl/svelte-tags-input/issues/41)
* Dependencies updated
## 2.7.0

* Allow `autoComplete` to handle asynchronous data [#35](https://github.com/agustinl/svelte-tags-input/issues/35)
* **Add:** `autoCompleteKey` option for array of objects, to choose what key search on `autoComplete` results
## 2.6.5

* Show input after removing the tag using remove keys [#34](https://github.com/agustinl/svelte-tags-input/pull/34)

## 2.6.4
* Allow create a tag with tab, and change the focus if there is no tag [#32](https://github.com/agustinl/svelte-tags-input/issues/32)

## 2.6.3
* **Add:** `minChars` option: minimum length of search text to show auto-complete list [#28](https://github.com/agustinl/svelte-tags-input/issues/28)
* Change homepage in package.json
* Prevent writing if the maximum number of tags allowed is reached [#25](https://github.com/agustinl/svelte-tags-input/issues/25)
* Highlight the matching characters in the auto-complete list
* **Fix:** bug [#30](https://github.com/agustinl/svelte-tags-input/issues/30)

## 2.5.1
* **Fix:** deleting last tag while input is not empty [#26](https://github.com/agustinl/svelte-tags-input/issues/26)

## 2.5.0
* **Add:** the `on:blur` event
* Removed duplicate <kbd>ENTER</kbd> and <kbd>BACKSPACE</kbd> check
* **Add:** `disable` option

## 2.3.1
* Update README

## 2.3.0
* **Add:** a unique ID for each auto-complete list
* If `onlyUnique === true` auto-complete list not show tags previously **Add:**
* Enabled navigation with <kbd>ARROW UP</kbd> and <kbd>ARROW DOWN</kbd> the auto-complete list, and corrected the errors
* Close auto-complete list and focus on tags input with <kbd>ESC</kbd>
* Add selected tag in auto-complete list with <kbd>ENTER</kbd>
* Enabled infinite scroll in auto-complete list
* Fixed auto-complete list style to appear above content

## 2.2.1
* **Add:** a unique ID for each input

## 2.2.0
* Improve auto-complete [#10](https://github.com/agustinl/svelte-tags-input/issues/10)

## 2.1.0
* **Add:** FAQs
* **Add:** a way to reset the input tags [#7](https://github.com/agustinl/svelte-tags-input/issues/7)
* **Add:** a way to initialize with tags

## 2.0.1
* **Add:** CSS override instructions to documentation
* **Add:** link to modify the current list of tags [#5](https://github.com/agustinl/svelte-tags-input/issues/5) to documentation 

## 2.0.0
* **Add:** auto complete feature [#4](https://github.com/agustinl/svelte-tags-input/issues/4)
* **Add:** vendor prefixes to CSS

## 1.0.16
* **Add:** paste or drop tag or group of tags

## 1.0.15
* Blocking adding empty tag [#1](https://github.com/agustinl/svelte-tags-input/issues/1)