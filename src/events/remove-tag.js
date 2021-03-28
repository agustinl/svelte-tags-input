
export const removeTag = (
    index,
    id,
    storePlaceholder,
    getTags,
    setTags,
    spliceTags,
    setPlaceholder,
    setArrelementsmatch,
    dispatch
 ) => {
    
    spliceTags(index, 1)
    setTags(getTags())
    
    dispatch('tags', { tags: getTags() })
    
    // Hide autocomplete list
    // Focus on svelte tags input
    setArrelementsmatch([])
    document.getElementById(id).readOnly = false
    setPlaceholder(storePlaceholder)
    document.getElementById(id).focus()
    
}
