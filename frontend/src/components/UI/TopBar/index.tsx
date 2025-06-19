import { Row, Col, Typography, Space } from 'antd'
import {
  EnvironmentOutlined,
  YoutubeFilled,
  FacebookFilled,
  LinkedinFilled,
  InstagramFilled,
  WhatsAppOutlined
} from '@ant-design/icons'
import { useStyles } from './styles'
import logo from '../../../assets/images/medical-app-logo.png'

const { Text } = Typography

export const TopBar = () => {
  const { styles } = useStyles()

  return (
    <header className={styles.header}>
      <div className={styles.headerContato}>
        <div className={styles.localBox}>
          <EnvironmentOutlined
            style={{ fontSize: 24, color: '#2F88FF', marginRight: 8 }}
          />
          <Text className={styles.localText}>
            Av. Praia, 40 - Ponta Negra - Natal/RN
          </Text>
        </div>
        <div className={styles.contatoBox}>
          <Space size={8}>
            <YoutubeFilled style={{ fontSize: 22, color: '#000' }} />
            <FacebookFilled style={{ fontSize: 22, color: '#000' }} />
            <LinkedinFilled style={{ fontSize: 22, color: '#000' }} />
            <InstagramFilled style={{ fontSize: 22, color: '#000' }} />
            <WhatsAppOutlined style={{ fontSize: 22, color: '#12B3B9' }} />
            <Text className={styles.phoneText}>(84) 99999-9999</Text>
          </Space>
        </div>
      </div>
      <div className={styles.headerMenus}>
        <div className={styles.logoBox}>
          <img src={logo} alt="Logo" className={styles.logoImg} />
          <Text className={styles.textLogo}>Central da Saúde</Text>
        </div>
        <div className={styles.menuBar}></div>
      </div>
    </header>
  )
}
