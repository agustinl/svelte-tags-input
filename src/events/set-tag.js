
export const setTag = (
    e,
    autoComplete,
    matchesID,
    addKeys,
    removeKeys
) => {
        
    const currentTag = e.target.value
    
    if (addKeys) addKeys.forEach(key => {
        
        if (key === e.keyCode) {
            
            if (currentTag) e.preventDefault()
                            
            switch (e.keyCode) {
                case 9:
                    // TAB add first element on the autoComplete list
                    if (autoComplete && document.getElementById(matchesID))
                        addTag(document.getElementById(matchesID).querySelectorAll('li')[0].textContent)
                    else
                        addTag(currentTag)
                    break
                default:
                    addTag(currentTag)
                    break
            }
            
        }
        
    })
    
    if (removeKeys) removeKeys.forEach(key => {
        if (key === e.keyCode && tag === '') {
            
            tags.pop()
            setTags(tags)
            
            dispatch('tags', { tags })
            
            arrelementsmatch = []
            document.getElementById(id).readOnly = false
            placeholder = storePlaceholder
            document.getElementById(id).focus()
            
        }
    })
    
    if (e.keyCode === 40 && autoComplete && document.getElementById(matchesID)) {
        // ArrowDown : focus on first element of the autocomplete
        e.preventDefault()
        document.getElementById(matchesID).querySelector("li:first-child").focus();
    } else if (e.keyCode === 38 && autoComplete && document.getElementById(matchesID)) {
        // ArrowUp : focus on last element of the autocomplete
        e.preventDefault();
        document.getElementById(matchesID).querySelector("li:last-child").focus();
    }
    
}
