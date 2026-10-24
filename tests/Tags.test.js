import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import TagsWrapper from './TagsWrapper.svelte';

function pressEnter(element) {
	fireEvent.keyDown(element, { key: 'Enter', keyCode: 13, which: 13 });
}

function pressBackspace(element) {
	fireEvent.keyDown(element, { key: 'Backspace', keyCode: 8, which: 8 });
}

function createDataTransfer() {
	const data = {};
	return {
		dropEffect: 'none',
		effectAllowed: 'all',
		setData: (type, value) => (data[type] = value),
		getData: (type) => data[type] ?? '',
	};
}

function tagTexts(container) {
	return [...container.querySelectorAll('.svelte-tags-input-tag')].map((el) =>
		el.firstChild.textContent.trim()
	);
}

/** Drags the tag at `from` over the tag at `to`, then drops (or cancels) the drag. */
async function dragTag(container, from, to, { drop = true } = {}) {
	const dataTransfer = createDataTransfer();
	const tagAt = (i) => container.querySelectorAll('.svelte-tags-input-tag')[i];
	const source = tagAt(from);

	await fireEvent.dragStart(source, { dataTransfer });
	await fireEvent.dragOver(tagAt(to), { dataTransfer });
	if (drop) await fireEvent.drop(tagAt(to), { dataTransfer });
	await fireEvent.dragEnd(source, { dataTransfer });
}

/** Fires dragover with a pointer position (jsdom has no DragEvent, so fireEvent drops clientX). */
function dragOverAt(element, clientX, dataTransfer) {
	const event = new MouseEvent('dragover', { bubbles: true, cancelable: true, clientX });
	Object.defineProperty(event, 'dataTransfer', { value: dataTransfer });
	return fireEvent(element, event);
}

/** Gives an element a fixed layout box, since jsdom doesn't compute layout. */
function mockRect(element, { left, top = 0, width = 100, height = 20 }) {
	element.getBoundingClientRect = () => ({
		left,
		top,
		width,
		height,
		right: left + width,
		bottom: top + height,
	});
}

describe('Tags', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Rendering', () => {
		it('renders empty input with placeholder', () => {
			const { container } = render(TagsWrapper, {
				props: {
					tags: [],
					placeholder: 'Add tags...',
				},
			});

			const input = container.querySelector('.svelte-tags-input');
			expect(input).toBeTruthy();
			expect(input.placeholder).toBe('Add tags...');
		});

		it('renders existing tags', () => {
			render(TagsWrapper, {
				props: {
					tags: ['tag1', 'tag2'],
					placeholder: '',
				},
			});

			expect(screen.getByText('tag1')).toBeTruthy();
			expect(screen.getByText('tag2')).toBeTruthy();
		});
	});

	describe('Add tag', () => {
		it('typing + Enter adds tag to tags array', async () => {
			const user = userEvent.setup();
			const tags = [];
			const { container } = render(TagsWrapper, {
				props: { tags, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			await user.type(input, 'newtag');
			pressEnter(input);

			expect(screen.getByText('newtag')).toBeTruthy();
		});

		it('does not add empty tag on Enter', async () => {
			const user = userEvent.setup();
			const tags = [];
			const { container } = render(TagsWrapper, {
				props: { tags, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			await user.click(input);
			pressEnter(input);

			expect(container.querySelectorAll('.svelte-tags-input-tag')).toHaveLength(0);
		});
	});

	describe('Remove tag', () => {
		it('Backspace on empty input removes last tag', async () => {
			const user = userEvent.setup();
			const tags = ['tag1', 'tag2'];
			const { container } = render(TagsWrapper, {
				props: { tags, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			await user.click(input);
			pressBackspace(input);

			expect(screen.queryByText('tag2')).toBeNull();
			expect(screen.getByText('tag1')).toBeTruthy();
		});

		it('clicking remove button removes tag', async () => {
			const user = userEvent.setup();
			const tags = ['tag1', 'tag2'];
			const { container } = render(TagsWrapper, {
				props: { tags, placeholder: '' },
			});

			const removeButtons = container.querySelectorAll('.svelte-tags-input-tag-remove');
			await user.click(removeButtons[1]); // Remove tag2

			expect(screen.queryByText('tag2')).toBeNull();
			expect(screen.getByText('tag1')).toBeTruthy();
		});
	});

	describe('maxTags', () => {
		it('stops adding when maxTags reached', async () => {
			const user = userEvent.setup();
			const tags = ['tag1', 'tag2'];
			const { container } = render(TagsWrapper, {
				props: { tags, maxTags: 2, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			await user.type(input, 'tag3');
			pressEnter(input);

			expect(screen.queryByText('tag3')).toBeNull();
			expect(screen.getByText('tag1')).toBeTruthy();
			expect(screen.getByText('tag2')).toBeTruthy();
		});
	});

	describe('onlyUnique', () => {
		it('rejects duplicate tags', async () => {
			const user = userEvent.setup();
			const tags = ['existing'];
			const { container } = render(TagsWrapper, {
				props: { tags, onlyUnique: true, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			await user.type(input, 'existing');
			pressEnter(input);

			const existingTags = screen.getAllByText('existing');
			expect(existingTags).toHaveLength(1);
		});
	});

	describe('allowPaste', () => {
		it('pasted comma-separated text adds multiple tags', async () => {
			const user = userEvent.setup();
			const tags = [];
			const { container } = render(TagsWrapper, {
				props: { tags, allowPaste: true, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			await user.click(input);
			await user.paste('tag1, tag2, tag3');

			expect(screen.getByText('tag1')).toBeTruthy();
			expect(screen.getByText('tag2')).toBeTruthy();
			expect(screen.getByText('tag3')).toBeTruthy();
		});
	});

	describe('disable/readonly', () => {
		it('input disabled when disable=true', () => {
			const { container } = render(TagsWrapper, {
				props: { tags: [], disable: true, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			expect(input.disabled).toBe(true);
		});

		it('input disabled when readonly=true', () => {
			const { container } = render(TagsWrapper, {
				props: { tags: [], readonly: true, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			expect(input.disabled).toBe(true);
		});

		it('remove buttons hidden when disable=true', () => {
			const { container } = render(TagsWrapper, {
				props: { tags: ['tag1'], disable: true, placeholder: '' },
			});

			const removeButtons = container.querySelectorAll('.svelte-tags-input-tag-remove');
			expect(removeButtons).toHaveLength(0);
		});

		it('remove buttons hidden when readonly=true', () => {
			const { container } = render(TagsWrapper, {
				props: { tags: ['tag1'], readonly: true, placeholder: '' },
			});

			const removeButtons = container.querySelectorAll('.svelte-tags-input-tag-remove');
			expect(removeButtons).toHaveLength(0);
		});
	});

	describe('autoComplete', () => {
		it('shows dropdown when typing and selects with Enter', async () => {
			const user = userEvent.setup();
			const tags = [];
			const suggestions = ['Apple', 'Apricot', 'Banana'];
			const { container } = render(TagsWrapper, {
				props: {
					tags,
					autoComplete: suggestions,
					placeholder: '',
					minChars: 1,
					autoCompleteStartFocused: true,
				},
			});

			const input = container.querySelector('.svelte-tags-input');
			await user.type(input, 'Ap');

			expect(container.textContent).toContain('Apple');
			expect(container.textContent).toContain('Apricot');

			pressEnter(input);

			expect(container.textContent).toContain('Apple');
		});
	});

	describe('Callbacks', () => {
		it('onTagAdded fires when tag is added', async () => {
			const user = userEvent.setup();
			const onTagAdded = vi.fn();
			const tags = [];
			const { container } = render(TagsWrapper, {
				props: { tags, onTagAdded, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			await user.type(input, 'mytag');
			pressEnter(input);

			expect(onTagAdded).toHaveBeenCalledWith('mytag', expect.any(Array));
			expect(onTagAdded.mock.calls[0][1]).toContain('mytag');
		});

		it('onTagRemoved fires when tag is removed', async () => {
			const user = userEvent.setup();
			const onTagRemoved = vi.fn();
			const tags = ['tag1', 'tag2'];
			const { container } = render(TagsWrapper, {
				props: { tags, onTagRemoved, placeholder: '' },
			});

			const removeButtons = container.querySelectorAll('.svelte-tags-input-tag-remove');
			await user.click(removeButtons[0]);

			expect(onTagRemoved).toHaveBeenCalled();
			expect(screen.queryByText('tag1')).toBeNull();
		});

		it('onTagClick fires when tag is clicked', async () => {
			const user = userEvent.setup();
			const onTagClick = vi.fn();
			const tags = ['tag1'];
			render(TagsWrapper, {
				props: { tags, onTagClick, placeholder: '' },
			});

			const tagButton = screen.getByText('tag1');
			await user.click(tagButton);

			expect(onTagClick).toHaveBeenCalledWith('tag1');
		});
	});

	describe('allowReorder', () => {
		it('tags are not draggable by default', () => {
			const { container } = render(TagsWrapper, {
				props: { tags: ['a', 'b'], placeholder: '' },
			});

			const tag = container.querySelector('.svelte-tags-input-tag');
			expect(tag.getAttribute('draggable')).toBeNull();
		});

		it('moves a tag forward when dropped on a later tag', async () => {
			const { container } = render(TagsWrapper, {
				props: { tags: ['a', 'b', 'c'], allowReorder: true, placeholder: '' },
			});

			await dragTag(container, 0, 2);

			expect(tagTexts(container)).toEqual(['b', 'c', 'a']);
		});

		it('moves a tag backward when dropped on an earlier tag', async () => {
			const { container } = render(TagsWrapper, {
				props: { tags: ['a', 'b', 'c'], allowReorder: true, placeholder: '' },
			});

			await dragTag(container, 2, 0);

			expect(tagTexts(container)).toEqual(['c', 'a', 'b']);
		});

		it('restores the original order when the drag is cancelled', async () => {
			const onTagReordered = vi.fn();
			const { container } = render(TagsWrapper, {
				props: { tags: ['a', 'b', 'c'], allowReorder: true, onTagReordered, placeholder: '' },
			});

			await dragTag(container, 0, 2, { drop: false });

			expect(tagTexts(container)).toEqual(['a', 'b', 'c']);
			expect(onTagReordered).not.toHaveBeenCalled();
		});

		it('reorders by position, so duplicate tags work without onlyUnique', async () => {
			const onTagReordered = vi.fn();
			const { container } = render(TagsWrapper, {
				props: { tags: ['x', 'y', 'x'], allowReorder: true, onTagReordered, placeholder: '' },
			});

			await dragTag(container, 1, 2);

			expect(tagTexts(container)).toEqual(['x', 'x', 'y']);
			expect(onTagReordered).toHaveBeenCalledWith('y', ['x', 'x', 'y'], 1, 2);
		});

		it('onTagReordered receives the tag, new tags and indexes', async () => {
			const onTagReordered = vi.fn();
			const { container } = render(TagsWrapper, {
				props: { tags: ['a', 'b', 'c'], allowReorder: true, onTagReordered, placeholder: '' },
			});

			await dragTag(container, 0, 1);

			expect(onTagReordered).toHaveBeenCalledWith('a', ['b', 'a', 'c'], 0, 1);
		});

		it('does not add the dragged tag as text when dropped on the input', async () => {
			const { container } = render(TagsWrapper, {
				props: { tags: ['a', 'b'], allowReorder: true, allowDrop: true, placeholder: '' },
			});

			const dataTransfer = createDataTransfer();
			const source = container.querySelector('.svelte-tags-input-tag');
			const input = container.querySelector('.svelte-tags-input');
			await fireEvent.dragStart(source, { dataTransfer });
			await fireEvent.drop(input, { dataTransfer });
			await fireEvent.dragEnd(source, { dataTransfer });

			expect(tagTexts(container)).toEqual(['a', 'b']);
		});

		it.each([{ readonly: true }, { disable: true }])('tags are not draggable with %o', (prop) => {
			const { container } = render(TagsWrapper, {
				props: { tags: ['a'], allowReorder: true, placeholder: '', ...prop },
			});

			const tag = container.querySelector('.svelte-tags-input-tag');
			expect(tag.getAttribute('draggable')).toBeNull();
		});

		it('does not call onTagReordered when a tag is dropped on itself', async () => {
			const onTagReordered = vi.fn();
			const { container } = render(TagsWrapper, {
				props: { tags: ['a', 'b'], allowReorder: true, onTagReordered, placeholder: '' },
			});

			await dragTag(container, 0, 0);

			expect(tagTexts(container)).toEqual(['a', 'b']);
			expect(onTagReordered).not.toHaveBeenCalled();
		});

		it('reorders object tags', async () => {
			const onTagReordered = vi.fn();
			const tags = [{ name: 'a' }, { name: 'b' }, { name: 'c' }];
			const { container } = render(TagsWrapper, {
				props: { tags, autoCompleteKey: 'name', allowReorder: true, onTagReordered, placeholder: '' },
			});

			await dragTag(container, 0, 2);

			expect(tagTexts(container)).toEqual(['b', 'c', 'a']);
			expect(onTagReordered).toHaveBeenCalledWith(
				{ name: 'a' },
				[{ name: 'b' }, { name: 'c' }, { name: 'a' }],
				0,
				2
			);
		});

		it('commits the preview when dropped on an empty part of the layout', async () => {
			const { container } = render(TagsWrapper, {
				props: { tags: ['a', 'b', 'c'], allowReorder: true, placeholder: '' },
			});

			const dataTransfer = createDataTransfer();
			const tags = container.querySelectorAll('.svelte-tags-input-tag');
			await fireEvent.dragStart(tags[0], { dataTransfer });
			await fireEvent.dragOver(tags[2], { dataTransfer });
			await fireEvent.drop(container.querySelector('.svelte-tags-input-layout'), { dataTransfer });
			await fireEvent.dragEnd(tags[0], { dataTransfer });

			expect(tagTexts(container)).toEqual(['b', 'c', 'a']);
		});

		it('discards the drag if tags change while dragging', async () => {
			const onTagReordered = vi.fn();
			const { container, rerender } = render(TagsWrapper, {
				props: { tags: ['a', 'b', 'c'], allowReorder: true, onTagReordered, placeholder: '' },
			});

			const dataTransfer = createDataTransfer();
			const tags = container.querySelectorAll('.svelte-tags-input-tag');
			await fireEvent.dragStart(tags[0], { dataTransfer });
			await fireEvent.dragOver(tags[2], { dataTransfer });
			await rerender({ tags: ['x', 'y', 'z'] });
			await fireEvent.drop(container.querySelector('.svelte-tags-input-layout'), { dataTransfer });

			expect(tagTexts(container)).toEqual(['x', 'y', 'z']);
			expect(onTagReordered).not.toHaveBeenCalled();
		});

		it('marks the dragged tag with .sti-tag-dragging only while dragging', async () => {
			const { container } = render(TagsWrapper, {
				props: { tags: ['a', 'b'], allowReorder: true, placeholder: '' },
			});

			const dataTransfer = createDataTransfer();
			const tag = container.querySelector('.svelte-tags-input-tag');
			await fireEvent.dragStart(tag, { dataTransfer });
			expect(tag.classList.contains('sti-tag-dragging')).toBe(true);

			await fireEvent.dragEnd(tag, { dataTransfer });
			expect(container.querySelector('.sti-tag-dragging')).toBeNull();
		});

		it('only moves a tag once the pointer passes the hovered tag midpoint', async () => {
			const { container } = render(TagsWrapper, {
				props: { tags: ['a', 'b', 'c'], allowReorder: true, placeholder: '' },
			});

			const dataTransfer = createDataTransfer();
			const [a, b, c] = container.querySelectorAll('.svelte-tags-input-tag');
			mockRect(a, { left: 0 });
			mockRect(b, { left: 100 });
			mockRect(c, { left: 200 });

			await fireEvent.dragStart(a, { dataTransfer });
			await dragOverAt(b, 140, dataTransfer);
			expect(tagTexts(container)).toEqual(['a', 'b', 'c']);

			await dragOverAt(b, 160, dataTransfer);
			expect(tagTexts(container)).toEqual(['b', 'a', 'c']);
		});

		it('moves a tag right away when hovering a tag on another row', async () => {
			const { container } = render(TagsWrapper, {
				props: { tags: ['a', 'b', 'c'], allowReorder: true, placeholder: '' },
			});

			const dataTransfer = createDataTransfer();
			const [a, b, c] = container.querySelectorAll('.svelte-tags-input-tag');
			mockRect(a, { left: 0 });
			mockRect(b, { left: 100 });
			mockRect(c, { left: 0, top: 30 });

			await fireEvent.dragStart(a, { dataTransfer });
			await dragOverAt(c, 10, dataTransfer);

			expect(tagTexts(container)).toEqual(['b', 'c', 'a']);
		});

		it('ignores a tag dragged from another instance onto the input', async () => {
			const { container } = render(TagsWrapper, {
				props: { tags: ['a'], allowReorder: true, allowDrop: true, placeholder: '' },
			});

			const dataTransfer = createDataTransfer();
			dataTransfer.setData('application/x-svelte-tags-input', '0');
			await fireEvent.drop(container.querySelector('.svelte-tags-input'), { dataTransfer });

			expect(tagTexts(container)).toEqual(['a']);
		});
	});

	describe('customValidation', () => {
		it('rejects invalid tags per custom function', async () => {
			const user = userEvent.setup();
			const tags = [];
			const customValidation = (tag) => tag === 'valid';
			const { container } = render(TagsWrapper, {
				props: { tags, customValidation, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			await user.type(input, 'invalid');
			pressEnter(input);

			expect(screen.queryByText('invalid')).toBeNull();

			await user.clear(input);
			await user.type(input, 'valid');
			pressEnter(input);

			expect(screen.getByText('valid')).toBeTruthy();
		});
	});
});
