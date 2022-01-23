import styles from './Project.module.css'
import { useParams } from 'react-router-dom'
import {
  useEffect,
  useState
} from 'react'
import { Loading } from '../../components/layout/loaders/Loading'
import { Container } from '../../components/layout/case/Container'
import { ProjectForm } from '../../components/project/ProjectForm'
import { Message } from '../../components/layout/messages/Message'
import { ServiceForm } from '../../components/service/ServiceForm'
import {
  // parse,
  v4 as uuidv4
} from 'uuid'
import { ServiceCard } from '../../components/service/ServiceCard'

export const Project = () => {
  const { id } = useParams()
  const [project, setProject] = useState([])
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [services, setServices] = useState([])
  const [message, setMessage] = useState()
  const [typeMessage, setTypeMessage] = useState()

  useEffect(() => {
    fetch(`http://localhost:5000/projects/${id}`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
          setProject(data)
          setServices(data.services)
      })
      .catch(e => console.log(e))
  }, [id])

  const editPost = (project) => {
    // budget validation
    if (project.budget < project.cost) {
      setMessage('O orçamento não pode ser menor que o custo do projeto!')
      setTypeMessage('error')
      return false
    }

    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(project)
    })
      .then(res => res.json())
      .then(data => {
        setProject(data)
        setShowProjectForm(false)
        setMessage('Projeto atualizado!')
        setTypeMessage('sucess')
      })
      .catch(e => console.log(e))
  }

  // cria de fato um serviço no sistema
  const createService = (project) => {
    setMessage('')
    console.log(project)
    // last service
    const lastService = project.services[project.services.length - 1]

    lastService.id = uuidv4()

    const lastServiceCost = lastService.cost
    console.log('o custo do projeto atual é: ', project.cost)
    const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)
    console.log('o novo custo é: ', newCost)
    console.log('o custo anterior era: ', lastServiceCost)
    // maximum value validation
    if (newCost > parseFloat(project.budget)) {
      setMessage('Orçamento ultrapassado, verifique o valor do serviço!')
      setTypeMessage('error')
      project.services.pop()
      return false
    }

    // add service cost to project cost total
    project.cost = newCost

    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    })
      .then(res => res.json())
      .then(data => {
        setServices(data.services)
        setShowServiceForm(!showServiceForm)
        setMessage('Serviço adicionado!')
        setTypeMessage('sucess')
      })
  }

  const removeService = (id, cost) => {
    const servicesUpdated = project.services.filter(
      service => service.id !== id
    )
    const projectUpdated = project
    projectUpdated.services = servicesUpdated
    projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

    fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(projectUpdated)
    })
      .then(res => res.json())
      .then(() => {
        setProject(projectUpdated)
        setServices(servicesUpdated)
        setMessage('Serviço removido com sucesso!')
        setTypeMessage('sucess')
      })
      .catch(e => console.log(e))
  }

  const toggleProjectForm = () => {
    setShowProjectForm(!showProjectForm)
  }

  const toggleServiceForm = () => {
    setShowServiceForm(!showServiceForm)
  }

  return <> {
    project.name ? (
      <div className={styles.project_details}>
        <Container customClass='column'>
          {message && <Message type={typeMessage} msg={message} />}
          <div className={styles.details_container}>
            <h1>Projeto: {project.name}</h1>
            <button className={styles.btn} onClick={toggleProjectForm}>{
              !showProjectForm ? 'Editar projeto' : 'Fechar'
            }</button>
            {!showProjectForm ? (
              <div className={styles.project_info}>
                <p>
                  <span>Categoria: </span> {project.category.name}
                </p>
                <p>
                  <span>Total de Orçamento: </span> R${project.budget}
                </p>
                <p>
                  <span>Total Utilizado: </span> R${project.cost}
                </p>
              </div>
            ) : (
              <div className={styles.project_info}>
                <ProjectForm
                  handleSubmit={editPost}
                  btnText='Concluir edição'
                  projectData={project}
                />
              </div>
            )}
          </div>
          <div className={styles.service_form_container}>
            <h2>Adicione um serviço: </h2>
            <button className={styles.btn} onClick={toggleServiceForm}>
              {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
            </button>
            <div className={styles.project_info}>
              {showServiceForm && (
                <ServiceForm
                  handleSubmit={createService}
                  btnText='Adicionar serviço'
                  projectData={project}
                />
              )}
            </div>
          </div>
          <h2>Serviços</h2>
          <Container customClass='start'>
            {services.length > 0 && 
              services.map(service => (
                <ServiceCard
                  id={service.id}
                  name={service.name}
                  cost={service.cost}
                  description={service.description}
                  key={service.id}
                  handleRemove={removeService}
                />
              ))
              }
            {services.length === 0 && <p>Não há serviços cadastrados.</p>}
          </Container>
        </Container>
      </div>) : (
      <Loading />
    )}
  </>
}