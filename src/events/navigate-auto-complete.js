
export const navigateAutoComplete = (
    e,
    autoComplete,
    autoCompleteIndex,
    autoCompleteLength,
    autoCompleteElement,
    matchesID,
    addTag
) => {
    
    if (!autoComplete) return
    
    e.preventDefault()
    
    // ArrowDown
    if (e.keyCode === 40) {
        // Last element on the list ? Go to the first
        if (autoCompleteIndex + 1 === autoCompleteLength) {
            document.getElementById(matchesID).querySelector("li:first-child").focus()
            return
        }
        document.getElementById(matchesID).querySelectorAll("li")[autoCompleteIndex + 1].focus()
    } else if (e.keyCode === 38) {
        // ArrowUp
        // First element on the list ? Go to the last
        if (autoCompleteIndex === 0) {
            document.getElementById(matchesID).querySelector("li:last-child").focus()
            return
        }
        document.getElementById(matchesID).querySelectorAll("li")[autoCompleteIndex - 1].focus()
    } else if (e.keyCode === 13) { 
        // Enter
        addTag(autoCompleteElement)
    } else if (e.keyCode === 27) {
        // Escape
        arrelementsmatch = []
        document.getElementById(id).focus()
    }
    
}
