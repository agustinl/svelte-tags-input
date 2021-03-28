
const _addTag = (
    currentTag,
    getTags,
    setTag,
    setTags,
    pushTag,
    setArrelementsmatch,
    autoCompleteKey,
    maxTags,
    id,
    onlyUnique,
    placeholder,
    dispatch
) => {
    
    let currentObjTags = null
    
    if (typeof currentTag === 'object' && currentTag !== null) {
        
        if (!autoCompleteKey)
            return console.error("'autoCompleteKey' is necessary if 'autoComplete' result is an array of objects")
        
        currentObjTags = currentTag
        currentTag = currentTag[autoCompleteKey].trim()
        
    } else {
        
        currentTag = currentTag.trim()
        
    }
    
    if (currentTag == '') return
    if (maxTags && getTags().length == maxTags) return    
    if (onlyUnique && getTags().includes(currentTag)) return
    
    return currentObjTags ? currentObjTags : currentTag
    
}

export const addTag = (
    currentTag,
    getTags,
    setTag,
    setTags,
    pushTag,
    setArrelementsmatch,
    autoCompleteKey,
    maxTags,
    id,
    onlyUnique,
    placeholder,
    dispatch
) => {
    
    const _currentTag = Array.isArray(currentTag)
        ? currentTag : [currentTag]
    
    const newTags = _currentTag.map(it => _addTag(
        it,
        getTags,
        setTag,
        setTags,
        pushTag,
        setArrelementsmatch,
        autoCompleteKey,
        maxTags,
        id,
        onlyUnique,
        placeholder,
        dispatch
    )).filter(Boolean)
    
    newTags.forEach(it => {
        let newTag = it
        if (autoCompleteKey && typeof it !== 'object')
            newTag = { [autoCompleteKey]: it }
        pushTag(newTag)
    })
    
    setTags(getTags())
    setTag('')
    
    dispatch('tags', { tags: getTags() })
    
    // Hide autocomplete list
    // Focus on svelte tags input
    setArrelementsmatch([])
    document.getElementById(id).focus()
    
    if (maxTags && getTags().length == maxTags) {
        document.getElementById(id).readOnly = true
        placeholder = ''
    }
    
}
