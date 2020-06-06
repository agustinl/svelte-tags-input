# svelte-tags-input changelog

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
* Improve auto-complete ([#10](https://github.com/agustinl/svelte-tags-input/pull/10))

## 2.1.0
* Added FAQs
* Added a way to reset the input tags ([#7](https://github.com/agustinl/svelte-tags-input/issues/7))
* Added a way to initialize with tags

## 2.0.1
* Added CSS override instructions to documentation
* Added link to modify the current list of tags ([#5](https://github.com/agustinl/svelte-tags-input/pull/5)) to documentation 

## 2.0.0
* Added auto complete feature ([#4](https://github.com/agustinl/svelte-tags-input/pull/4))
* Added vendor prefixes to CSS

## 1.0.16
* Added paste or drop tag or group of tags

## 1.0.15
* Blocking adding empty tag ([#1](https://github.com/agustinl/svelte-tags-input/pull/1))