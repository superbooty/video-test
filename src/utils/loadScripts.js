export function loadScript(url, id) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.id = id;
        script.type = "text/javascript";
        script.charset = "utf-8";
        script.setAttribute("async", "async");
        script.onreadystatechange = () => {
            console.log("SCRIPT LOADED....");
            if (!window.readyState || window.readyState === "loaded"
                || window.readyState === "complete") {
                script.onreadystatechange = null;
                script.onload = null;
                resolve("done");
            } else {
                reject();
            }
        };
        script.onload = script.onreadystatechange;
        document.head.appendChild(script);
    });
}
export default {
    loadScript,
};