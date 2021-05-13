(async (c, l, o, u, d, e, z) => {
  const username = l.currentScript.getAttribute("username");
  const email = l.currentScript.getAttribute("email");
  const uuid = l.currentScript.getAttribute("uuid");
  const company = l.currentScript.getAttribute("company");
  const is_partner = l.currentScript.getAttribute("is_partner");
  const is_external = l.currentScript.getAttribute("is_external");
  const div = l.createElement("div");
  div.id = "cloudez-chat";
  const body = l.querySelector("body");
  const head = l.querySelector("head");
  body.insertBefore(div, body?.firstChild);
  const getScripts = async () => {
    const data = await fetch(d);
    const response = await data.text();
    const html = l.createElement("html");
    html.innerHTML = response;
    return html;
  };
  const html = await getScripts();
  const scripts = html.querySelectorAll(o);
  const links = html.querySelectorAll(u);
  scripts.forEach(script => {
    if (script.id !== "chat-cloudez") {
      const newScript = l.createElement(o);
      if (script.src) {
        newScript.src = `${d}${script.src.split(c.location.origin)[1]}`;
      }
      if (script.text) {
        newScript.text = script.text;
        newScript.id = "user_data";
        if (username) newScript.setAttribute("username", username);
        if (email) newScript.setAttribute("email", email);
        if (uuid) newScript.setAttribute("uuid", uuid);
        if (company) newScript.setAttribute("company", company);
        if (is_partner) newScript.setAttribute("is_partner", is_partner);
        if (is_external) newScript.setAttribute("is_external", is_external);
      }
      body.appendChild(newScript);
    }
  });
  links.forEach(link => {
    const newLink = l.createElement(u);
    newLink.href = `${d}${link.href.split(c.location.origin)[1]}`;
    newLink.rel = "stylesheet";
    head.appendChild(newLink);
  });
  const script = l.querySelector("#chat-cloudez");
  script.remove();
})(window, document, "script", "link", "https://chat.cloudez.io");
