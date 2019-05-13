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

  getCustomerById: async id => {
    return await Customer.findById(id).select("name phone isGold");
  },

  insertCustomer: async customerParam => {
    const customer = new Customer(customerParam);
    return await customer.save();
  },

  updateCustomer: async customerParam => {
    const customer = await Customer.findById(customerParam._id);
    if (customer) {
      customer.name = customerParam.name;
      customer.phone = customerParam.phone;
      customer.isGold = customerParam.isGold;
      return await customer.save();
    } else {
      reject();
    }
  },

  deleteCustomer: async id => {
    return await Customer.deleteOne({ _id: id });
  },
  Customer
};
