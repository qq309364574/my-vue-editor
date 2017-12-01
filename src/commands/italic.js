import commands from './index'

export default function (rh, arg) {
  let s = rh.getSelection()
  if (!s.isCollapsed) {
    document.execCommand('italic', false, arg)
    return
  } else {
    let node = s.focusNode
    let row = rh.getRow(node)

    // the outermost italic tag
    let italic = rh.findSpecialAncestor(node, 'i', false, row) || rh.findSpecialAncestorByStyle(node, {
        'fontStyle': 'italic'
      }, false, row)
    let existStyle = rh.findExistTagTillBorder(node, ['STRIKE', 'U', 'B', 'STRONG'], row)
    // is in a italic
    if (!italic) {
      existStyle.push('I')
    }
    if (existStyle.length) {
      let newDOM = rh.createNestDOMThroughList(existStyle)
      let v = rh.newRow()
      v.appendChild(newDOM.dom)
      commands.insertHTML(rh, v.innerHTML)
      let deepestNode = document.getElementById(newDOM.deepestId)
      s.collapse(deepestNode, 1)
      deepestNode.removeAttribute('id')
    } else {
      let newText = document.createElement('font')
      newText.innerHTML = '&#8203;'
      rh.insertAfter(newText, italic)
      s.collapse(newText, 1)
    }
  }
}

