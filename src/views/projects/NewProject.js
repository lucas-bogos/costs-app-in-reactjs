import { ProjectForm } from '../../components/project/ProjectForm'
import styles from './NewProjects.module.css'
import { useNavigate } from 'react-router-dom'

export const NewProject = () => {
    // para fazermos redirects 301
    const navigate = useNavigate()

    const createPost = (project) => {
        // inicializa costs e services
        project.cost = 0
        project.services = []

        fetch('http://localhost:5000/projects', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(project)
        })
            .then((res) => res.json())
            .then((data) => {
                navigate('/projetos', { state: 'Projeto criado com sucesso!' })
                console.log(data)
            }) // redirect
            .catch()
    }

    return (
        <section className={styles.newproject_container}>
            <h1>Criar Projeto</h1>
            <p>Crie seu projeto para depois adicionar os serviços</p>
            <ProjectForm 
                btnText='Criar Projeto' 
                handleSubmit={createPost}
            />
        </section>
    )
}