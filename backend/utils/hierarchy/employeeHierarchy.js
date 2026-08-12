const Employee = require('../../models/Employee');

/**
 * ==========================================
 * LEAD HIERARCHY LOGIC (Employee Downline Fetcher)
 * ==========================================
 * Bhai, ye logic kaise kaam karta hai, samjho:
 * 
 * Hierarchy Example (Jo tumne bola tha):
 * - Admin (Sees everything, hierarchy logic applies only to non-admins)
 * - Sales Head (A & B)
 * - Sales Executive (C) reports to B
 * - TL reports to C
 * - Y reports to C
 * - M reports to Y
 * 
 * Output Rules:
 * 1. Admin ko skip kar diya jata hai (wo sab dekhta hai bina is array ke).
 * 2. Agar logged-in user 'B' hai: Ye function return karega array -> [B, C, TL, Y, M].
 *    Iska matlab B ko in sabke leads dikhenge.
 * 3. Agar user 'C' hai: Array aayega -> [C, TL, Y, M].
 * 4. Agar user 'Y' hai: Array aayega -> [Y, M].
 * 5. Agar user 'TL' ya 'M' ya 'A' (jiske koi niche nahi hai) hai: To sirf unka khud ka ID aayega -> [TL] ya [A].
 * 
 * Logic flow:
 * 1. Hum saare active employees database se utha lete hain ek hi baar mein (taki baar baar DB call na karna pade).
 * 2. Ek Map/Dictionary banate hain jisme dekhte hain kaun kisko report karta hai (ManagerID -> [Subordinate1, Subordinate2]).
 * 3. Ek recursive function chalate hain jo manager ke id se shuru hota hai aur niche branch tak saare IDs ikattha karta hai.
 * ==========================================
 */

const getDownlineIds = async (employeeId) => {
    // 1. Fetch all active employees ek saath (only needed fields to keep it fast)
    const allEmployees = await Employee.find({ isDeleted: false }, '_id reportingTo').lean();
    
    // 2. Build mapping of Manager ID -> Array of Subordinate IDs
    // Example: { "B_id": ["C_id"], "C_id": ["TL_id", "Y_id"], "Y_id": ["M_id"] }
    const reportMap = {};
    allEmployees.forEach(emp => {
        if (emp.reportingTo) {
            const mgrId = emp.reportingTo.toString();
            if (!reportMap[mgrId]) {
                reportMap[mgrId] = [];
            }
            reportMap[mgrId].push(emp._id.toString());
        }
    });

    // 3. Set to store all collected IDs (Set isliye liya taaki koi duplicate na ho)
    const downlines = new Set();

    // 4. Recursive gathering function
    const gatherSubordinates = (currentId) => {
        // Khud ka ID pehle add kar lo
        downlines.add(currentId);
        
        // Agar is currentId ke under koi log hain, toh unpar loop chalao
        const directReports = reportMap[currentId] || [];
        directReports.forEach(subordinateId => {
            if (!downlines.has(subordinateId)) { // Prevent infinite loops
                gatherSubordinates(subordinateId);
            }
        });
    };

    // 5. Start gathering from the current logged-in employee
    gatherSubordinates(employeeId.toString());

    // 6. Set ko Array mein convert karke return karo
    return Array.from(downlines);
};

module.exports = {
    getDownlineIds
};
