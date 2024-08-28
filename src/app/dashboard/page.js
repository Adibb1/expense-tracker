"use client";
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  where,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Doughnut } from "react-chartjs-2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../chartConfig";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "" });
  const [userId, setUserId] = useState(null);
  const [budget, setBudget] = useState("");
  const [budgetAmount, setBudgetAmount] = useState(0); // State to store budget
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (userId) {
      // Fetch the user's budget from Firestore
      const fetchBudget = async () => {
        const userDoc = doc(db, "users", userId);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          setBudgetAmount(userSnap.data().budget || 0);
          setBudget(userSnap.data().budget || "");
        }
      };
      fetchBudget();

      const q = query(collection(db, "items"), where("userId", "==", userId));
      const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        let itemsArr = [];
        QuerySnapshot.forEach((doc) => {
          itemsArr.push({ ...doc.data(), id: doc.id });
        });
        setItems(itemsArr);

        const calculatedTotal = () => {
          const totalPrice = itemsArr.reduce(
            (sum, item) => sum + parseFloat(item.price),
            0
          );
          setTotal(totalPrice);
        };
        calculatedTotal();
      });
      return () => unsubscribe();
    }
  }, [userId]);

  const addItem = async (e) => {
    e.preventDefault();
    if (userId && newItem.name && newItem.price && newItem.category) {
      try {
        await addDoc(collection(db, "items"), {
          ...newItem,
          price: parseFloat(newItem.price),
          userId,
        });
        setNewItem({ name: "", price: "", category: "" });
        toast.success("Expense added!");
      } catch (error) {
        toast.error("Error adding expense");
      }
    } else {
      toast.error("Please log in or complete all fields");
    }
  };

  const setBudgetHandler = async () => {
    if (userId && budget) {
      try {
        // Check if the user document exists
        const userDoc = doc(db, "users", userId);
        await setDoc(
          userDoc,
          {
            budget: parseFloat(budget),
          },
          { merge: true }
        );

        setBudgetAmount(parseFloat(budget)); // Update local budgetAmount state
        toast.success("Budget set!");
      } catch (error) {
        toast.error("Error setting budget");
      }
    } else {
      toast.error("Please log in and enter a valid budget");
    }
  };

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "items", id));
      toast.info("Expense deleted!");
    } catch (error) {
      toast.error("Error deleting expense");
    }
  };

  const data = {
    labels: [...new Set(items.map((item) => item.category)), "Others"],
    datasets: [
      {
        data: [
          ...items.map((item) => item.price),
          items
            .filter((item) => item.category === "Others")
            .reduce((sum, item) => sum + parseFloat(item.price), 0),
        ],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6F61",
        ],
      },
    ],
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  // Conditional styling
  const totalStyle = {
    backgroundColor:
      budgetAmount > 0 && total > budgetAmount ? "#FF6F61" : "#FFFFFF",
    color: "#000000",
  };

  // Default messages
  const renderNoDataMessage = (section) => {
    switch (section) {
      case "total":
        return (
          <p className="text-gray-500 text-lg">No expenses recorded yet.</p>
        );
      case "chart":
        return (
          <p className="text-gray-500 text-lg">No data available for chart.</p>
        );
      case "expenses":
        return <p className="text-gray-500 text-lg">No expenses to display.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-100 via-blue-100 to-purple-100 text-black">
      <div className="w-full p-6 flex flex-col md:flex-row md:justify-between gap-5">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Dashboard</h1>
          <button
            className="mb-4 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold text-lg"
            onClick={handleLogout}
          >
            Logout
          </button>
          <form
            className="bg-white p-6 rounded-lg shadow-lg text-black mb-6"
            onSubmit={addItem}
          >
            <input
              className="mb-4 p-3 w-full rounded-lg border border-gray-300"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              type="text"
              placeholder="Expense name"
            />
            <input
              className="mb-4 p-3 w-full rounded-lg border border-gray-300"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              type="number"
              placeholder="Price"
            />
            <select
              className="mb-4 p-3 w-full rounded-lg border border-gray-300 text-black"
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Food">Food</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
              <option value="Transportation">Transportation</option>
              <option value="Others">Others</option>
            </select>
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg"
              type="submit"
            >
              Add Expense
            </button>
          </form>

          <div className="bg-white p-6 rounded-lg shadow-lg mb-8 text-black">
            <h2 className="text-xl font-semibold mb-4">Expenses</h2>
            {items.length > 0 ? (
              <ul>
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center bg-gray-100 p-3 rounded-lg mb-3"
                  >
                    <div>
                      <p className="text-lg">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-lg">${item.price}</span>
                      <button
                        className="ml-4 bg-red-500 text-white py-1 px-3 rounded-lg"
                        onClick={() => deleteItem(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              renderNoDataMessage("expenses")
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-lg mt-auto flex flex-col items-start">
            <label className="text-lg font-semibold mb-2">Set Budget</label>
            <input
              className="mb-4 p-3 w-full rounded-lg border border-gray-300"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              type="number"
              placeholder="Enter budget"
            />
            <button
              className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold text-lg"
              onClick={setBudgetHandler}
            >
              Set Budget
            </button>
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8 flex-grow">
            {items.length > 0 ? (
              <Doughnut data={data} />
            ) : (
              renderNoDataMessage("chart")
            )}
          </div>

          <div
            style={totalStyle}
            className="p-4 rounded-lg shadow-lg w-full flex flex-col items-start text-gray-800 font-semibold text-lg"
          >
            {items.length > 0 ? (
              <>
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
                {budgetAmount > 0 && (
                  <>
                    <span className="mt-2">
                      Budget: ${budgetAmount.toFixed(2)}
                    </span>
                    <span>
                      Remaining: ${Math.max(budgetAmount - total, 0).toFixed(2)}
                    </span>
                  </>
                )}
              </>
            ) : (
              renderNoDataMessage("total")
            )}
          </div>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
