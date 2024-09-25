const BillingInfo = require("../../model/BillingInfo");

const createBillingInfo = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const billingInfo = new BillingInfo({
      ...req.body,
      userId: userId,
    });
    const savedBillingInfo = await billingInfo.save();
    res.status(201).json(savedBillingInfo);
  } catch (err) {
    res.status(500).json({ message: "Error saving billing info" });
  }
};

const getBillingInfoByUser = async (req, res) => {
  const { id: userId } = req.user;
  try {
    const billingInfo = await BillingInfo.findOne({
      userId: userId,
    }).populate("userId", "email phoneNumber");
    if (!billingInfo) {
      return res.status(404).json({ message: "Billing info not found" });
    }
    res.status(200).json(billingInfo);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving billing info" });
  }
};

const updateBillingInfo = async (req, res) => {
  const { id: userId } = req.user;
  try {
    const updatedBillingInfo = await BillingInfo.findOneAndUpdate(
      { userId: userId },
      req.body,
      { new: true }
    );
    if (!updatedBillingInfo) {
      return res.status(404).json({ message: "Billing info not found" });
    }
    res.status(200).json(updatedBillingInfo);
  } catch (err) {
    res.status(500).json({ message: "Error updating billing info" });
  }
};

const deleteBillingInfo = async (req, res) => {
  const { id: userId } = req.user;
  try {
    const deletedBillingInfo = await BillingInfo.findOneAndDelete({
      userId: userId,
    });
    if (!deletedBillingInfo) {
      return res.status(404).json({ message: "Billing info not found" });
    }
    res.status(200).json({ message: "Billing info deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting billing info" });
  }
};

module.exports = {
  createBillingInfo,
  getBillingInfoByUser,
  updateBillingInfo,
  deleteBillingInfo,
};
