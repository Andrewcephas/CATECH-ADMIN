import React, { useState, useEffect } from "react";
import { db } from "./Configuration";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Button, Table, Modal, Form } from "react-bootstrap";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true); // Modal visibility state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loginError, setLoginError] = useState("");

  // Dummy admin credentials
  const adminCredentials = {
    email: "samuelkeari45@gmail.com",
    password: "EngokoAa@",
  };

  // Admin login check
  const handleLogin = (e) => {
    e.preventDefault();
    if (
      email === adminCredentials.email &&
      password === adminCredentials.password
    ) {
      setIsAuthenticated(true);
      setShowLogin(false); // Close the login modal
      setLoginError(""); // Clear any previous errors
    } else {
      setLoginError("Invalid credentials. Please try again.");
    }
  };

  // Fetch orders from Firestore
  useEffect(() => {
    if (isAuthenticated) {
      const fetchOrders = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "orders"));
          const ordersList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(ordersList);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching orders:", error);
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [isAuthenticated]);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderDoc = doc(db, "orders", orderId);
      await updateDoc(orderDoc, {
        status: newStatus,
      });
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div>
      {/* Admin Login Modal */}
      <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Admin Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {loginError && <div className="text-danger mb-2">{loginError}</div>}

            <Button
              type="submit"
              variant="primary"
              className="w-100"
              style={{ backgroundColor: "#9B1B30" }}
            >
              Login
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-center">
            <a
              href="#!"
              style={{ color: "#9B1B30" }}
              onClick={() => alert("Redirect to password reset page!")}
            >
              Forgot password?
            </a>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Main Admin Panel */}
      {isAuthenticated && (
        <div>
          <h2>Orders</h2>
          {loading ? (
            <p>Loading orders...</p>
          ) : (
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>User Email</th>
                  <th>Full Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.userEmail}</td>
                    <td>{order.customerDetails.fullName}</td>
                    <td>{order.customerDetails.phone}</td>
                    <td>{order.customerDetails.address}</td>
                    <td>{order.totalAmount}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value)
                        }
                        className="form-select"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td>
                      <ul>
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.productName} (x{item.quantity}) -{" "}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => deleteOrder(order.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
