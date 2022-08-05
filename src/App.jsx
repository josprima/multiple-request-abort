import axios from "axios";
import { useEffect, useState } from "react";

const baseUrlEndpoint = process.env.REACT_APP_API_URL;

let controller;

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [todo, setTodo] = useState({});
  const [activeTab, setActiveTab] = useState('todo1');

  const fetchData = async () => {
    setIsLoading(true);

    if (controller) {
      controller.abort();
    }

    controller = new AbortController();

    try {
      let todoEndpoint = baseUrlEndpoint

      if (activeTab === 'todo1') {
        todoEndpoint += `/todos/1`
      } else if (activeTab === 'todo2') {
        todoEndpoint += `/todos/2`
      }

      const response = await axios.get(todoEndpoint, {
        signal: controller.signal,
      });

      setTodo(response.data)

      setIsLoading(false);
    } catch (error) {
      if (!error.code === "ERR_CANCELED") {
        setIsLoading(false)
      }
    }
  };

  const handleClick = (e) => {
    setActiveTab(e.target.value)
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  return (
    <div className="App">
      <div className="App__tab">
        <button
          className={`${activeTab === 'todo1' ? 'active' : ''}`}
          type="button"
          value="todo1"
          onClick={handleClick}
        >
          Todo 1
        </button>
        <button
          className={`${activeTab === 'todo2' ? 'active' : ''}`}
          type="button"
          value="todo2"
          onClick={handleClick}
        >
          Todo 2
        </button>
      </div>

      {isLoading ?
        <h2>Loading...</h2> :
        <div className="App__content">
          <h2>Title: {todo.title}</h2>
          <p>Todo id: {todo.id}</p>
        </div>
      }
    </div>
  );
}

export default App;
