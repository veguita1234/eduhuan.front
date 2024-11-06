import React, { useState, useEffect } from 'react';
import { IoPersonCircleSharp } from "react-icons/io5";
import Modal from 'react-modal';
import Login from '../Login/Login';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import './Header.css';
import { useUser } from '../PaginaPrincipal/UserContext'; // Importa el hook de contexto
import { useCart } from '../AñadirProducto/CardContext';

interface User {
  celular: string | null;
  lastName: string;
  name: string;
  password: string | null;
  tipo: string;
  userId: string;
  userName: string;
}


const Header: React.FC= () => {
  const { userName, setUserName } = useUser();

  const [users, setUsers] = useState<User[]>([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [localCarritoCount, setLocalCarritoCount] = useState<number>(0);
  const { cart, cartCount, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    const storedCarritoCount = localStorage.getItem('carritoCount');
    if (storedCarritoCount) {
      setLocalCarritoCount(parseInt(storedCarritoCount, 10)); // Establecer el contador en el estado
    }
  }, []);

  // Actualizar el localStorage cada vez que cambie el contador del carrito
  useEffect(() => {
    localStorage.setItem('carritoCount', localCarritoCount.toString());
  }, [localCarritoCount]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (storedUser) {
      setUserName(storedUser.userName); 
      setUsername(storedUser.userName);  
      setIsAuthenticated(true);
      setIsAdmin(storedUser.tipo === 'ADMIN');
      setUserId(storedUser.userId);
    } else {
      setIsModalOpen(true);
    }
  }, [setUserName]);

  const handleLoginSuccess = (name: string, role: string) => {
    setUsername(name);
    const user: User = {
      userName: name,
      tipo: role,
      celular: null,
      lastName: '',
      name: '',
      password: null,
      userId: '',
    };
    localStorage.setItem('user', JSON.stringify(user));
    setUsername(name);
    setIsAuthenticated(true);
    setIsAdmin(role === 'ADMIN');
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    setUsername(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserId(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (username) {
          const response = await axios.get(`http://localhost:5221/api/User/users/filter?searchTerm=${username}`);
          setUsers(response.data.users); 
          const user = response.data.users[0]; 
          if (user) {
            setUserId(user.userId); 
            localStorage.setItem('user', JSON.stringify({ ...user, userId: user.userId }));
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchUsers();
  }, [username]);

  return (
    <div className='header'>
      <div style={{ display: "flex", alignItems: "center", height: "16vh", width: "100%", justifyContent: "space-between" }}>
        {isAuthenticated && isAdmin && (
          <div style={{ marginLeft: "20px" }}>
            <Link to='/añadirProducto'>
              <button style={{ color: "white", backgroundColor: "blue", cursor: "pointer" }}>
                Dashboard
              </button>
            </Link>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", marginRight: "20px", marginLeft: "auto", gap: "2em" }}>
          <div style={{ marginLeft: "20px", fontSize: "40px", color: "gray" }}>
            <Link to='/carrito'>
              <AiOutlineShoppingCart style={{ fontSize: "5vh", color: "green" }} />
              {cartCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  backgroundColor: 'red',
                  borderRadius: '50%',
                  color: 'white',
                  padding: '0.2em',
                  fontSize: '12px',
                  width: '20px',
                  height: '20px',
                  textAlign: 'center',
                  marginRight: "11.5vw",
                  marginTop: "4vh"
                }}>
                  {cartCount}
                </div>
              )}
            </Link>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "20px" }}>
              <span style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
                {isAuthenticated ? (
                  <>
                    <span style={{ color: "green", fontWeight: "bold" }}>Hola {username}</span>
                    <button onClick={handleLogout} style={{ color: "blue", fontSize: "small", cursor: "pointer" }}>Cerrar Sesión</button>
                  </>
                ) : (
                  <>
                    <span style={{ color: "green", fontWeight: "bold" }}>Hola</span>
                    <span
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => setIsModalOpen(true)}
                    >
                      Iniciar Sesión
                    </span>
                  </>
                )}
              </span>
            </div>
            <div style={{ borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IoPersonCircleSharp style={{ fontSize: "40px", color: "gray" }} />
            </div>
          </div>
        </div>
      </div>

      <div className='titulo' style={{ display: "flex", flexDirection: "column", gap: "2em", padding: "20px" }}>
        <div>
          <span style={{ fontSize: "60px", color: "green" }}>SABINO</span>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "2em", justifyContent: "center" }}>
          <Link to="/paginaprincipal" style={{ color: "white", textDecoration: "none" }}>Shop</Link>
          <span style={{ color: "white" }}>Aire Acondicionado</span>
          <span style={{ color: "white" }}>Servicios Integrales y Contactos</span>
          <span style={{ color: "white" }}>Únete a Nosotros</span>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Login Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)'
          }
        }}
      >
        <Login closeModal={() => setIsModalOpen(false)} onLoginSuccess={handleLoginSuccess} />
      </Modal>
    </div>
  );
};

export default Header;
