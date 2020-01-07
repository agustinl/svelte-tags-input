var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var src = createCommonjsModule(function (module, exports) {
(function (global, factory) {
     factory(exports) ;
}(commonjsGlobal, (function (exports) {
    function noop() { }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    /* src\Tags.svelte generated by Svelte v3.16.7 */

    function add_css() {
    	var style = element("style");
    	style.id = "svelte-1gi6y6e-style";
    	style.textContent = ".svelte-tags-input.svelte-1gi6y6e,.svelte-tags-input-tag.svelte-1gi6y6e{font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Oxygen,Ubuntu,Cantarell,\"Fira Sans\",\"Droid Sans\",\"Helvetica Neue\",sans-serif;font-size:14px;padding:2px 5px}.svelte-tags-input-layout.svelte-1gi6y6e{display:flex;flex-wrap:wrap;align-items:center;padding:0px 5px 5px 5px;border:solid 1px #CCC;background:#FFF;border-radius:2px}.svelte-tags-input-layout.svelte-1gi6y6e:focus,.svelte-tags-input-layout.svelte-1gi6y6e:hover{border:solid 1px #000}.svelte-tags-input.svelte-1gi6y6e{flex:1;margin:0;margin-top:5px;border:none}.svelte-tags-input.svelte-1gi6y6e:focus{outline:0}.svelte-tags-input-tag.svelte-1gi6y6e{display:flex;white-space:nowrap;list-style:none;background:#000;color:#FFF;border-radius:2px;margin-right:5px;margin-top:5px}.svelte-tags-input-tag-remove.svelte-1gi6y6e{cursor:pointer}";
    	append(document.head, style);
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    // (105:4) {#if tags.length > 0}
    function create_if_block(ctx) {
    	let each_1_anchor;
    	let each_value = /*tags*/ ctx[1];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	return {
    		c() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*removeTag, tags*/ 18) {
    				each_value = /*tags*/ ctx[1];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (106:8) {#each tags as tag, i}
    function create_each_block(ctx) {
    	let span1;
    	let t0_value = /*tag*/ ctx[2] + "";
    	let t0;
    	let t1;
    	let span0;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[11](/*i*/ ctx[14], ...args);
    	}

    	return {
    		c() {
    			span1 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			span0 = element("span");
    			span0.textContent = "×";
    			attr(span0, "class", "svelte-tags-input-tag-remove svelte-1gi6y6e");
    			attr(span1, "class", "svelte-tags-input-tag svelte-1gi6y6e");
    			dispose = listen(span0, "click", click_handler);
    		},
    		m(target, anchor) {
    			insert(target, span1, anchor);
    			append(span1, t0);
    			append(span1, t1);
    			append(span1, span0);
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*tags*/ 2 && t0_value !== (t0_value = /*tag*/ ctx[2] + "")) set_data(t0, t0_value);
    		},
    		d(detaching) {
    			if (detaching) detach(span1);
    			dispose();
    		}
    	};
    }

    function create_fragment(ctx) {
    	let div;
    	let t;
    	let input;
    	let dispose;
    	let if_block = /*tags*/ ctx[1].length > 0 && create_if_block(ctx);

    	return {
    		c() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			input = element("input");
    			attr(input, "type", "text");
    			attr(input, "class", "svelte-tags-input svelte-1gi6y6e");
    			attr(input, "placeholder", /*placeholder*/ ctx[0]);
    			attr(div, "class", "svelte-tags-input-layout svelte-1gi6y6e");

    			dispose = [
    				listen(input, "input", /*input_input_handler*/ ctx[12]),
    				listen(input, "keydown", /*setTag*/ ctx[3])
    			];
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append(div, t);
    			append(div, input);
    			set_input_value(input, /*tag*/ ctx[2]);
    		},
    		p(ctx, [dirty]) {
    			if (/*tags*/ ctx[1].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*placeholder*/ 1) {
    				attr(input, "placeholder", /*placeholder*/ ctx[0]);
    			}

    			if (dirty & /*tag*/ 4 && input.value !== /*tag*/ ctx[2]) {
    				set_input_value(input, /*tag*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    			if (if_block) if_block.d();
    			run_all(dispose);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let tags = [];
    	let tag;
    	let { addKeys } = $$props;
    	let { maxTags } = $$props;
    	let { onlyUnique } = $$props;
    	let { removeKeys } = $$props;
    	let { placeholder } = $$props;

    	function setTag(event) {
    		const currentTag = event.target.value;

    		if (event.keyCode === 13) {
    			addTag(currentTag);
    		}

    		if (event.keyCode === 8 && tag == "") {
    			tags.pop();
    			$$invalidate(1, tags);
    			dispatch("tags", { tags });
    		}

    		if (addKeys) {
    			addKeys.forEach(function (key) {
    				if (key === event.keyCode) {
    					switch (event.keyCode) {
    						case 188:
    							addTag(currentTag.substring(0, currentTag.length - 1));
    							break;
    						case 9:
    							event.preventDefault();
    							addTag(currentTag);
    							break;
    						default:
    							addTag(currentTag);
    							break;
    					}
    				}
    			});
    		}

    		if (removeKeys) {
    			removeKeys.forEach(function (key) {
    				if (key === event.keyCode) {
    					tags.pop();
    					$$invalidate(1, tags);
    					$$invalidate(2, tag = "");
    					dispatch("tags", { tags });
    				}
    			});
    		}
    	}

    	function addTag(currentTag) {
    		if (currentTag == "") return;
    		if (maxTags && tags.length == maxTags) return;

    		if (onlyUnique) {
    			if (tags.includes(currentTag)) return;
    		}

    		tags.push(currentTag);
    		$$invalidate(1, tags);
    		$$invalidate(2, tag = "");
    		dispatch("tags", { tags });
    	}

    	function removeTag(i) {
    		tags.splice(i, 1);
    		$$invalidate(1, tags);
    		dispatch("tags", { tags });
    	}

    	const click_handler = i => removeTag(i);

    	function input_input_handler() {
    		tag = this.value;
    		$$invalidate(2, tag);
    	}

    	$$self.$set = $$props => {
    		if ("addKeys" in $$props) $$invalidate(5, addKeys = $$props.addKeys);
    		if ("maxTags" in $$props) $$invalidate(6, maxTags = $$props.maxTags);
    		if ("onlyUnique" in $$props) $$invalidate(7, onlyUnique = $$props.onlyUnique);
    		if ("removeKeys" in $$props) $$invalidate(8, removeKeys = $$props.removeKeys);
    		if ("placeholder" in $$props) $$invalidate(0, placeholder = $$props.placeholder);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*addKeys*/ 32) {
    			 $$invalidate(5, addKeys = addKeys || false);
    		}

    		if ($$self.$$.dirty & /*maxTags*/ 64) {
    			 $$invalidate(6, maxTags = maxTags || false);
    		}

    		if ($$self.$$.dirty & /*onlyUnique*/ 128) {
    			 $$invalidate(7, onlyUnique = onlyUnique || false);
    		}

    		if ($$self.$$.dirty & /*removeKeys*/ 256) {
    			 $$invalidate(8, removeKeys = removeKeys || false);
    		}

    		if ($$self.$$.dirty & /*placeholder*/ 1) {
    			 $$invalidate(0, placeholder = placeholder || "");
    		}
    	};

    	return [
    		placeholder,
    		tags,
    		tag,
    		setTag,
    		removeTag,
    		addKeys,
    		maxTags,
    		onlyUnique,
    		removeKeys,
    		dispatch,
    		addTag,
    		click_handler,
    		input_input_handler
    	];
    }

    class Tags extends SvelteComponent {
    	constructor(options) {
    		super();
    		if (!document.getElementById("svelte-1gi6y6e-style")) add_css();

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			addKeys: 5,
    			maxTags: 6,
    			onlyUnique: 7,
    			removeKeys: 8,
    			placeholder: 0
    		});
    	}
    }

    exports.Tags = Tags;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
});

var index = unwrapExports(src);

export default index;
r = placeholder || "");
	    		}
	    	};

	    	return [
	    		placeholder,
	    		tags,
	    		tag,
	    		setTag,
	    		removeTag,
	    		addKeys,
	    		maxTags,
	    		onlyUnique,
	    		removeKeys,
	    		dispatch,
	    		addTag,
	    		click_handler,
	    		input_input_handler
	    	];
	    }

	    class Tags extends SvelteComponent {
	    	constructor(options) {
	    		super();
	    		if (!document.getElementById("svelte-1gi6y6e-style")) add_css();

	    		init(this, options, instance, create_fragment, safe_not_equal, {
	    			addKeys: 5,
	    			maxTags: 6,
	    			onlyUnique: 7,
	    			removeKeys: 8,
	    			placeholder: 0
	    		});
	    	}
	    }

	    exports.Tags = Tags;

	    Object.defineProperty(exports, '__esModule', { value: true });

	})));
	});

	var index = unwrapExports(src);

	return index;

})));
