export function convertToHTML(text) {
  if (!text) return "";

  // Split into lines for more robust processing
  const lines = text.split(/\r?\n/);
  let html = "";
  let inList = false;
  let listType = null; // 'ul' or 'ol'

  const closeList = () => {
    if (inList) {
      html += `</${listType}>`;
      inList = false;
      listType = null;
    }
  };

  for (let line of lines) {
    line = line.trim();

    // Headers
    if (line.startsWith("### ")) {
      closeList();
      html += `<h3 class="text-xl font-bold mt-8 mb-4 text-foreground flex items-center gap-2">
        <span class="w-1.5 h-6 bg-primary rounded-full"></span>
        ${line.slice(4)}
      </h3>`;
      continue;
    }
    if (line.startsWith("## ")) {
      closeList();
      html += `<h2 class="text-2xl font-black mt-10 mb-6 text-foreground border-b border-border pb-2">
        ${line.slice(3)}
      </h2>`;
      continue;
    }
    if (line.startsWith("# ")) {
      closeList();
      html += `<h1 class="text-3xl font-black mt-12 mb-8 text-primary">
        ${line.slice(2)}
      </h1>`;
      continue;
    }

    // Unordered Lists
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!inList || listType !== "ul") {
        closeList();
        html += `<ul class="space-y-3 my-4">`;
        inList = true;
        listType = "ul";
      }
      const content = line.slice(2).replace(/\*\*(.*?)\*\*/g, `<b class="font-bold text-foreground">$1</b>`);
      html += `<li class="flex items-start gap-3 text-muted-foreground leading-relaxed">
        <span class="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
        <span>${content}</span>
      </li>`;
      continue;
    }

    // Numbered Lists
    const numMatch = line.match(/^(\d+)\. (.*)$/);
    if (numMatch) {
      if (!inList || listType !== "ol") {
        closeList();
        html += `<ol class="space-y-3 my-4 list-none counter-reset-item">`;
        inList = true;
        listType = "ol";
      }
      const content = numMatch[2].replace(/\*\*(.*?)\*\*/g, `<b class="font-bold text-foreground">$1</b>`);
      html += `<li class="flex items-start gap-3 text-muted-foreground leading-relaxed">
        <span class="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-primary text-[10px] font-black shrink-0 mt-0.5">
          ${numMatch[1]}
        </span>
        <span>${content}</span>
      </li>`;
      continue;
    }

    // Empty lines
    if (line === "") {
      closeList();
      continue;
    }

    // Regular paragraphs
    closeList();
    const content = line.replace(/\*\*(.*?)\*\*/g, `<b class="font-bold text-foreground">$1</b>`);
    html += `<p class="text-muted-foreground leading-relaxed mb-4">${content}</p>`;
  }

  closeList();
  return html;
}
