import React, { useState, useEffect } from 'react';
import HttpModule from '../../Helper/Http.module';
import ProductoCard from '../AñadirProducto/ProductoCard';
import './PaginaPrincipal.css';
import { useCart } from '../AñadirProducto/CardContext';
interface Producto {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
}

interface PaginaPrincipalProps {
  actualizarCarrito: (cantidad: number) => void;  // Pasar la función
}

const PaginaPrincipal: React.FC= () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await HttpModule.get('Producto/productos');
        if (response.data && response.data.productos && Array.isArray(response.data.productos.$values)) {
          const productosConId = response.data.productos.$values.map((producto: any) => ({
            id: producto.productoId,
            nombre: producto.nombreProducto,
            precio: producto.precio,
            imagen: `http://localhost:5221/api/Producto/productoimage/${producto.imagen}`,
          }));
          setProductos(productosConId);
        }
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
  
    fetchProductos();
  }, []);


  return (
    <div>
      <main className="main">
        <div className="productos-grid">
          {productos.map((producto) => (
            <ProductoCard
              key={producto.id}
              id={producto.id}
              nombre={producto.nombre}
              precio={producto.precio}
              imagen={producto.imagen}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default PaginaPrincipal;
