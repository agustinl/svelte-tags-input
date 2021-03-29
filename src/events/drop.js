
export const onDrop = (
    e,
    allowDrop,
    autoCompleteKey,
    splitTags,
    addTag
) => {
    
    e.preventDefault()
    
    if (!allowDrop) return
    
    const data = e.dataTransfer.getData('Text')
    let values = splitTags(data)
    
    if (
        autoCompleteKey &&
        values.length &&
        typeof values[0] !== 'object')
        values = values.map(it => ({ [autoCompleteKey]: it }))
    
    addTag(values)
    
    e.dataTransfer.clearData()
    
    return true
    
}
