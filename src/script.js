(async (c, l, o, u, d, e, z) => {
    const div = l.createElement('div')
    div.id = "cloudez-chat";
    const body = l.querySelector("body")
    const head = l.querySelector("head")
    body.insertBefore(div, body?.firstChild)
    const getScripts = async () => {
        const data = await fetch(d)
        const response = await data.text()
        const html = l.createElement('html')
        html.innerHTML = response
        return html
    }
    const html = await getScripts()
    const scripts = html.querySelectorAll(o)
    const links = html.querySelectorAll(u)
    scripts.forEach(script => {
        const newScript = l.createElement(o)
        if (script.src) {
            newScript.src = `${d}${script.src.split(c.location.origin)[1]}`
        }
        if (script.text) {
            newScript.text = script.text
        }
        body.appendChild(newScript)
    })
    links.forEach(link => {
        const newLink = l.createElement(u)
        newLink.href = `${d}${link.href.split(c.location.origin)[1]}`
        newLink.rel = "stylesheet"
        head.appendChild(newLink)
    })
    const script = document.querySelector("#chat-cloudez")
    script.remove()
})(window, document, "script", "link", "https://chat.cloudez.io")