module.exports = {
    getDealById: "Select * from deals where ROWID = ",
    getAllDeal:"Select * from deals",
    deleteDeal: "Delete from deals where ROWID = ",
    dealCount:"Select count(ROWID) as total from deals",
}