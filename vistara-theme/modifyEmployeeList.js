const fs = require('fs');
const path = 'd:\\demo_uis\\Vistara_Capital_research\\vistara-theme\\src\\pages\\admin\\employees\\EmployeeList.jsx';
let content = fs.readFileSync(path, 'utf8');

// Add roleService import
if(!content.includes('roleService')) {
    content = content.replace('import designationService from \'../../../services/designationService\';', 'import designationService from \'../../../services/designationService\';\nimport roleService from \'../../../services/roleService\';');
}

// Add roles state
if(!content.includes('const [roles, setRoles] = useState([]);')) {
    content = content.replace('const [designations, setDesignations] = useState([]);', 'const [designations, setDesignations] = useState([]);\n    const [roles, setRoles] = useState([]);');
}

// Add fetch roles
if(!content.includes('roleService.getRoles()')) {
    content = content.replace('const desRes = await designationService.getDesignations();', const rolesRes = await roleService.getRoles();\n            if (rolesRes && rolesRes.data) {\n                setRoles(rolesRes.data);\n            }\n            const desRes = await designationService.getDesignations(););
}

// Remove Tabs Switcher
content = content.replace(/\{\/\* Tabs Switcher \*\/\}(.|\n)*?<\/div>\s*\{activeTab === 'table' \? \(/g, '');
content = content.replace(/\) : \(\s*\/\* Hierarchy Card \*\/[\s\S]*?\}\s*\)/, '');

// Remove Reporting Manager TH
content = content.replace(/<th[^>]*>Reporting Manager<\/th>/g, '');

// Remove Reporting Manager TD
content = content.replace(/\{\/\* Reporting Manager \*\/\}\s*<td className= px-4 py-3 align-middle>[\s\S]*?<\/td>/, '');

// Replace Designation to Role in form
content = content.replace(/<label[^>]*>Designation \*\s*<\/label>[\s\S]*?<\/select>/, <label className=\block text-[9px] font-black text-[#64748b] uppercase tracking-widest mb-2 ml-1\>Role *</label>\n                                <select\n                                    value={form.roleId}\n                                    onChange={(e) => setForm({ ...form, roleId: e.target.value })}\n                                    className=\w-full bg-[#f8fafc] border border-[#e2e8f0] px-5 py-3 rounded-2xl outline-none focus:border-[#011d52] text-[#1e293b] transition-all font-bold text-xs\\n                                    required\n                                >\n                                    <option value=\\>Select Role...</option>\n                                    {roles.map(r => (\n                                        <option key={r._id} value={r._id}>{r.name}</option>\n                                    ))}\n                                </select>);

// Remove Reporting Manager from form
content = content.replace(/\{selectedDesig && selectedDesig\.name\?\.trim\(\)\.toLowerCase\(\) !== 'admin' && \([\s\S]*?\}\)\}/, '');

// Form State update
content = content.replace(/designationId: emp\.designationId\?\._id \|\| '',/g, 'roleId: emp.roleId?._id || \'\',');
content = content.replace(/designationId: '',/g, 'roleId: \'\',');

// form.designationId -> form.roleId in validation
content = content.replace(/!form\.designationId/g, '!form.roleId');
content = content.replace(/formData\.append\('designationId', form\.designationId\);/g, 'formData.append(\'roleId\', form.roleId);');

// Remove reportingTo in form formData
content = content.replace(/formData\.append\('reportingTo', form\.reportingTo \|\| ''\);.*?\\n/g, '');


fs.writeFileSync(path, content);
console.log('Done!');
