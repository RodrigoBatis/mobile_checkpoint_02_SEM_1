import { ReactNode, createContext, useContext, useState, useEffect } from "react"

interface Task {
    id: number
    title: string
}

interface GlobalStateContext {
    tasks: Task[]
    addTask: (title: string) => void
    updateTask: (id: number, newTitle: string) => void
    deleteTask: (id: number) => void
}


const GlobalStateContext = createContext<GlobalStateContext>({
    tasks: [],
    addTask: () => {},
    updateTask: () => {},
    deleteTask: () => {}
})

export const useGlobalState = () => useContext(GlobalStateContext)

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([])

    const getTask = async () => {
        try {
          const response = await fetch('http://localhost:3000/tarefas');
          if (!response.ok) {
            throw new Error('Não foi possível carregar as tarefas');
          }
    
          const data = await response.json();
          setTasks(data);
        } catch (error) {
          console.error('Erro ao carregar as tarefas:', error);
        }
      };

    const addTask = async (task: string) =>  {

        try {
            const response = await fetch('http://localhost:3000/tarefas', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: task }),
            });

            if (!response.ok) {
                throw new Error('Não foi possível adicionar a tarefa');
              }
        
              const data = await response.json();
              console.log('Nova tarefa adicionada:', data);
        
              // Atualiza o estado das tarefas com a nova tarefa
              setTasks([...tasks, data]);
              
        } catch (error) {
            console.error('Erro ao adicionar a tarefa:', error);
        }
    }

    const updateTask = async (id: number, newTitle: string) => {
        try {
          const response = await fetch(`http://localhost:3000/tarefas/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task: newTitle }),
          });
    
          if (!response.ok) {
            throw new Error('Não foi possível editar a tarefa');
          }
    
          console.log('Tarefa editada com sucesso');
    
          // Atualiza o estado das tarefas após a edição
          const newTasks = tasks.map(task =>
            task.id === id ? { ...task, task: newTitle } : task
          );
          setTasks(newTasks);
    
        } catch (error) {
          console.error('Erro ao editar a tarefa:', error);
        }
      };

      const deleteTask = async (id: number) => {
        try {
          const response = await fetch(`http://localhost:3000/tarefas/${id}`, {
            method: 'DELETE',
          });
    
          if (!response.ok) {
            throw new Error('Não foi possível excluir a tarefa');
          }
    
          console.log('Tarefa excluída com sucesso');
    
          // Atualiza o estado das tarefas após a exclusão
          const newTasks = tasks.filter(task => task.id !== id);
          setTasks(newTasks);
    
        } catch (error) {
          console.error('Erro ao excluir a tarefa:', error);
        }
      };

      useEffect(() => {
        getTask();
      }, []);

    return (
        <GlobalStateContext.Provider value={{tasks, addTask, deleteTask, updateTask}}>
            {children}
        </GlobalStateContext.Provider>
    )
} 