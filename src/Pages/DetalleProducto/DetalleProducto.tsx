import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HttpModule from '../../Helper/Http.module';
import { IoPersonCircleSharp } from "react-icons/io5";
import { useUser } from '../PaginaPrincipal/UserContext'; // Importar el contexto

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
}

interface Comment {
  calificacionId: string;
  calificacion: number;
  calificacionTexto: string;
  fechaCalificacion: string;
  username: string;
}

const DetalleProducto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { userName } = useUser(); // Obtener el nombre de usuario del contexto
  const [producto, setProducto] = useState<Producto | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [calificacion, setCalificacion] = useState<number>(0);
  const [username, setUsername] = useState<string>(''); 
  const [userId, setUserId] = useState<string | null>(null); // Nuevo estado para userId
  const [highlightedRating, setHighlightedRating] = useState<number | null>(null); // Estado para la calificación resaltada
  const [averageRating, setAverageRating] = useState<number>(0); // Nuevo estado para el promedio de calificaciones

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await HttpModule.get(`Producto/producto/${id}`);
        if (response.data && response.data.success && response.data.producto) {
          const { producto } = response.data;
          setProducto({
            id: producto.id,
            nombre: producto.nombreProducto,
            precio: producto.precio,
            descripcion: producto.descripcion,
            imagen: `http://localhost:5221/api/Producto/productoimage/${producto.imagen}`,
          });
        } else {
          console.error('Estructura de datos inesperada:', response.data);
        }
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      }
    };

    const fetchUser = async () => {
      try {
        // Recuperar el objeto user del localStorage
        const userData = localStorage.getItem('user');
        console.log('Datos del usuario en localStorage:', userData); // Log para ver el contenido de user

        const user = JSON.parse(userData || '{}');
        const userName = user.userName; // Obtén el username
        console.log('aca esta el user:', userName);

        // Realiza la solicitud a la API usando el username
        const response = await HttpModule.get(`User/users/filter?searchTerm=${userName}`);
        console.log('aca estos los otros datos:', response);

        if (response.data.success && response.data.users.$values.length > 0) { // Accede a $values
          const userApi = response.data.users.$values[0]; // Accede al primer usuario
          console.log('Datos del usuario desde la API:', userApi); // Log para mostrar todos los datos del usuario
          console.log('User ID del usuario:', userApi.userId); // Agregado para mostrar el userId
          setUsername(user.userName); // Establece el nombre de usuario
          setUserId(userApi.userId); // Establecer el userId en el estado
        } else {
          console.error('No se encontró el usuario:', response.data);
          alert('No se pudo encontrar el usuario.');
        }
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        alert('Ocurrió un error al intentar obtener el usuario.');
      }
    };

    // Llama a las funciones para obtener los datos
    fetchProducto();
    fetchUser(); // Llama a la función para obtener el usuario
  }, [id]);

  const fetchComments = async () => {
    try {
      if (!userId) {
        console.error('No se pudo obtener el userId');
        return;
      }
      const response = await HttpModule.get(`Calificacion/byproduct/${id}/byuser/${userId}`);
  
      console.log("Respuesta de comentarios:", response.data); // Para verificar la respuesta
  
      if (response.data && Array.isArray(response.data.$values)) {
        const fetchedComments = response.data.$values.map((comment: any) => ({
          calificacionId: comment.calificacionId,
          calificacionTexto: comment.calificacionTexto,
          fechaCalificacion: comment.fechaCalificacion,
          username: comment.username,
          calificacion: comment.calificacion,
        }));
        setComments(fetchedComments);

        const totalRating = fetchedComments.reduce((sum: any, comment:any) => sum + comment.calificacion, 0);
        const average = totalRating / fetchedComments.length;
        setAverageRating(average); // Establece el promedio
      } else {
        setComments([]); // No hay comentarios
      }
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchComments(); // Solo llama a fetchComments si hay un userId disponible
    }
  }, [userId, id]); // Ahora fetchComments está definido antes de ser utilizado

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || calificacion === 0) {
        alert("Por favor, escribe un comentario y selecciona una calificación.");
        return;
    }

    const newCommentDTO = {
        ProductoId: id,
        UserId: userId, // Usar el userId del estado
        Calificacion: calificacion,
        CalificacionTexto: newComment,
    };

    const optimisticComment: Comment = {
        calificacionId: Date.now().toString(),
        calificacionTexto: newComment,
        fechaCalificacion: new Date().toISOString(),
        calificacion: calificacion,
        username: username || 'Usuario Anónimo',
    };

    setComments(prevComments => [...prevComments, optimisticComment]);

    try {
        const response = await HttpModule.post('Calificacion/addcalificacion', newCommentDTO);
        console.log('Respuesta del servidor:', response.data);
      
        if (response.data && response.data.success) {
            alert('Comentario enviado exitosamente.');
            window.location.reload();

        } else {
            console.error('Respuesta inesperada del servidor:', response.data);
            throw new Error('Error al enviar el comentario al servidor.');
            window.location.reload();

        }
    } catch (error: any) {
      if (error.response) {
          console.error('Error en la respuesta del servidor:', error.response.data);
          window.location.reload();

      } else {
          console.error('Error en la solicitud:', error.message || error);
          window.location.reload();

      }
  } finally {
        setNewComment('');
        setCalificacion(0);
    }
};

  const handleDeleteComment = (id: string) => {
    setComments(prevComments => prevComments.filter(comment => comment.calificacionId !== id));
  };

  const handleStarClick = (rating: number) => {
    if (calificacion === rating) {
      setCalificacion(rating - 0.5); // Permitir quitar la media estrella
    } else {
      setCalificacion(rating); // Establece la calificación al hacer clic en una estrella
    }
  };
  

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = calificacion >= i; // Estrella completamente llena
      const isHalfFilled = calificacion >= i - 0.5 && calificacion < i; // Estrella medio llena
  
      stars.push(
        <span
          key={i}
          onClick={() => handleStarClick(i)} 
          onMouseEnter={() => setHighlightedRating(i)} 
          onMouseLeave={() => setHighlightedRating(null)} 
          style={{ cursor: 'pointer', fontSize: '24px', color: isFilled ? 'gold' : isHalfFilled ? 'gold' : 'gray' }} // Cambia el color según el estado
        >
          {isFilled ? '★' : isHalfFilled ? '☆' : '☆'}
        </span>
      );
    }
    return stars;
  };
  
  const renderStarsFromRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        const isFilled = rating >= i; // Estrella completamente llena
        const isHalfFilled = rating >= i - 0.5 && rating < i; // Media estrella

        stars.push(
            <span key={i} style={{ color: isFilled ? 'gold' : isHalfFilled ? 'gold' : 'gray', fontSize: '24px' }}>
                {isFilled ? '★' : isHalfFilled ? '☆' : '☆'} {/* Estrellas de representación */}
            </span>
        );
    }
    return stars;
};



  return (
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column", height: "200vh" }}>
      <br />
      <div style={{ border: "1px solid", width: "60%",  padding: "20px" }}>
        {producto ? (
          <div style={{ display: "flex", flexDirection: "row", gap: "10em" }}>
            <img
              style={{ width: "22vw", height: "25vw" }}
              src={producto.imagen}
              alt={producto.nombre}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
              }}
            />
            <div style={{ border: "1px solid red", display: "flex", flexDirection: "column", alignItems: "start", lineHeight: "0.8", textAlign: "center", justifyContent: "center",width:"25vw",gap:"1em" }}>
              <span>{renderStarsFromRating(averageRating)}</span> {/* Muestra las estrellas promedio */}
              <span style={{ fontSize: "35px" }}>{producto.nombre}</span>
              <p style={{ fontSize: "25px", color: "green" }}>S/ {producto.precio}</p>
              <p style={{ overflowWrap: "break-word", wordWrap: "break-word", wordBreak: "break-word",marginTop:"-1vh" }}>{producto.descripcion}</p><br />
              <button style={{ padding: "10px", backgroundColor: "#05934C", color: "white", border: "1px solid green",  }}>Agregar al carrito</button>
            </div>
          </div>
        ) : (
          <p>Cargando detalles del producto...</p>
        )}
      </div>

      <div style={{ marginTop: "10vh", border: "1px solid", width: "55.5vw", height: "100vh", display: "flex", flexDirection: "column", padding: "20px" }}>
        <h2>Comentarios</h2>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Escribe tu comentario aquí"
            style={{ height: '100px' }}
          />
          <div style={{ margin: "10px 0" }}>
            {renderStars()} {/* Mostrar estrellas aquí */}
          </div>


          <button onClick={handleCommentSubmit}>Enviar Comentario</button>
        </div>

        <h3>Comentarios Recientes:</h3>
        <div style={{ display: "flex", flexDirection: "column", textAlign: "start", width: "30vw", margin: "auto" }}>
  {comments.length > 0 ? (
    comments.map(comment => (
      <div key={comment.calificacionId} style={{ border: "1px solid", padding: "10px", marginTop: "5px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
            <IoPersonCircleSharp style={{ fontSize: "30px", marginRight: "10px" }} />
            <strong>{userName}</strong> - {new Date(comment.fechaCalificacion).toLocaleDateString()}
          </div>
          <div style={{ marginLeft: "auto" }}>
            {renderStarsFromRating(comment.calificacion)}
          </div>
        </div>
        <p style={{ overflowWrap: "break-word", wordWrap: "break-word", wordBreak: "break-word" }}>
          {comment.calificacionTexto}
        </p>
        <button onClick={() => handleDeleteComment(comment.calificacionId)}>Eliminar</button>
      </div>
    ))
  ) : (
    <p>No hay comentarios para este producto.</p>
  )}
</div>



      </div>
    </div>
  );
};

export default DetalleProducto;
