import re
import os

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
    
    # fix raw >
    s = re.sub(r'<li>></li>', '<li>&gt;</li>', s)
    s = re.sub(r'Blog\s*>\s*Articles\s*>', 'Blog &gt; Articles &gt;', s)
    
    # Handle template data attributes
    s = re.sub(r'data-bg-color="([^"]+)"', r'style={{backgroundColor: "\1"}}', s)
    s = re.sub(r'data-width="([^"]+)"', r'style={{width: "\1px"}}', s)
    s = re.sub(r'data-background="([^"]+)"', r'style={{backgroundImage: "url(\1)"}}', s)
    
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
    s = re.sub(r'href="assets/', 'href="/assets/', s)
    s = re.sub(r'data-background="assets/', 'data-background="/assets/', s)
    
    return s

pages_to_convert = [
    ('about.html', 'About'),
    ('service.html', 'Service'),
    ('blog.html', 'Blog'),
    ('blog-details.html', 'BlogDetails'),
    ('contact.html', 'Contact')
]

for filename, component_name in pages_to_convert:
    filepath = os.path.join('../consora', filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
        
    main_match = re.search(r'</header>\s*<main>(.*?)</main>\s*<footer>', html, re.DOTALL)
    if not main_match:
        # try matching from header end to footer start
        main_match = re.search(r'<!-- header area end -->(.*?)<!-- footer area start -->', html, re.DOTALL)
        
    if main_match:
        main_html = main_match.group(1)
        jsx_content = to_jsx(main_html)
        
        # Write to src/pages
        out_path = os.path.join('src/pages', f'{component_name}.jsx')
        with open(out_path, 'w', encoding='utf-8') as out_f:
            out_f.write(f'import React from "react";\n\nexport default function {component_name}() {{\n  return (\n    <main>\n')
            out_f.write(jsx_content)
            out_f.write('\n    </main>\n  );\n}\n')
            
        print(f"Generated {out_path}")
    else:
        print(f"Could not extract main content from {filename}")

print("Done converting pages!")
