// First Star Online Wiki: instant search over every page title (search-index.js), table filters and column sorting.
(function () {
  var box = document.getElementById("search"), out = document.getElementById("results"), sel = -1, hits = [];
  var root = window.WIKI_ROOT || "";
  function show() {
    var q = box.value.trim().toLowerCase();
    if (!q) { out.style.display = "none"; return; }
    var idx = window.WIKI_INDEX || [];
    hits = idx.filter(function (p) { return p[0].toLowerCase().indexOf(q) >= 0; })
      .sort(function (a, b) { return (a[0].toLowerCase().indexOf(q) - b[0].toLowerCase().indexOf(q)) || a[0].length - b[0].length; })
      .slice(0, 15);
    sel = hits.length ? 0 : -1;
    out.innerHTML = hits.map(function (p, i) {
      return '<a href="' + root + p[1] + '"' + (i === sel ? ' class="sel"' : "") + ">" + p[0].replace(/</g, "&lt;") + "<span>" + (p[2] || "") + "</span></a>";
    }).join("") || '<a>No pages match</a>';
    out.style.display = "block";
  }
  if (box) {
    box.addEventListener("input", show);
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        sel = Math.max(0, Math.min(hits.length - 1, sel + (e.key === "ArrowDown" ? 1 : -1)));
        Array.prototype.forEach.call(out.children, function (a, i) { a.className = i === sel ? "sel" : ""; });
        e.preventDefault();
      } else if (e.key === "Enter" && sel >= 0) { location.href = root + hits[sel][1]; }
      else if (e.key === "Escape") { out.style.display = "none"; }
    });
    document.addEventListener("click", function (e) { if (!out.contains(e.target) && e.target !== box) out.style.display = "none"; });
  }
  window.filterTable = function (input) {
    var table = input.nextElementSibling, q = input.value.toLowerCase();
    Array.prototype.forEach.call(table.rows, function (r, i) { if (i) r.style.display = r.textContent.toLowerCase().indexOf(q) >= 0 ? "" : "none"; });
  };
  Array.prototype.forEach.call(document.querySelectorAll("table.sortable"), function (t) {
    Array.prototype.forEach.call(t.rows[0].cells, function (th, col) {
      th.addEventListener("click", function () {
        var rows = Array.prototype.slice.call(t.rows, 1), asc = th.dataset.asc !== "1";
        rows.sort(function (a, b) {
          var x = a.cells[col].textContent.trim(), y = b.cells[col].textContent.trim(), nx = parseFloat(x), ny = parseFloat(y);
          var c = (!isNaN(nx) && !isNaN(ny)) ? nx - ny : x.localeCompare(y);
          return asc ? c : -c;
        });
        th.dataset.asc = asc ? "1" : "0";
        rows.forEach(function (r) { t.tBodies[0].appendChild(r); });
      });
    });
  });
})();
