// ProductoCard.tsx
import React from 'react';
import { Button } from 'react-bootstrap'; // Importación corregida
import { useCart } from './CardContext';
import { Link } from 'react-router-dom';
interface ProductoCardProps {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
}

const ProductoCard: React.FC<ProductoCardProps> = ({ id,nombre, precio, imagen }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (product: { id: string, name: string, price: number, image: string }) => {
    addToCart(product);
  };
  return (
    <div className="producto-card">
      <Link to={`/detalleProducto/${id}`}>
        <img src={imagen} alt={nombre} />
      </Link>
      <h3>{nombre}</h3>
      <p>${precio}</p>
      <Button
        style={{fontWeight:"bold",width:"7vw",height:"4vh",fontSize:"13px"}}
        variant='primary'
        onClick={() => handleAddToCart({ id: '9', name: 'Parlante', price: 120, image: 'parlante.png' })}
      >
        Añadir al carrito
      </Button>
    </div>
  );
};

export default ProductoCard;
