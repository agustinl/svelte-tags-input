
export const onPaste = (
    e,
    allowPaste,
    autoCompleteKey,
    splitTags,
    addTag,
    getClipboardData
) => {
    
    if (!allowPaste) return
    
    e.preventDefault()
    
    const data = getClipboardData(e)
    let values = splitTags(data)
    
    if (
        autoCompleteKey &&
        values.length &&
        typeof values[0] !== 'object')
        values = values.map(it => ({ [autoCompleteKey]: it }))
    
    addTag(values)
    
}
