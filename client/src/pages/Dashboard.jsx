import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Calendar, IndianRupee, PieChart, TrendingUp, Filter, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";

const Dashboard = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [totalSpending, setTotalSpending] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newBill, setNewBill] = useState({ purpose: "", amount: "", date: "" });

  const fetchData = async () => {
    try {
      const { data } = await api.get("/bill/dashboard");
      setBills(data.bills || []);
      setTotalSpending(data.totalSpending || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddBill = async (e) => {
    e.preventDefault();
    try {
      await api.post("/bill/add", newBill);
      setNewBill({ purpose: "", amount: "", date: "" });
      setIsAdding(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBill = async (id) => {
    try {
      await api.post(`/bill/delete/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-500 text-lg">Good to see you, {user?.fullname?.split(" ")[0]}!</p>
        </div>
        <Button className="h-12 px-6 flex items-center gap-2" onClick={() => setIsAdding(true)}>
          <Plus className="w-5 h-5" /> Add New Bill
        </Button>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-gradient-to-br from-brand-primary/20 to-transparent border-brand-primary/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-brand-primary/20 text-brand-primary">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Spending</p>
              <h2 className="text-3xl font-bold text-slate-800">₹{totalSpending.toLocaleString()}</h2>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Active Bills</p>
              <h2 className="text-3xl font-bold text-slate-800">{bills.length}</h2>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-500">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Budget Status</p>
              <h2 className="text-3xl font-bold text-slate-800">Healthy</h2>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-800">Bill History</h3>
        <div className="flex gap-2 text-slate-500">
           <Button variant="ghost" className="h-9 px-3 gap-2 text-xs">
             <Filter className="w-4 h-4" /> Filter
           </Button>
           <Button variant="ghost" className="h-9 px-3 gap-2 text-xs">
             <Search className="w-4 h-4" /> Search
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {bills.map((bill, index) => (
            <motion.div
              key={bill._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="flex items-center justify-between group py-4 px-6" hover={true}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-brand-primary/20 group-hover:text-brand-primary transition-colors">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 group-hover:text-brand-primary transition-colors">{bill.purpose}</h4>
                    <p className="text-sm text-slate-500">{new Date(bill.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xl font-bold text-slate-800">₹{bill.amount.toLocaleString()}</span>
                  <Button
                    variant="danger"
                    className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteBill(bill._id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
          {bills.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-500 italic">No bills found. Add your first bill to get started!</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Bill Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg relative"
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Bill</h2>
                <form onSubmit={handleAddBill} className="space-y-4">
                  <Input
                    label="Purpose"
                    placeholder="Rent, Electricity, etc."
                    value={newBill.purpose}
                    onChange={(e) => setNewBill({ ...newBill, purpose: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Amount (₹)"
                      type="number"
                      placeholder="0.00"
                      value={newBill.amount}
                      onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
                      required
                    />
                    <Input
                      label="Date"
                      type="date"
                      value={newBill.date}
                      onChange={(e) => setNewBill({ ...newBill, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex gap-4 mt-8">
                    <Button variant="secondary" className="flex-1" onClick={() => setIsAdding(false)}>
                      Cancel
                    </Button>
                    <Button className="flex-1" type="submit">
                      Add Bill
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
