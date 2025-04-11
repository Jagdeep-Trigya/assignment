module.exports = {
    getLeadById: "Select * from leads where ROWID = ",
    getAllLead:`Select * from leads where status != 'Converted to Deal'`,
    deleteLead: "Delete from leads where ROWID = ",
    leadCount:"Select count(ROWID) as total from leads",
}