import { Button, Card, Typography } from 'antd'
import {
  CalendarOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useSelector } from 'react-redux'

import { PageContent } from '../../components/UI/PageContent'
import { RootState } from '../../store'
import logo from '../../assets/images/medical-app-logo.png'
import { useStyles } from './styles'

const { Title, Text } = Typography

export const Home = (): JSX.Element => {
  const { styles } = useStyles()
  const { data } = useSelector((state: RootState) => state.AuthReducer)
  const name = data?.name || 'Usuário'

  return (
    <PageContent>
      <div className={styles.background}>
        <div className={styles.topBar}>
          Av. Praia, 40 - Ponta Negra - Natal/RN
        </div>
        <Button
          className={styles.logoutButton}
          icon={<LogoutOutlined style={{ fontSize: 32, color: '#506175' }} />}
        >
          <span className={styles.logoutText}>Sair</span>
        </Button>
        <div className={styles.perfilBox}>
          <img src={logo} alt="Logo" className={styles.perfilImg} />
          <div className={styles.perfilLabel}>
            <Title level={2} className={styles.saudar}>
              Saudações, {name}
            </Title>
            <Title level={2} className={styles.clinica}>
              Clínica da Saúde
            </Title>
          </div>
        </div>
        <div className={styles.mainOptions}>
          <Card hoverable className={styles.optionCard}>
            <div className={styles.optionIcon}>
              <MedicineBoxOutlined />
            </div>
            <Text className={styles.optionText}>Consultas</Text>
          </Card>
          <Card hoverable className={styles.optionCard}>
            <div className={styles.optionIcon}>
              <CalendarOutlined />
            </div>
            <Text className={styles.optionText}>Agenda</Text>
          </Card>
          <Card hoverable className={styles.optionCard}>
            <div className={styles.optionIcon}>
              <FileTextOutlined />
            </div>
            <Text className={styles.optionText}>Exames</Text>
          </Card>
          <Card hoverable className={styles.optionCard}>
            <div className={styles.optionIcon}>
              <UserOutlined />
            </div>
            <Text className={styles.optionText}>Histórico</Text>
          </Card>
          <Card hoverable className={styles.optionCard}>
            <div className={styles.optionIcon}>
              <TeamOutlined />
            </div>
            <Text className={styles.optionText}>Usuários</Text>
          </Card>
        </div>
      </div>
    </PageContent>
  )
}
