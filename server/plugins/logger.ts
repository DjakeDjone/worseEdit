export default defineNitroPlugin((nitro) => {

    nitro.hooks.hook("request", (event) => {
        // console.log("Request received:", event.node.req.method, event.node.req.url);
        // console.log("Request headers:", event.node.req.headers);
    });

    nitro.hooks.hook("error", (error) => {
        console.error("Error occurred:", error);
    });
});