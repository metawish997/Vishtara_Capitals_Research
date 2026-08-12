import re
import os

with open('../consora/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

def to_jsx(html_str):
    # basic html to jsx transformations
    s = re.sub(r'\bclass=', 'className=', html_str)
    s = re.sub(r'stroke-width=', 'strokeWidth=', s)
    s = re.sub(r'stroke-linecap=', 'strokeLinecap=', s)
    s = re.sub(r'stroke-linejoin=', 'strokeLinejoin=', s)
    s = re.sub(r'stroke-miterlimit=', 'strokeMiterlimit=', s)
    s = re.sub(r'fill-rule=', 'fillRule=', s)
    s = re.sub(r'clip-rule=', 'clipRule=', s)
    s = re.sub(r'\bfor=', 'htmlFor=', s)
    s = re.sub(r'style="mask-type:alpha"', 'style={{maskType: "alpha"}}', s)
    
    # Handle template data attributes
    s = re.sub(r'data-background="assets/', 'data-background="/assets/', s)
    s = re.sub(r'data-bg-color="([^"]+)"', r'style={{backgroundColor: "\1"}}', s)
    s = re.sub(r'data-width="([^"]+)"', r'style={{width: "\1px"}}', s)
    s = re.sub(r'data-background="([^"]+)"', r'style={{backgroundImage: "url(\1)"}}', s)
    
    # fix raw >
    s = re.sub(r'<li>></li>', '<li>&gt;</li>', s)
    s = re.sub(r'Blog\s*>\s*Articles\s*>', 'Blog &gt; Articles &gt;', s)
    
    # remove comments
    s = re.sub(r'<!--.*?-->', '', s, flags=re.DOTALL)

    # close img
    s = re.sub(r'<img([^>]*?)(?<!/)>', r'<img\1 />', s)
    # close input
    s = re.sub(r'<input([^>]*?)(?<!/)>', r'<input\1 />', s)
    # close br
    s = re.sub(r'<br([^>]*?)(?<!/)>', r'<br\1 />', s)
    
    # paths to assets
    s = re.sub(r'src="assets/', 'src="/assets/', s)
    
    return s

# Extract Header: line 225 to 445 (approx)
# Or use regex
header_match = re.search(r'<!-- header area start -->(.*?)<!-- header area end -->', html, re.DOTALL)
header_html = header_match.group(1) if header_match else ""

footer_match = re.search(r'<!-- footer area start -->(.*?)<!-- footer area end -->', html, re.DOTALL)
footer_html = footer_match.group(1) if footer_match else ""

loader_match = re.search(r'<!-- Loader Start -->(.*?)<!-- Loader End -->', html, re.DOTALL)
loader_html = loader_match.group(1) if loader_match else ""

back_match = re.search(r'<!-- back to top start -->(.*?)<!-- back to top end -->', html, re.DOTALL)
back_html = back_match.group(1) if back_match else ""

offcanvas_match = re.search(r'<!-- tp-offcanvus-area-start -->(.*?)<!-- tp-offcanvus-area-end -->', html, re.DOTALL)
offcanvas_html = offcanvas_match.group(1) if offcanvas_match else ""

search_match = re.search(r'<!-- tp search area start -->(.*?)<!-- tp search area end -->', html, re.DOTALL)
search_html = search_match.group(1) if search_match else ""

main_match = re.search(r'</header>\s*<main>(.*?)</main>\s*<footer>', html, re.DOTALL)
if not main_match:
    # try matching from header end to footer start
    main_match = re.search(r'<!-- header area end -->(.*?)<!-- footer area start -->', html, re.DOTALL)
main_html = main_match.group(1) if main_match else ""

# Write Header
with open('src/components/Header.jsx', 'w') as f:
    f.write('import React from "react";\nimport { Link } from "react-router-dom";\n\nexport default function Header() {\n  return (\n    <header className="tp-header-height">\n')
    f.write(to_jsx(header_html))
    f.write('\n    </header>\n  );\n}\n')

# Write Footer
with open('src/components/Footer.jsx', 'w') as f:
    f.write('import React from "react";\nimport { Link } from "react-router-dom";\n\nexport default function Footer() {\n  return (\n    <footer>\n')
    f.write(to_jsx(footer_html))
    f.write('\n    </footer>\n  );\n}\n')

# Write Home Page
with open('src/pages/Home.jsx', 'w') as f:
    f.write('import React from "react";\n\nexport default function Home() {\n  return (\n    <main>\n')
    f.write(to_jsx(main_html))
    f.write('\n    </main>\n  );\n}\n')

# Write Layout
with open('src/components/Layout.jsx', 'w') as f:
    layout = f'''import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import {{ Outlet }} from "react-router-dom";

export default function Layout() {{
  return (
    <>
      {to_jsx(loader_html)}
      {to_jsx(back_html)}
      {to_jsx(offcanvas_html)}
      <div className="body-overlay"></div>
      {to_jsx(search_html)}
      
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}}
'''
    f.write(layout)

# App.jsx
with open('src/App.jsx', 'w') as f:
    app = '''import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
'''
    f.write(app)

# main.jsx
with open('src/main.jsx', 'w') as f:
    main = '''import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
'''
    f.write(main)

print("Files generated!")
