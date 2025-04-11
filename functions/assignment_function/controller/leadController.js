const catalyst = require("zcatalyst-sdk-node");
const leadQuery = require("../sql/leadQuery");
exports.test = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: "I am live!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "not found" });
    }
};

exports.createNewLead = async(req, res)=>{
    try{
        const formdata = req.body;
        const leadData = await leadDataParser(formdata);
        const catalysApp = catalyst.initialize(req,{scope:"admin"});
        const respone =  await catalysApp.datastore().table("leads").insertRow(leadData) 
        const leadId = respone.ROWID;
        const leadsItemsData = formdata.leadsItems.map((item) => ({
            itemName: item?.itemName ?? "",
            sku: item?.sku ?? "",
            quantity: item?.quantity ?? 0,
            rate: item?.rate ?? 0,
            amount: item?.amount ?? 0,
            leadId: leadId
          }));

          await catalysApp.datastore().table("leadItems").insertRows(leadsItemsData);
        res.status(200).json({success:true, message:"Lead create sucessfully", respone});
    }catch(error){
        res.status(409).json({success:false, message:"Issue to craeate new lead", error});
    }
}

async function leadDataParser(formdata){
return {
    leadName:formdata?.leadName??"",
    email:formdata?.email??"",
    phone:formdata?.phone??"",
    source:formdata?.source??"",
    status:formdata?.status??"New",
}
}

exports.updateLead = async (req, res) => {
    const catalystApp = catalyst.initialize(req, { scope: "admin" });
    const leadTable = catalystApp.datastore().table("leads");

    try {
        const { id } = req.params;
        const updates = req.body;

        const existingLead = await leadTable.getRow(id);
        console.log("existingLead", existingLead);
        if (!existingLead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        const updatedData = {
            ...existingLead,
            ...updates, 
            ROWID: id  
        };

        const updatedLead = await leadTable.updateRow(updatedData);

        return res.status(200).json({ success: true, message:"Lead Updated Successfully" ,lead: updatedLead });

    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ message: error.message });
    }
};

exports.getLeadById = async (req, res) => {
    const catalystApp = catalyst.initialize(req, { scope: "admin" });
    const leadTable = catalystApp.datastore().table("leads");
    try {
        const { id } = req.params;
        const lead = await leadTable.getRow(id);
        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }
        return res.status(200).json({ success: true, lead });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
exports.getAllLeads = async (req, res) => {
    const catalystApp = catalyst.initialize(req, { scope: "admin" });
    try {
        const query = leadQuery.getAllLead;
        const users = await catalystApp.zcql().executeZCQLQuery(query);
        return res.status(200).json( users );
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.countLeads = async (req, res) => {
    const catalystApp = catalyst.initialize(req, { scope: "admin" });
    try {
        const query = leadQuery.leadCount;
        const lead = await catalystApp.zcql().executeZCQLQuery(query);
        const count = parseInt(lead[0].leads["COUNT(ROWID)"]) || 0;
        return res.status(200).json({ success: true, count });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

exports.deleteLead = async (req, res) => {
    const catalystApp = catalyst.initialize(req, { scope: "admin" });
    try {
        const { id } = req.params;
        // Assuming you have a User model to handle database operations
        const query = `${leadQuery.deleteLead} ${id}`;
        const lead = await catalystApp.zcql().executeZCQLQuery(query);
        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }
        return res.status(200).json({ success:true , message: "Lead deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
