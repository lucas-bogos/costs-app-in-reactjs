import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import { Home } from './views/start/Home'
import { Contact } from './views/infos/Contact'
import { NewProject } from './views/projects/NewProject'
import { Company } from './views/about/Company'
import { Projects } from './views/projects/Projects'
import { Container } from './components/layout/case/Container'
import { NavBar } from './components/layout/navegation/NavBar'
import { Footer } from './components/layout/footer/Footer'
import { Project } from './views/projects/Project'

export const App = () => {
  return (
    <BrowserRouter>
        <NavBar/>
      <Container customClass='min-height'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/contato' element={<Contact/>}/>
          <Route path='/novo-projeto' element={<NewProject/>}/>
          <Route path='/projetos' element={<Projects/>}/>
          <Route path='/empresa' element={<Company/>}/>  
          <Route path='/project/:id' element={<Project/>}/>
        </Routes>
      </Container>
        <Footer/>
    </BrowserRouter>
  )
}
