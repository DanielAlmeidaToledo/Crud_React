import './App.css'

import { useState, useEffect, useRef } from 'react';
import { BsTrash, BsPencil, BsWhatsapp, BsLinkedin, BsGithub, BsWindowSidebar } from 'react-icons/bs';
import Modal from 'react-modal';

const API = "http://localhost:5000";   /* API - JSON */
Modal.setAppElement('#root')

function App() {
  const [title, setTitle] = useState("")
  const [quant, setQuant] = useState("")
  const [price, setPrice] = useState("")
  const [prod, setProd] = useState("")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalIsOpen, setIsOpen] = useState(false)
  const [editIsOpen, setIsOpenE] = useState(false)

  /* === MODAL ===*/

  function handleOpenModal(){
    setIsOpen(true)
  }

  function handleCloseModal(){
    setIsOpen(false)
  }

  function handleOpenEdit(prod){
    setIsOpenE(true);
    setProd(prod)
  }

  function handleCloseEdit(){
    setIsOpenE(false)
  }

  /* === LOADING ===*/

  useEffect(() => {

    const loadData = async () => {
      setLoading(true);

      const res = await fetch(API + "/produtos")
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err))

      setLoading(false)

      setProducts(res);

    };

    loadData();

  }, []);

  /* === ADD ===*/

  const addProduct = async (e) => {

    e.preventDefault();
    
    const product = {
      id: Math.floor(Math.random() * 1000),
      title,
      quant,
      price,
    };

    await fetch(API + "/produtos", {
      method: "POST",
      body: JSON.stringify(product),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setProducts((prevState) => [...prevState, product]);

    handleCloseModal();
    setTitle("");
    setQuant("");
    setPrice("");
  }

  /* === EDIT ===*/

  const handleEdit = async (product) => {
    setTitle(product.title)
    setQuant(product.quant)
    setPrice(product.price)
    handleOpenEdit(product);
    };

  /* === UPDATE ===*/

  const handleUpdate = async () => {

    const data = await fetch(API + "/produtos/" + prod.id, {
      method: "PUT",
      body: JSON.stringify({
        id: prod.id, 
        title: title,
        quant: quant,
        price: price,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setProducts((prevState) => 
      prevState.map((t) => (t.id) === data.id ? (t = data): t));
  }

  /* === DELETE ===*/

  const handleDelete = async (id) => {
    await fetch(API + "/produtos/" + id, {
      method: "DELETE",
    });

    setProducts((prevState) => prevState.filter((product) => product.id !== id));
  };

  if(loading) {
    return <p>Carregando...</p>
  }
 
  return (
    <div className="App">

      <nav>
        <h1>ESTOQUE DE PRODUTOS</h1>        
      </nav>

      <section className='menu'>

        <button 
          className='btnAdd' 
          onClick={handleOpenModal}
        >ADICIONAR</button>

        <Modal 
          className="mod"
          isOpen={modalIsOpen}
          onRequestClose={handleCloseModal}
        >
          <form className='modal'>
            <h2>ADICIONAR</h2>
            <div>
                <label htmlFor="title">NOME DO PRODUTO</label>
                <input 
                  type="text" 
                  name="title" 
                  placeholder='Nome'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
            </div>
            <div>
                <label htmlFor="quant">QUANTIDADE</label>
                <input 
                  type="number" 
                  name="quant" 
                  placeholder='Quantidade'
                  value={quant}
                  onChange={(e) => setQuant(e.target.value)}
                  required
                />   
            </div>
            <div>
                <label htmlFor="price">VALOR UNITÁRIO</label>
                <input 
                  type="number" 
                  name="price" 
                  placeholder='Valor'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                /> 
            </div>
            <div>
                <button 
                  className='btnAdd' 
                  onClick={addProduct}
                >SALVAR</button>

            </div>
          </form>
        </Modal>

        <Modal 
          className="mod"
          isOpen={editIsOpen}
          onRequestClose={handleCloseEdit}
        >
          <form className='modal'>
            <h2>ATUALIZAR</h2>
            <div>
                <label htmlFor="title">NOME DO PRODUTO</label>
                <input 
                type="text" 
                name="title" 
                className={"d1"}
                placeholder='Nome'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                />
            </div>
            <div>
                <label htmlFor="quant">QUANTIDADE</label>
                <input 
                type="number" 
                name="quant" 
                className={"d2"}
                placeholder='Quantidade'
                value={quant}
                onChange={(e) => setQuant(e.target.value)}
                required
                />   
            </div>
            <div>
                <label htmlFor="price">VALOR UNITÁRIO</label>
                <input 
                type="number" 
                name="price" 
                className={"d3"}
                placeholder='Valor'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                /> 
            </div>
            <div>
                <button 
                className='btnAdd'
                onClick={() => handleUpdate()} 
                >ATUALIZAR</button>

            </div>
          </form>
        </Modal>

        <table>
          <tbody>
            <tr className='base'>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Valor Unitário</th>
              <th>Editar</th>
              <th>Excluir</th>
            </tr>
          </tbody>
        </table>

        <table>
        {products.map((product) =>(
          <tbody key={product.id}>
            <tr>
              <th>{product.title}</th>
              <th>{product.quant}</th>
              <th>R$ {product.price}</th>
              <th><BsPencil 
                    className='edit' 
                    onClick={() => handleEdit(product)}
                  /></th>
              <th><BsTrash 
                    className='delete'
                    onClick={() => handleDelete(product.id)}
                  /></th>
            </tr>
          </tbody>

        ))}
        </table>

      </section>

      <footer>
        <div className="ft1">
          <a href="https://www.linkedin.com/in/danielalmeidadetoledo/" className='author' target="_blank">Daniel Toledo </a>©
          <a href="https://reactjs.org/" target="_blank"> React.JS</a>
        </div>
        <div className="ft2">
            <a href="https://wa.me/5515998485252" target="_blank"><BsWhatsapp className='contact'/></a>
            <a href="https://www.linkedin.com/in/danielalmeidadetoledo/" target="_blank"><BsLinkedin className='contact'/></a>
            <a href="https://github.com/DanielAlmeidaToledo" target="_blank"><BsGithub className='contact'/></a>
        </div>
      </footer>

    </div>
  )
}

export default App
