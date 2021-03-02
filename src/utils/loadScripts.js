export function loadScript(url, id) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        document.head.appendChild(script);
        script.src = url;
        script.id = id;
        script.type = "text/javascript";
        script.charset = "utf-8";
        script.setAttribute("async", "async");
        script.onreadystatechange = () => {
            if (!window.readyState || window.readyState === "loaded"
                || window.readyState === "complete") {
                script.onreadystatechange = null;
                script.onload = null;
                resolve();
            } else {
                reject();
            }
        };
        script.onload = script.onreadystatechange;
    });
}
export default {
    loadScript,
};