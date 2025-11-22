export function convertToHTML(text) {
  if (!text) return "";

  let html = text;

  // Convert ### headings
  html = html.replace(/^### (.*)$/gm, `<h3 class="text-xl font-bold mt-6 mb-2 text-gray-800">$1</h3>`);

  // Convert ## headings
  html = html.replace(/^## (.*)$/gm, `<h2 class="text-2xl font-bold mt-8 mb-3 text-gray-900">$1</h2>`);

  // Convert # headings
  html = html.replace(/^# (.*)$/gm, `<h1 class="text-3xl font-bold mt-10 mb-5 text-gray-900">$1</h1>`);

  // Convert bold **text**
  html = html.replace(/\*\*(.*?)\*\*/g, `<b class="font-semibold text-gray-900">$1</b>`);

  // Convert bullet points
  html = html.replace(/^- (.*)$/gm, `<li class="list-disc ml-5 text-gray-700">$1</li>`);

  // Convert numbered lists
  html = html.replace(/^\d+\. (.*)$/gm, `<li class="list-decimal ml-5 text-gray-700">$1</li>`);

  // Wrap list <li> inside <ul> automatically (simple)
  html = html.replace(/(<li.*<\/li>)/gm, `<ul class="my-2">$1</ul>`);

  // Convert line breaks to <p>
  html = html.replace(/(?:\r\n|\r|\n)/g, `<br/>`);

  return html;
}
