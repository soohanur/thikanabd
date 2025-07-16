import React from "react";
import { Route, Routes ,useLocation } from "react-router-dom";
import Index from "./pages/index";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './assect/scss/style.scss'
import './assect/css/materialdesignicons.min.css'
import ScrollTop from "./components/scrollTop";
import GridSidebar from "./pages/listing/grid-sidebar";
import PropertyDetails from "./pages/listing/property-detail";
import ContactUs from "./pages/contactus";
import AuthLogin from "./pages/auth/auth-login";
import ResetPassword from "./pages/auth/auth-re-password";
import Signup from "./pages/auth/auth-signup";
import Error from "./pages/Special/error";
import Profies from "./pages/Profies";
import Agents from "./pages/agents";
import AgentDetail from "./pages/agent-detail";
import { Navigate } from "react-router-dom";
import PublicProfile from "./pages/public-profile"; // Import the PublicProfile component
import MessagesPage from "./pages/messages";
import Booking from "./pages/Booking";
import './App.css';
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFail from "./pages/PaymentFail";
import PaymentCancel from "./pages/PaymentCancel";
import { OnlineStatusProvider, useOnlineStatusContext } from "./utils/OnlineStatusContext";
import { io } from "socket.io-client";

function PrivateRoute({ children }) {
    const isLoggedIn = !!localStorage.getItem('thikana_token');
    return isLoggedIn ? children : <Navigate to="/auth-login" replace />;
  }

function OnlineStatusGlobalSocket() {
  const { setOnlineUsers } = useOnlineStatusContext();
  React.useEffect(() => {
    const socket = io("http://localhost:5000", { autoConnect: true, reconnection: true });
    const localUser = localStorage.getItem("thikana_user");
    let myId = null;
    if (localUser) {
      const parsed = JSON.parse(localUser);
      myId = parsed._id || parsed.userId;
    }
    socket.on("connect", () => {
      if (myId) socket.emit("user-online", myId);
    });
    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });
    return () => {
      socket.disconnect();
    };
  }, [setOnlineUsers]);
  return null;
}

function App() {
  const location = useLocation()
  return (
    <OnlineStatusProvider>
      <OnlineStatusGlobalSocket />
    <Routes>
       <Route path="/" element={<Index />}/>
       <Route path="/grid-sidebar" element={<GridSidebar/>}/>
       <Route path="/property-detail" element={<PropertyDetails/>}/>
       <Route path="/property-detail/:id" element={<PropertyDetails/>}/>
       <Route path="/contactus" element={<ContactUs/>}/>
       <Route path="/auth-login" element={<AuthLogin/>}/>
       <Route path="/auth-signup" element={<Signup/>}/>
       <Route path="/auth-reset-password" element={<ResetPassword/>}/>
       <Route path="/error" element={<Error/>}/>
       <Route path="/profiles" element={<PrivateRoute><Profies/></PrivateRoute>}/>
       <Route path="/agents" element={<Agents/>}/>
       <Route path="/agent-detail/:id" element={<AgentDetail/>}/>
       <Route path="/public-profile/:username" element={<PublicProfile/>}/>
       <Route path="/messages" element={<PrivateRoute><MessagesPage /></PrivateRoute>} />
       <Route path="/messages/:userId" element={<PrivateRoute><MessagesPage /></PrivateRoute>} />
       <Route path="/book-agent/:agentId" element={<Booking />} />
       <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
       <Route path="/payment-success" element={<PaymentSuccess />} />
       <Route path="/payment-fail" element={<PaymentFail />} />
       <Route path="/payment-cancel" element={<PaymentCancel />} />
       <Route path="*" element={<Error/>}/>
    </Routes>
    <ScrollTop/>
    </OnlineStatusProvider>
  );
}

export default App;
