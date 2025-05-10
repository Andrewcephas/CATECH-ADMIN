import React, { useState, useEffect } from "react";
import { db } from "./Configuration";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  Button,
  Table,
  Modal,
  Form,
  Tab,
  Tabs,
  Image,
} from "react-bootstrap";
import Navbar from "./Navbar"; // Ensure this exists

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [getInTouchMessages, setGetInTouchMessages] = useState([]); // NEW State
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("orders");

  const adminCredentials = {
    email: "ngumbaucephas2@gmail.com",
    password: "catechAdmin",
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
        // Fetch orders
        const orderSnapshot = await getDocs(collection(db, "orders"));
        const orderData = orderSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderData);

        // Fetch users
        const userSnapshot = await getDocs(collection(db, "users"));
        const userData = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userData);

        // Fetch Messages
        const messageSnapshot = await getDocs(collection(db, "messages"));
        const messageData = messageSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messageData);

        // Fetch Get In Touch Messages (NEW)
        const getInTouchSnapshot = await getDocs(collection(db, "getintouch"));
        const getInTouchData = getInTouchSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGetInTouchMessages(getInTouchData);

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

  // Delete User Account (with confirmation)
  const deleteUser = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Delete Message (with confirmation)
  const deleteMessage = async (messageId) => {
    const confirmed = window.confirm("Are you sure you want to delete this message?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "messages", messageId));
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  // Delete Get In Touch Message (with confirmation)
  const deleteGetInTouch = async (msgId) => {
    const confirmed = window.confirm("Are you sure you want to delete this Get In Touch message?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "getintouch", msgId));
      setGetInTouchMessages((prev) => prev.filter((msg) => msg.id !== msgId));
    } catch (error) {
      console.error("Error deleting Get In Touch message:", error);
    }
  };

  return (
    <>
      <div className="p-4">
        {/* Admin Login Modal */}
        <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
          <Modal.Header closeButton style={{ backgroundColor: "#ffffff", color: "white" }}>
            <Modal.Title className="w-100 text-center">
              <img
                src="/CATECH LOGO.png"
                alt="Catech Logo"
                style={{ width: "80px", marginBottom: "10px" }}
              />
              <div style={{ color: "#000000", fontWeight: "bold", fontSize: "1.3rem" }}>Admin Login - Catech</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: "#f8f9fa" }}>
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

              <Form.Group className="mb-3 position-relative">
                <Form.Label>Password</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    variant="light"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      backgroundColor: "transparent",
                    }}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </Button>
                </div>
              </Form.Group>

              {loginError && <div className="text-danger mb-2">{loginError}</div>}

              <Button
                type="submit"
                className="w-100"
                style={{ backgroundColor: "#ff9900", borderColor: "#ff9900", color: "black" }}
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
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "10px",
                padding: "5px",
              }}
            >
              {/* Orders Tab */}
              <Tab eventKey="orders" title="Orders">
                {loading ? (
                  <p>Loading orders...</p>
                ) : (
                  <Table striped bordered hover responsive size="sm">
                    <thead style={{ backgroundColor: "#9B1B30", color: "white" }}>
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

              {/* Users Tab */}
              <Tab eventKey="users" title="Users">
                {loading ? (
                  <p>Loading users...</p>
                ) : (
                  <Table striped bordered hover responsive size="sm">
                    <thead style={{ backgroundColor: "#9B1B30", color: "white" }}>
                      <tr>
                        <th>Profile</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th> {/* NEW COLUMN */}
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
                          <td>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => deleteUser(user.id)}
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

              {/* Messages Tab */}
              <Tab eventKey="messages" title="Messages">
                {loading ? (
                  <p>Loading messages...</p>
                ) : (
                  <Table striped bordered hover responsive size="sm">
                    <thead style={{ backgroundColor: "#9B1B30", color: "white" }}>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Timestamp</th>
                        <th>Actions</th> {/* NEW COLUMN */}
                      </tr>
                    </thead>
                    <tbody>
                      {messages.length > 0 ? (
                        messages.map((msg) => (
                          <tr key={msg.id}>
                            <td>{msg.name}</td>
                            <td>{msg.email}</td>
                            <td>{msg.message}</td>
                            <td>{new Date(msg.timestamp.seconds * 1000).toLocaleString()}</td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => deleteMessage(msg.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">No messages found.</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>

                )}
              </Tab>

              {/* Get In Touch Tab (NEW) */}
              <Tab eventKey="getintouch" title="Get In Touch">
                {loading ? (
                  <p>Loading Get In Touch messages...</p>
                ) : (
                  <Table striped bordered hover responsive size="sm">
                    <thead style={{ backgroundColor: "#9B1B30", color: "white" }}>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Timestamp</th>
                        <th>Actions</th> {/* NEW COLUMN */}
                      </tr>
                    </thead>
                    <tbody>
                      {getInTouchMessages.length > 0 ? (
                        getInTouchMessages.map((msg) => (
                          <tr key={msg.id}>
                            <td>{msg.name}</td>
                            <td>{msg.phone}</td>
                            <td>{msg.county}</td>
                            <td>{msg.town}</td>
                            <td>{msg.interest}</td>
                            <td>
                              {msg.timestamp
                                ? new Date(msg.timestamp.seconds * 1000).toLocaleString()
                                : "N/A"}
                            </td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => deleteGetInTouch(msg.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7">No messages found.</td>
                        </tr>
                      )}

                    </tbody>
                  </Table>
                )}
              </Tab>


            </Tabs>
            <footer className="text-center mt-5 py-3 text-muted">
              © {new Date().getFullYear()} Catech Solutions & Graphics
            </footer>
          </>
        )}
      </div>
    </>
  );
};

export default AdminOrders;
