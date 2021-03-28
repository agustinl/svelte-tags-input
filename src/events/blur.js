
export const onBlur = (
    e,
    tag,
    allowBlur,
    matchesID,
    autoCompleteKey,
    getTags,
    addTag
) => {
    
    const tags = getTags()
    
    if (
        tags &&
        tag && tag.length &&
        !document.getElementById(matchesID) &&
        allowBlur
    ) {
        
        e.preventDefault()
        
        let newTag = tag
        
        if (autoCompleteKey && typeof newTag !== 'object')
            newTag = { [autoCompleteKey]: newTag }
        
        addTag(newTag)
    }
    
}
