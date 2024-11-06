import React, { useState } from 'react';
import HttpModule from '../../Helper/Http.module';
import axios from 'axios';

interface ApiResponse {
    success: boolean;
    message: string;
}

const AñadirProducto = () => {
    const [imagenFile, setImagenFile] = useState<File | null>(null);
    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('');
    const [precio, setPrecio] = useState<number | ''>('');
    const [descripcion, setDescripcion] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setImagenFile(event.target.files[0]);
        }
    };

    const handleAddProduct = async () => {
        const formData = new FormData();
        
        if (imagenFile) {
            formData.append('ImageFile', imagenFile);
        }

        formData.append('Nombre', nombre);
        formData.append('Categoria', categoria);
        formData.append('Precio', String(precio));
        formData.append('Descripcion', descripcion);

        try {
            const uploadResponse = await HttpModule.post('Producto/uploadbookimage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            console.log('Imagen subida:', uploadResponse.data);

            const productoData = {
                NombreProducto: nombre,
                Categoria: categoria,
                Precio: precio,
                Descripcion: descripcion,
                Imagen: uploadResponse.data.fileName
            };

            console.log('Datos del producto a enviar:', productoData);

            const addResponse = await HttpModule.post('Producto/addproducto', productoData);
            console.log('Producto añadido:', addResponse.data);
            alert('Producto añadido exitosamente!');
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
              const responseError = error.response.data as { 
                  success: boolean; 
                  message?: string; 
                  errors?: { [key: string]: string[] };
              };
      
              console.error('Error al añadir el producto:', responseError);
      
              if (responseError.errors) {
                  for (const key in responseError.errors) {
                      console.error(`Error en ${key}: ${responseError.errors[key].join(', ')}`);
                      alert(`Error en ${key}: ${responseError.errors[key].join(', ')}`);
                  }
              } else {
                  alert(`Error: ${responseError.message || 'Error desconocido'}`);
              }
          } else {
              console.error('Error inesperado:', error);
          }
      }
    };

    return (
        <div>
            <h2>Añadir Producto</h2>
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
            />
            <input 
                type="text" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                placeholder="Nombre del producto" 
            />
            <select 
                value={categoria} 
                onChange={(e) => setCategoria(e.target.value)}
            >
                <option value="" disabled>--Seleccione una categoría--</option>
                <option value="Shop">Shop</option>
                <option value="Aire Acondicionado">Aire Acondicionado</option>
                <option value="Servicios Integrales y Contactos">Servicios Integrales y Contactos</option>
            </select>
            <input 
                type="number" 
                value={precio} 
                onChange={(e) => setPrecio(Number(e.target.value))} 
                placeholder="Precio" 
            />
            
            <textarea 
                value={descripcion} 
                onChange={(e) => setDescripcion(e.target.value)} 
                placeholder="Descripción" 
            />
            <button onClick={handleAddProduct}>Añadir Producto</button>
        </div>
    );
};

export default AñadirProducto;
