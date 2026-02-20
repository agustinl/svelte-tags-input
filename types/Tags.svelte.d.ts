/// <reference types="svelte" />
import type { Component } from 'svelte';

export interface TagsProps {
	/**
	 * To get the values (bindable)
	 * @default []
	 */
	tags?: [];

	/**
	 * @default [13]
	 */
	addKeys?: number[];

	/**
	 * Set maximum number of tags
	 * @default false
	 */
	maxTags?: number | boolean;

	/**
	 * @default false
	 */
	onlyUnique?: boolean;

	/**
	 * @default [8]
	 */
	removeKeys?: number[];

	/**
	 * @default ""
	 */
	placeholder?: string;

	/**
	 * @default false
	 */
	allowPaste?: boolean;

	/**
	 * @default false
	 */
	allowDrop?: boolean;

	/**
	 * @default ","
	 */
	splitWith?: string;

	/**
	 * @default false
	 */
	autoComplete?: any[] | ((value: string) => any) | ((value: string) => Promise<any>) | boolean;

	/**
	 * @default true
	 */
	autoCompleteFilter?: boolean;

	/**
	 * @default false
	 */
	autoCompleteKey?: string | boolean;

	/**
	 * @default false
	 */
	autoCompleteMarkupKey?: string | boolean;

	/**
	 * @default false
	 */
	autoCompleteStartFocused?: boolean;

	/**
	 * @default "svelte-tags-input"
	 */
	name?: string;

	/**
	 * @default "sti_" + random string
	 */
	id?: string;

	/**
	 * @default false
	 */
	allowBlur?: boolean;

	/**
	 * @default false
	 */
	disable?: boolean;

	/**
	 * @default 1
	 */
	minChars?: number;

	/**
	 * @default false
	 */
	onlyAutocomplete?: boolean;

	/**
	 * @default name
	 */
	labelText?: string;

	/**
	 * @default false
	 */
	labelShow?: boolean;

	/**
	 * @default false
	 */
	readonly?: boolean;

	/**
	 * @default () => {}
	 */
	onTagClick?: (tag: string | object) => void;

	/**
	 * @default autoCompleteKey
	 */
	autoCompleteShowKey?: string;

	/**
	 * @default () => {}
	 */
	onTagAdded?: (tag: string | object, tags: any[]) => void;

	/**
	 * @default () => {}
	 */
	onTagRemoved?: (tag: string | object, tags: any[]) => void;

	/**
	 * @default false
	 */
	cleanOnBlur?: boolean;

	/**
	 * @default false
	 */
	customValidation?: ((tag: string) => boolean) | false;
}

declare const Tags: Component<TagsProps>;
export default Tags;
