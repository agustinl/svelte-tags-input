
export const getMatchElements = async (
    e,
    autoComplete,
    autoCompleteKey,
    onlyUnique,
    minChars,
    regExpEscape,
    getTags,
    setArrelementsmatch
) => {
    
    if (!autoComplete) return
    
    let autoCompleteValues = []
    
    if (Array.isArray(autoComplete))
        autoCompleteValues = autoComplete
    
    if (typeof autoComplete === 'function') {
        if (autoComplete.constructor.name === 'AsyncFunction')
            autoCompleteValues = await autoComplete()
        else
            autoCompleteValues = autoComplete()
    }
    
    const value = e.target.value
    
    // Escape
    if (value == '' || e.keyCode === 27 || value.length < minChars ) {
        setArrelementsmatch([])
        return
    }
    
    let matches = []
    
    if (typeof autoCompleteValues[0] === 'object' && autoCompleteValues !== null) {
        
        if (!autoCompleteKey)
            return console.error("'autoCompleteValue' is necessary if 'autoComplete' result is an array of objects")
        
        matches = autoCompleteValues
            .filter(e => e[autoCompleteKey].toLowerCase().includes(value.toLowerCase()))
            .map(matchTag => ({
                label: matchTag,
                search: matchTag[autoCompleteKey].replace(RegExp(regExpEscape(value.toLowerCase()), 'i'), "<strong>$&</strong>")
            }))
        
    } else {
        
        matches = autoCompleteValues
            .filter(e => e.toLowerCase().includes(value.toLowerCase()))
            .map(matchTag => ({
                label: matchTag,
                search: matchTag.replace(RegExp(regExpEscape(value.toLowerCase()), 'i'), "<strong>$&</strong>")
            }))
        
    }
    
    if (onlyUnique === true && !autoCompleteKey)
        matches = matches.filter(tag => !tags.includes(tag.label))
    
    setArrelementsmatch(matches)
    
}
