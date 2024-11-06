import React from 'react';
import { useCart } from '../../Pages/AñadirProducto/CardContext';
import { Button, Card } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Header from '../PaginaPrincipal/Header';
import { Link } from 'react-router-dom';
import './Carrito.css'

const Carrito = () => {
  const { cart, removeFromCart } = useCart();

  const totalProducts = cart.length;
  const totalPrice = cart.reduce((sum, product) => sum + (product.price || 0), 0).toFixed(2);

  return (
    <div>

      
      {cart.length === 0 ? (
        <div style={{ padding: '20px' ,height:"12vh",width:"80vw",margin:"0 auto",marginTop:"5vh",gap:"2em",alignItems:"center",justifyContent:"center",display:"flex"}}>
          <img style={{height:"10vh"}} src='carrovacio.png' />
          <span style={{width:"15vw"}}>
            <span style={{fontWeight:"bold", color:"#333339",fontSize:"20px"}}>Tu Carro está vacío</span><br/>
            <span style={{ marginTop: "5px", display: "block",fontSize:"16px" }}>¡Aprovecha! Tenemos miles de productos y oportunidades únicas.</span>
          </span>
          
      </div>
      ) : (
        <><div className='pagina-carrito'>
            <span className='carro'><span style={{fontWeight:"bold",color:"#333333"}}>Carro</span><span style={{fontWeight:"200",color:"#4A4A4A"}}> ( producto)</span></span> 
            <span className='resumen'>Resumen de la orden</span>

            <div className='productos'>
            <ul style={{border:"1px solid #E0E0E0",borderRadius:"15px"}}>
              {cart.map(product => (
                <li key={product.id} style={{ marginBottom: '15px',  alignItems: 'center',display:"flex" ,height:"18vh"}}>
                  <img
                    src={product.image}
                    alt={`Imagen de ${product.name}`}
                    style={{ width: '100px', height: 'auto', marginRight: '15px' }}
                  />
                  <span style={{marginLeft:"3vw",fontWeight:"bold",fontSize:"20px",width:"10vw"}}>{product.name}</span>
                  <span style={{ marginLeft: '10vw',width:"6vw" }}>
                    {product.price !== undefined ? `  S/. ${product.price.toFixed(2)}` : ' - Precio no disponible'}
                  </span>
                  <Button style={{marginLeft:"13vw"}} variant="danger" onClick={() => removeFromCart(product.id)}>
                    <FaTrash />
                  </Button>
                </li>
              ))}
            </ul>
            </div>
          
            <Card className='pagar'>
              <Card.Body>
                <Card.Text style={{fontSize:"18px"}}>
                  <span style={{display:"flex",flexDirection:"row"}}>
                    <span style={{width:"8vw"}}>Productos({totalProducts}) </span>
                    <span style={{width:"10vw",marginLeft:"9vw",textAlign:"end",position:"absolute"}}>S/. {totalPrice}</span>
                  </span>
                </Card.Text>
                <Card.Text style={{fontSize:"18px",marginTop:"15px"}}>
                  <span style={{display:"flex",flexDirection:"row"}}>
                    <span style={{width:"8vw"}}>Total:({totalProducts}) </span>
                    <span style={{width:"10vw",marginLeft:"9vw",textAlign:"end",position:"absolute"}}>S/. {totalPrice}</span>
                  </span>
                </Card.Text>
                <Button style={{width:"20vw",height:"5vh",fontSize:"18px",fontWeight:"bold",marginTop:"15vh",
                  color:"white",backgroundColor:"#313A45",borderRadius:"20px",border:"1px transparent"}} variant="primary">Comprar</Button>
                <Link to='/cotizar'><Button style={{width:"20vw",height:"5vh",fontSize:"18px",fontWeight:"bold",marginTop:"5vh",
                  color:"white",backgroundColor:"#313A45",borderRadius:"20px",border:"1px transparent"}} variant="primary">Cotizar</Button></Link>
              </Card.Body>
            </Card>
          </div>

          {/* Tarjeta con resumen del carrito */}
          
        </>
      )}
    
    </div>
  );
};

export default Carrito;
