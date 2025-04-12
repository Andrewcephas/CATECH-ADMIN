import React, { useState, useEffect } from "react";
import { db } from "./Configuration";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Button, Table, Modal, Form, Tab, Tabs, Image } from "react-bootstrap";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("orders");

  const adminCredentials = {
    email: "samuelkeari45@gmail.com",
    password: "EngokoAa@",
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      email === adminCredentials.email &&
      password === adminCredentials.password
    ) {
      setIsAuthenticated(true);
      setShowLogin(false);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Please try again.");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Orders
        const orderSnapshot = await getDocs(collection(db, "orders"));
        const orderData = orderSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderData);

        // Users
        const userSnapshot = await getDocs(collection(db, "users"));
        const userData = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userData);

        // Messages (career)
        const careerSnapshot = await getDocs(collection(db, "career"));
        const careerData = careerSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(careerData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [isAuthenticated]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderDoc = doc(db, "orders", orderId);
      await updateDoc(orderDoc, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div className="p-4">
      {/* Admin Login Modal */}
      <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Admin Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {loginError && <div className="text-danger">{loginError}</div>}

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
      </Modal>

      {/* Authenticated Admin Panel */}
      {isAuthenticated && (
        <>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
            fill
          >
            <Tab eventKey="orders" title="Orders">
              {loading ? (
                <p>Loading orders...</p>
              ) : (
                <Table striped bordered hover responsive size="sm">
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
                        <td>{order.customerDetails?.fullName}</td>
                        <td>{order.customerDetails?.phone}</td>
                        <td>{order.customerDetails?.address}</td>
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
                          <ul className="m-0 p-0">
                            {order.items.map((item, index) => (
                              <li key={index}>
                                {item.productName} (x{item.quantity})
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
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
            </Tab>

            <Tab eventKey="users" title="Users">
              {loading ? (
                <p>Loading users...</p>
              ) : (
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>Photo</th>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <Image
                            src={user.photoURL}
                            alt="Profile"
                            roundedCircle
                            width="40"
                            height="40"
                          />
                        </td>
                        <td>{user.displayName}</td>
                        <td>{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>

            <Tab eventKey="messages" title="Messages">
              {loading ? (
                <p>Loading messages...</p>
              ) : (
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Town</th>
                      <th>Interested to Be</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg) => (
                      <tr key={msg.id}>
                        <td>{msg.name}</td>
                        <td>{msg.phone}</td>
                        <td>{msg.town}</td>
                        <td>{msg.interest}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default AdminOrders;
