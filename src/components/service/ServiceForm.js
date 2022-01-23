import { useState } from 'react'
import { Input } from '../form/Input'
import { SubmitButton } from '../form/SubmitButton'
import styles from '../project/ProjectCard.module.css'

export const ServiceForm = ({ handleSubmit, btnText, projectData }) => {
  const [service, setService] = useState({})

  const submit = (e) => {
    e.preventDefault()
    projectData.services.push(service)
    handleSubmit(projectData)
  }

  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value })
    console.log('service setado é: ', service)
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <Input
        type='text'
        text='Nome do serviço'
        name='name'
        placeholder='Insira o nome do serviço'
        handleOnChange={handleChange}
      />
      <Input
        type='number'
        text='Custo do serviço'
        name='cost'
        placeholder='Insira o valor do serviço'
        handleOnChange={handleChange}
      />
      <Input
        type='text'
        text='Descrição do serviço'
        name='description'
        placeholder='Escreva o serviço'
        handleOnChange={handleChange}
      />
      <SubmitButton text={btnText}/>
    </form>
  )
}