const Lead = require('../models/Lead');
const LeadStatus = require('../models/LeadStatus');
const LeadActivityLog = require('../models/LeadActivityLog');

const convertLeadAfterSuccessfulPayment = async (user) => {
    try {
        if (!user) {
            return;
        }

        const lead = await Lead.findOne({
            $or: [
                { email: user.email },
                { mobileNumber: user.phone },
                { fullName: user.name }
            ]
        });

        if (!lead) {
            console.warn(`No matching lead found for user ${user.email}`);
            return;
        }

        const convertedStatus = await LeadStatus.findOne({
            name: 'Converted'
        });

        if (!convertedStatus) {
            console.warn('Converted status not found in LeadStatus');
            return;
        }

        if (lead.status && lead.status.toString() === convertedStatus._id.toString()) {
            console.log(`Lead ${lead.leadCode} already converted`);
            return;
        }

        const previousStatusId = lead.status;

        lead.status = convertedStatus._id;
        await lead.save();

        await LeadActivityLog.create({
            leadId: lead._id,
            employeeId: null,
            activityType: 'Lead Converted',
            description: `Lead automatically converted after successful service purchase by customer ${user.name}`,
            oldValue: previousStatusId,
            newValue: convertedStatus._id
        });

        console.log(`Lead ${lead.leadCode} converted successfully for user ${user.email}`);
    } catch (error) {
        console.error('Lead Conversion Error:', error);
    }
};

module.exports = {
    convertLeadAfterSuccessfulPayment
};
