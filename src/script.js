(async (c, l, o, u, d, e, z) => {
    const div = l.createElement('div')
    div.id = "cloudez-chat";
    const body = l.querySelector("body")
    body.insertBefore(div, body?.firstChild)
    const getScripts = async () => {
        const data = await fetch(u)
        const response = await data.text()
        const html = l.createElement('html')
        html.innerHTML = response
        return html.querySelectorAll(o)
    }
    (await getScripts()).forEach(script => {
        const newScript = l.createElement(o)
        if (script.src) {
            newScript.src = `${u}${script.src.split(c.location.href)[1]}`
            console.log(script.src.split(c.location.href))
        }
        if (script.text) {
            newScript.text = script.text
        }
        body.appendChild(newScript)
    })
})(window, document, "script", "http://localhost:5501/")