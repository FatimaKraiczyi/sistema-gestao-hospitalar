import { Button, Card, Typography } from 'antd'
import { useSelector } from 'react-redux'

import { PageContent } from '../../components/UI/PageContent'
import { RootState } from '../../store'
import { useStyles } from './styles'
import doctorImg from '../../assets/images/doctor8.svg'
import fisioImg from '../../assets/images/fisioterapia.svg'
import psicologiaImg from '../../assets/images/psicologia.svg'
import medicosImg from '../../assets/images/medicos.svg'
import enfermeirosImg from '../../assets/images/enfermeiros.svg'
import odontologistaImg from '../../assets/images/odontologista.svg'

const { Title, Text } = Typography

export const Home = (): JSX.Element => {
  const { styles } = useStyles()
  const { data } = useSelector((state: RootState) => state.AuthReducer)
  const name = data?.name || 'Usuário'

  return (
    <PageContent>
      <div className={styles.bodyHome}>
        {/* Div Agendar */}
        <div className={styles.divAgendar}>
          <div className={styles.bodyAgendar}>
            <span className={styles.textAgendar}>
              Agende sua consulta agora mesmo!
            </span>
          </div>
          <button className={styles.btnAgendar}>
            <span className={styles.textBtnAgendar}>Agendar</span>
          </button>
        </div>
        {/* Imagem Doctor */}
        <div className={styles.imgDoctor}>
          <img src={doctorImg} alt="Doutor" className={styles.doctorImg} />
        </div>
        {/* Especialidades */}
        <div className={styles.textEspecialidades}>
          <span className={styles.textEspecialidadesTitle}>Especialidades</span>
        </div>
        <div className={styles.especialidades}>
          {/* Fisioterapeutas */}
          <div className={styles.cardEspecialidade}>
            <div
              className={styles.imgEspecialidade}
              style={{ backgroundImage: `url(${fisioImg})` }}
            />
            <div className={styles.retEspecialidade}></div>
            <span className={styles.textEspecialidade}>Fisioterapia</span>
          </div>
          {/* Psicólogos */}
          <div className={styles.cardEspecialidade}>
            <div
              className={styles.imgEspecialidade}
              style={{ backgroundImage: `url(${psicologiaImg})` }}
            />
            <div className={styles.retEspecialidade}></div>
            <span className={styles.textEspecialidade}>Psicologia</span>
          </div>
          {/* Médicos */}
          <div className={styles.cardEspecialidade}>
            <div
              className={styles.imgEspecialidade}
              style={{ backgroundImage: `url(${medicosImg})` }}
            />
            <div className={styles.retEspecialidade}></div>
            <span className={styles.textEspecialidade}>Médicos</span>
          </div>
          {/* Enfermeiros */}
          <div className={styles.cardEspecialidade}>
            <div
              className={styles.imgEspecialidade}
              style={{ backgroundImage: `url(${enfermeirosImg})` }}
            />
            <div className={styles.retEspecialidade}></div>
            <span className={styles.textEspecialidade}>Enfermeiros</span>
          </div>

          {/* Odontologistas */}
          <div className={styles.cardEspecialidade}>
            <div
              className={styles.imgEspecialidade}
              style={{ backgroundImage: `url(${odontologistaImg})` }}
            />
            <div className={styles.retEspecialidade}></div>
            <span className={styles.textEspecialidade}>Odontologistas</span>
          </div>
        </div>
      </div>
    </PageContent>
  )
}
