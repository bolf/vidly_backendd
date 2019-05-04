const mongoose = require("mongoose");
const debug = require("debug")("debugger");
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  isGold: Boolean,
  phone: String
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = {
  getCustomers: async () => {
    return await Customer.find()
      .select("name phone isGold")
      .sort("name");
  },
  insertCustomer: async customerParam => {
    const customer = new Customer(customerParam);
    return await customer.save();
  }
};
