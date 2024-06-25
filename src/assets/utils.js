const getOptionText = (id) => document.getElementById(id)?.options[document.getElementById(id)?.selectedIndex]?.text;

export {
    getOptionText
}