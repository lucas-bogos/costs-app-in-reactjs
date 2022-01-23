import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { LinkButton } from '../../components/layout/button/LinkButton'
import { Container } from '../../components/layout/case/Container'
import { Message } from '../../components/layout/messages/Message'
import { ProjectCard } from '../../components/project/ProjectCard'
import { Loading } from '../../components/layout/loaders/Loading'
import styles from './Projects.module.css'

export const Projects = () => {
  const [projects, setProjects] = useState([])
  const [removeLoading, setRemoveLoading] = useState(false)
  const [projectMessage, setProjectMessage] = useState('')

  // capta a messagem de onde está vindo o redirect e seta na variável como let message
  const location = useLocation()
  let message = ''
  message = location.state ? location.state : null // somente se vir a mensagem, pelo state

  useEffect(() => {
    fetch('http://localhost:5000/projects', {
      method: 'GET',
      headers: { 'Content-type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setProjects(data)
        setRemoveLoading(true)
      })
      .catch(e => console.log(e))
  }, [])

  const removeProject = (id) => {
    fetch(`http://localhost:5000/projects/${id}`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' }
    })
      .then(res => res.json())
      .then(() => setProjects(
        projects.filter((project) => project.id !== id)))
    setProjectMessage('Projeto removido com sucesso!')
      .catch(e => console.log(e))
  }

  return (
    <section className={styles.project_container}>
      <div className={styles.title_container}>
        <h1>Meus Projetos</h1>
        <LinkButton to='/novo-projeto' text='Criar Projeto' />
      </div>
      {message &&
        <Message type='sucess' msg={message} />
      }
      {projectMessage &&
        <Message type='sucess' msg={projectMessage} />
      }
      <Container customClass='start'>
        {projects.length > 0 && projects.map((project) => (
          <ProjectCard
            name={project.name}
            key={project.id}
            budget={project.budget}
            id={project.id}
            category={project.category.name}
            handleRemove={removeProject}
          />
        ))}
        {!removeLoading && <Loading />}
        {removeLoading && projects.length === 0 && (
          <p>Não há projetos cadastrados!</p>
        )}
      </Container>
    </section>
  )
}