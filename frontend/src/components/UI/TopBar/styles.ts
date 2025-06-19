import styled from 'styled-components'
import { createStyles } from 'antd-style'

import { Theme } from '../../../utils/constants/theme'

export const Container = styled.div`
  padding: 20px 25px;
  height: 70px;
  background-color: ${Theme.primary};
  display: flex;
  border-bottom: 2px solid #2e55aa;
`

export const LogoText = styled.h1`
  color: #fff;
  text-shadow: 1px 1px 1px #dce0ea;
  font-size: 25px;
  align-self: center;
  transition: 0.6s;
  font-family: 'Antic Slab', serif;
  cursor: default;

  &:hover {
    text-shadow: 1px 1px 1px #fff;
  }
`

export const useStyles = createStyles(({ css }) => ({
  header: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    width: 100vw;
    max-width: 1468px;
    margin: 0 auto;
    height: 114px;
  `,
  headerContato: css`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    padding: 8px 145px;
    gap: 352px;
    width: 100vw;
    max-width: 1468px;
    height: 43px;
    background: #07b4ba;
  `,
  localBox: css`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 436px;
    height: 27px;
  `,
  localText: css`
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    color: #000;
    font-weight: 400;
    line-height: 20px;
  `,
  contatoBox: css`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 3px;
    width: 373px;
    height: 23px;
  `,
  phoneText: css`
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    color: #000;
    font-weight: 400;
    line-height: 20px;
    margin-left: 8px;
  `,
  headerMenus: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100vw;
    max-width: 1468px;
    height: 75px;
  `,
  logoBox: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 145px;
    gap: 5px;
    width: 100vw;
    max-width: 1468px;
    height: 39px;
  `,
  logoImg: css`
    width: 41px;
    height: 41px;
    object-fit: contain;
  `,
  textLogo: css`
    font-family: 'Inter', sans-serif;
    font-size: 24px;
    color: #ff6b6b;
    font-weight: 400;
    line-height: 29px;
    margin-left: 8px;
  `,
  menuBar: css`
    width: 100vw;
    max-width: 1468px;
    height: 36px;
    background: #c5ebfe;
    margin-top: 0;
  `
}))
