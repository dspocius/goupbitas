export default {
  async fetch(request, env, ctx) {
    if (new URL(request.url).pathname === "/") {
      const apiRes = await fetch("https://api-manager.upbit.com/api/v1/announcements?os=web&page=1&per_page=1&category=trade&nocache=true&timestamp="+new Date().getTime());
      const data = await apiRes.json();

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    } else if (new URL(request.url).pathname === "/ipas") {
      const apiRes = await fetch("https://api.ipify.org?format=json");
      const data = await apiRes.json();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};
