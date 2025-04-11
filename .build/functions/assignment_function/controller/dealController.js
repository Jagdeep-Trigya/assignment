const catalyst = require("zcatalyst-sdk-node");
const dealQuery = require("../sql/dealQuery");
exports.test = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: "I am live!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "not found" });
    }
};

exports.createNewdeal = async (req, res) => {
    const catalystApp = catalyst.initialize(req, {scope:"admin"});
    const dealTable = catalystApp.datastore().table("deals");
    
    try {
        const { dealName, email, phone} = req.body;
        if (!dealName || !email || !phone) {
        return res.status(400).json({ message: "All fields are required" });
        }
        const dealData = { dealName, email, phone };

        const newdeal = await dealTable.insertRow(dealData);
        return res.status(201).json({ success : true, message:"Deal created successfully", deal: newdeal });
    } catch (error) {
        return res.status(400).json({ success:false , message: error});
    }
}

exports.updatedeal = async (req, res) => {
    const catalystApp = catalyst.initialize(req, { scope: "admin" });
    const dealTable = catalystApp.datastore().table("deals");

    try {
        const { id } = req.params;
        const updates = req.body;

        const existingdeal = await dealTable.getRow(id);
        console.log("existingdeal", existingdeal);
        if (!existingdeal) {
            return res.status(404).json({ message: "deal not found" });
        }

        const updatedData = {
            ...existingdeal,
            ...updates, 
            ROWID: id  
        };

        const updateddeal = await dealTable.updateRow(updatedData);

        return res.status(200).json({ success: true, message:"deal Updated Successfully" ,deal: updateddeal });

    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ message: error.message });
    }
};

exports.getdealById = async (req, res) => {
    const catalystApp = catalyst.initialize(req, { scope: "admin" });
    const dealTable = catalystApp.datastore().table("deals");
    try {
        const { id } = req.params;
        const deal = await dealTable.getRow(id);
        if (!deal) {
            return res.status(404).json({ message: "deal not found" });
        }
        return res.status(200).json({ success: true, deal });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
exports.getAlldeals = async (req, res) => {
    const catalystApp = catalyst.initialize(req, { scope: "admin" });
    try {
        const query = dealQuery.getAllDeal;
        const users = await catalystApp.zcql().executeZCQLQuery(query);
        return res.status(200).json( users );
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.countdeals = async (req, res) => {
    const catalystApp = catalyst.initialize(req, { scope: "admin" });
    try {
        const query = dealQuery.dealCount;
        const deal = await catalystApp.zcql().executeZCQLQuery(query);
        const count = parseInt(deal[0].deals["COUNT(ROWID)"]) || 0;
        return res.status(200).json({ success: true, count });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

exports.deletedeal = async (req, res) => {
    const catalystApp = catalyst.initialize(req, { scope: "admin" });
    try {
        const { id } = req.params;
        // Assuming you have a User model to handle database operations
        const query = `${dealQuery.deleteDeal} ${id}`;
        const deal = await catalystApp.zcql().executeZCQLQuery(query);
        if (!deal) {
            return res.status(404).json({ message: "deal not found" });
        }
        return res.status(200).json({ success:true , message: "deal deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
