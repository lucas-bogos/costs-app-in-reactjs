import { useEffect, useState } from "react"
import { Input } from "../form/Input"
import { Select } from "../form/Select"
import { SubmitButton } from "../form/SubmitButton"

export const ProjectForm = ({ 
    btnText,
    handleSubmit,
    projectData
    }) => {
    // o useState foi usado para pegar os dados da api, e setar em categories
    const [categories, setCategories] = useState([])
    const [project, setProject] = useState(projectData || {})

    /* o useEffect, corrigi o problema de várias requests sendo enviadas,
        e renderiza uma única vez por load */
    useEffect(() => {
        fetch('http://localhost:5000/categories', {
            method: 'get',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((e) => console.log(e))
    }, [])

    const submit = (event) => {
        event.preventDefault()
        handleSubmit(project)
    }

    const handleChange = (event) => {
        setProject({ ...project, [event.target.name]: event.target.value})
    }

    const handleCategory = (event) => {
        setProject({ ...project, category: {
            id: event.target.value,
            name: event.target.options[event.target.selectedIndex].text
        }})
    }

    return (
        <form onSubmit={submit}>
            <Input 
                type='text'
                text='Nome do projeto'
                name='name'
                handleOnChange={handleChange}
                placeholder='Insira o nome do projeto'
                value={project.name ? project.name : ''}
            />
            <Input 
                type='number' 
                text='Orçamento do projeto'
                name='budget'
                handleOnChange={handleChange}
                placeholder='Insira o orçamento total' 
            />
            <Select 
                name='category_id'
                text='Selecione a categoria'
                handleOnChange={handleCategory}
                options={categories}
                value={project.category ? project.category.id : ''} // se tiver categoria setar com id categoria, se não matém vazio
            />
            <SubmitButton  
                text={btnText} // insere dinamicamente o nome do botão
            />
        </form>
    )
}